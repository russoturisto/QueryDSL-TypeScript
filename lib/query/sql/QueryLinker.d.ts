import { IQEntity } from "../../core/entity/Entity";
import { EntityMetadata } from "../../core/entity/EntityMetadata";
/**
 * Created by Papa on 10/8/2016.
 */
export interface ManyToOneStubReference {
    otmEntityId: string | number;
    otmEntityIdField: string;
    otmEntityName: string;
    mtoRelationField: string;
    mtoParentObject: any;
}
export interface OneToManyStubReference {
    propertyName: string;
    parentObject: any;
    manyEntitySet: {
        [id: string]: any;
    };
}
export interface EntityReference {
    idFieldName: string;
    entityObject: any;
}
export declare class QueryBridgeConfiguration {
    failOnConflicts: boolean;
}
/**
 a) Reconstruct the Many-To-One relations by Id
 for this we need
 1) a map of all entities [by Type]:[by id]:Entity
 2) a map of all stubs Many-To-One stubs, [by Type]:[by id]: { propertyName, parentObject }
 Then it's a simple operation of mapping all available entities to all stubs
 b) Reconstruct the One-To-Many relations by Tree
 for this we need
 1) the entity map from 1a)
 2) a similar map of all One-To-Many stubs, [by Type]:[by id]: { propertyName, parentObject,
manyEntitySet }
 where manyEntitySet is a set of all entities in a given OneToMany collection, by their id
 Then we need to navigate all entities in the entity map, and
 - for every found Many-To-One reference in each entity
 Lookup the related One-To-Many stub
 If the stub is found, add this entity to the manyEntitySet
 - at the end we need to go though all the One-To-Many stubs and create arrays ouf of the sets
 */
export declare class QueryBridge {
    private performBridging;
    private config;
    qEntity: IQEntity;
    qEntityMap: {
        [entityName: string]: IQEntity;
    };
    entityMap: {
        [entityName: string]: {
            [entityId: string]: any;
        };
    };
    mtoStubReferenceMap: {
        [otmEntityName: string]: {
            [otmEntityId: string]: {
                [mtoEntityId: string]: any;
            };
        };
    };
    otmStubBuffer: OneToManyStubReference[];
    mtoStubBuffer: ManyToOneStubReference[];
    currentEntity: any;
    otmStubReferenceMap: {
        [mtoEntityName: string]: {
            [mtoEntityId: string]: OneToManyStubReference[];
        };
    };
    constructor(performBridging: boolean, config: QueryBridgeConfiguration, qEntity: IQEntity, qEntityMap: {
        [entityName: string]: IQEntity;
    });
    addEntity(qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, selectClauseFragment: any): void;
    private mergeEntities(source, target, qEntity, selectClauseFragment);
    addManyToOneStub(qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relatedEntityId: any): void;
    bufferManyToOneStub(qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relatedEntityId: any): void;
    bufferOneToManyStub(resultObject: any, propertyName: string): void;
    flush(qEntity: IQEntity, entityMetadata: EntityMetadata, entityId: any, resultObject: any): void;
    flushOneToManyStubBuffer(qEntity: IQEntity, entityMetadata: EntityMetadata, entityId: any): void;
    bridge(parsedResults: any[], selectClauseFragment: any): void;
    private deDuplicate(qEntity, selectClauseFragment, parsedResults);
    private deDuplicateCollection();
}
