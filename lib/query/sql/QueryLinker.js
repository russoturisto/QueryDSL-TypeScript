"use strict";
var QueryTreeNode_1 = require("../noSql/QueryTreeNode");
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
 * }

 *
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
 *      }
 *    }
 *  },
 *  from: [
 *    c = QCategory.from,
 *    cfg = c.relatedGoals.leftJoin(),
 *    g = cfg.goal.leftJoin()
 *  ],
 *  where: c.id.isIn(1, 2, ...)
 * })
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
var QueryLinker = (function () {
    function QueryLinker(performLinking, qEntity, qEntityMap) {
        this.performLinking = performLinking;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        // Keys can only be strings or numbers | TODO: change to JS Maps, if needed
        this.entityMap = {};
        // Many-To-One stubs
        this.mtoStubReferenceMap = {};
        // One-To-Many temp stubs (before entityIds are available
        this.otmStubBuffer = [];
        // One-To-Many stubs
        this.otmStubReferenceMap = {};
    }
    QueryLinker.prototype.addEntity = function (qEntity, entityMetadata, resultObject, propertyName) {
        if (!this.performLinking) {
            return;
        }
        if (entityMetadata.idProperty != propertyName) {
            return;
        }
        var entityMapForType = this.entityMap[qEntity.__entityName__];
        if (!entityMapForType) {
            entityMapForType = {};
            this.entityMap[qEntity.__entityName__] = entityMapForType;
        }
        entityMapForType[resultObject[propertyName]] = {
            idFieldName: propertyName,
            entityObject: resultObject
        };
    };
    QueryLinker.prototype.addManyToOneStub = function (qEntity, entityMetadata, resultObject, propertyName, relatedEntityId) {
        var manyToOneStub = {};
        resultObject[propertyName] = manyToOneStub;
        var relation = qEntity.__entityRelationMap__[propertyName];
        var relationQEntity = this.qEntityMap[relation.entityName];
        var relationEntityMetadata = relationQEntity.__entityConstructor__;
        manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
        if (!this.performLinking) {
            return;
        }
        var stubMapForOtmType = this.mtoStubReferenceMap[relationQEntity.__entityName__];
        if (!stubMapForOtmType) {
            stubMapForOtmType = {};
            this.mtoStubReferenceMap[relationQEntity.__entityName__] = stubMapForOtmType;
        }
        var otmStubReferences = stubMapForOtmType[relatedEntityId];
        if (!otmStubReferences) {
            otmStubReferences = [];
            stubMapForOtmType[relatedEntityId] = otmStubReferences;
        }
        otmStubReferences.push({
            propertyName: propertyName,
            parentObject: resultObject
        });
    };
    QueryLinker.prototype.bufferOneToManyStub = function (resultObject, propertyName) {
        this.otmStubBuffer.push({
            propertyName: propertyName,
            parentObject: resultObject,
            manyEntitySet: {}
        });
    };
    QueryLinker.prototype.flushOneToManyStubBuffer = function (qEntity, entityMetadata, entityId) {
        if (!this.performLinking) {
            return;
        }
        var stubBuffer = this.otmStubBuffer;
        this.otmStubBuffer = [];
        var otmStubMapForType = this.otmStubReferenceMap[qEntity.__entityName__];
        if (!otmStubMapForType) {
            otmStubMapForType = {};
            this.otmStubReferenceMap[qEntity.__entityName__] = otmStubMapForType;
        }
        var otmStubReferences = otmStubMapForType[entityId];
        if (otmStubReferences) {
            throw "Unexpected OneToManyStubReference for entity name '" + qEntity.__entityName__ + "', id: '" + entityId + "'";
        }
        otmStubMapForType[entityId] = this.otmStubBuffer;
    };
    QueryLinker.prototype.link = function (parsedResults) {
        if (!this.performLinking) {
            return;
        }
        for (var entityName in this.mtoStubReferenceMap) {
            var entityMapForType = this.entityMap[entityName];
            if (!entityMapForType) {
                continue;
            }
            var stubMapForType = this.mtoStubReferenceMap[entityName];
            var _loop_1 = function(entityId) {
                var entityReference = entityMapForType[entityId];
                if (!entityReference) {
                    return "continue";
                }
                var stubReferences = stubMapForType[entityId];
                stubReferences.forEach(function (stubReference) {
                    stubReference.parentObject[stubReference.propertyName] = entityReference.entityObject;
                });
            };
            for (var entityId in stubMapForType) {
                var state_1 = _loop_1(entityId);
                if (state_1 === "continue") continue;
            }
        }
        for (var entityName in this.otmStubReferenceMap) {
            var entityMapForType = this.entityMap[entityName];
            var stubMapForType = this.otmStubReferenceMap[entityName];
            for (var entityId in stubMapForType) {
                var stubReference = stubMapForType[entityId];
            }
        }
    };
    QueryLinker.prototype.deDuplicate = function (selectClauseFragment, parsedResults) {
        var _this = this;
        parsedResults.forEach(function (result) {
            for (var propertyName in _this.qEntity.__entityRelationMap__) {
                var entityRelation = _this.qEntity.__entityRelationMap__[propertyName];
                switch (entityRelation.relationType) {
                    case QueryTreeNode_1.RelationType.MANY_TO_ONE:
                        break;
                    case QueryTreeNode_1.RelationType.ONE_TO_MANY:
                        break;
                }
            }
        });
    };
    return QueryLinker;
}());
exports.QueryLinker = QueryLinker;
//# sourceMappingURL=QueryLinker.js.map