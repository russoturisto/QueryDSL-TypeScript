import { IQEntity } from "../../core/entity/Entity";
import { EntityMetadata } from "../../core/entity/EntityMetadata";
/**
 * Created by Papa on 10/8/2016.
 */
export interface QueryStubReference {
    propertyName: string;
    parentObject: any;
}
export interface OneToManyStubReference extends QueryStubReference {
    manyEntitySet: {
        [id: string]: any;
    };
}
export interface EntityReference {
    idFieldName: string;
    entityObject: any;
}
/**
 * Making sense of it all
 *
 * A key benefit of a relational database is that it has a schema, which allows you to come up with object graphs.
 * One of initial design goals for PH was to automatically re-construct these graphs for a given query result.
 * Re-construction basically does the following:
 *
 * 1) De-dupe the object graph
 * 2) Populate all Many-To-One stubs with object references
 * 3) Re-create One-To-Many lists
 *
 * Keeping track of relations:
 *
 * search, searchOne, find, findOne  get two new interfaces.
 *
 * Query Objects, or EntityManager, or LocalStore get two more interfaces
 * or two !functions!
 *
 * linked - will link all entities inside the query into as cohesive of a sub-graph as you configure it to be
 * mapped - will lace the One-To-Many arrays and add a Map interface (arrays will still serialize as such with
 * JSON.stringify)
 *
 * in a given Query tree:
 * b = {
         *  a: { // ManyToOne
         *  	b: null, // OneToMany
         *    c: null	 // OneToMany
         *  },
         * 	c: { // OneToMany
         * 	   a: null, // ManyToOne
         * 	   b: null // ManyToOne
         * 	}
         * }
 *
 * relations are tracked via foreign keys
 * hence it is possible to re-construct relationships for the sub-tree to arrive at:
 * bs = [b1 = {
         *  a: {
         *  	b: [b1, b2]
         *    c: b1.c.concat(b2.c).concat(...)
         *  },
         * 	c: [
         * 	 {
         * 	    a: a
         * 	 	  b: b1
         * 	 }
         * 	]
         * }, b2, ...]
 *
 * Reconstruction will only work if the ids of objects are present in the select clause.  Objects with no ids will
 * be ignored.
 * Reconstruction will only be kicked off only if the stubs are provided in the query.  Any stubs that are not provided
 * explicitly will not be populated. Stubs are populated only from the results of the query. If the there is a stub
 * for an entity that was not returned by the query it will not be populated.
 * Hence what you can arrive at is a complete sub-graph for a query.
 *
 * Before you can re-construct the graph you have to de-dupe it.  Within the returned result set entities can
 * be duplicated. For example given a schema:
 *
 * @Entity
 * Category {
 *   @Id
 *   id
 *   @OneToMany
 *   relatedGoals:CategoryForGoal[];
 * }
 *
 * @Entity
 * CategoryForGoal {
 *   @Id
 *   id
 *   @ManyToOne
 *   category:Category;
 *   @ManyToOne
 *   goal:Goal;
 * }
 *
 * @Entity
 * Goal {
 *   @Id
 *   id
 *   @OneToMany
 *   relatedCategories:CategoryForGoal[];
 *   @OneToMany
 *   tasks:Task[];
 * }
 *
 * @Entity
 * Task {
 * 	@Id
 * 	id
 * 	@ManyToOne
 * 	goal:Goal
 * }
 * and a query:
 *
 * QCategory.find({
 *  select: {
 *    id: null,
 *    relatedGoals: {
 *      id: null,
 *      category: null,
 *      goal: {
 *        id: null,
 *        relatedCategories: null;
 *        tasks:{}
 *      }
 *    }
 *  },
 *  from: [
 *    c = QCategory.from,
 *    cfg = c.relatedGoals.leftJoin(),
 *    g = cfg.goal.leftJoin(),
 *    t = g.tasks.leftJoin()
 *  ],
 *  where: or(
 *  	c.id.isIn(1, 2, ...),
 *  	t.id.isIn(1, 2, ...)
 *  )
 * })
 *
 * FOR NOW ASSUMING THAT WITH THE OR CLAUSE ALL TASKS ARE RETURNED AND IF IT WERE TO BE CHANGED TO AN AND
 * THE SAME TASKS WOULD ALWAYS BE RETURNED.
 *
 * A given goal can show up under different categories.  Currently, the query API does not allow for a given entity
 * type to show up more than once in the query graph.  This means that we are guaranteed that all objects of a given
 * entity will have the same API.  Hence, we can de-dupe the graph by first mapping every entity
 *  [by Type]:[by id]: InstanceObject
 * And then passing though the returned graph and replacing any found duplicates with entries from the map. After
 * that we can attempt to reconcile all Many-To-One stubs and convert all One-To-Many placeholders to Arrays of all
 * matching objects in the returned sub-graph.
 *
 * Here, once again, because the query graph is constrained to have a
 * particular entity defined only once in it, we are guaranteed to have every entity
 * Reconstruction has two types:
 *
 *  a)  Reconstruct the Many-To-One relations by Id
 *    for this we need
 *    1)  a map of all entities [by Type]:[by id]:Entity
 *    2)  a map of all stubs Many-To-One stubs, [by Type]:[by id]: { propertyName, parentObject }
 *    Then it's a simple operation of mapping all available entities to all stubs
 *  b)  Reconstruct the One-To-Many relations by Tree
 *    for this we need
 *    1)  the entity map from 1a)
 *    2)  a similar map of all One-To-Many stubs, [by Type]:[by id]: { propertyName, parentObject,
  *    manyEntitySet }
 *      where manyEntitySet is a set of all entities in a given OneToMany collection, by their id
 *    Then we need to navigate all entities in the entity map, and
 *      - for every found Many-To-One reference in each entity
 *       * Lookup the related One-To-Many stub
 *       * If the stub is found, add this entity to the manyEntitySet
 *      - at the end we need to go though all the One-To-Many stubs and create arrays ouf of the sets
 *
 * Bookmark
 *  categories: OTM {
 *    actions:OTM
 *      categories:OTM
 *
 *
 */
export declare class QueryLinker {
    private performLinking;
    qEntity: IQEntity;
    qEntityMap: {
        [entityName: string]: IQEntity;
    };
    entityMap: {
        [entityName: string]: {
            [entityId: string]: EntityReference;
        };
    };
    mtoStubReferenceMap: {
        [otmEntityName: string]: {
            [otmEntityId: string]: QueryStubReference[];
        };
    };
    otmStubBuffer: OneToManyStubReference[];
    otmStubReferenceMap: {
        [otmEntityName: string]: {
            [otmEntityId: string]: OneToManyStubReference[];
        };
    };
    constructor(performLinking: boolean, qEntity: IQEntity, qEntityMap: {
        [entityName: string]: IQEntity;
    });
    addEntity(qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string): void;
    addManyToOneStub(qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relatedEntityId: any): void;
    bufferOneToManyStub(resultObject: any, propertyName: string): void;
    flushOneToManyStubBuffer(qEntity: IQEntity, entityMetadata: EntityMetadata, entityId: any): void;
    link(parsedResults: any[]): void;
    private deDuplicate(qEntity, selectClauseFragment, parsedResults);
    private mergeEntities(source, target);
    private deDuplicateCollection();
}
