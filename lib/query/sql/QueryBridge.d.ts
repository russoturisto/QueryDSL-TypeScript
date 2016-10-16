import { IQEntity } from "../../core/entity/Entity";
import { EntityMetadata } from "../../core/entity/EntityMetadata";
import { RelationRecord } from "../../core/entity/Relation";
import { MappedEntityArray } from "../../core/MappedEntityArray";
import { LastObjectTracker } from "./LastObjectTracker";
import { SQLDataType } from "./SQLStringQuery";
/**
 * Created by Papa on 10/8/2016.
 */
export interface ManyToOneStubReference {
    mtoParentObject: any;
    mtoRelationField: string;
    otmEntityField: string;
    otmEntityId: string | number;
    otmEntityIdField: string;
    otmEntityName: string;
}
export interface OneToManyStubReference {
    otmEntityName: string;
    otmObject: any;
}
export interface EntityReference {
    idFieldName: string;
    entityObject: any;
}
export declare class QueryBridgeConfiguration {
    failOnConflicts: boolean;
}
export interface IQueryBridge {
    addEntity(entityAlias: string, resultObject: any): void;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string): void;
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferBlankManyToOne(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferOneToManyStub(resultObject: any, entityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): any[] | MappedEntityArray<any>;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: RelationRecord;
    }, entityId: any, resultObject: any): void;
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[] | MappedEntityArray<any>;
}
export declare class OtmObjectReference {
    mtoEntityReferenceMap: {
        [otmReferenceEntityName: string]: {
            [otmReferenceId: string]: {
                [otmProperty: string]: MappedEntityArray<any>;
            };
        };
    };
    otmEntityReferenceMap: {
        [otmEntityName: string]: {
            [otmEntityId: string]: any;
        };
    };
    addMtoReference(mtoStubReference: ManyToOneStubReference, mtoEntityId: string | number): void;
    addOtmReference(otmStubReference: OneToManyStubReference, otmEntityId: string | number): void;
    populateOtms(entityMap: {
        [entityName: string]: {
            [entityId: string]: any;
        };
    }, keepMappedEntityArrays: boolean): void;
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
export declare class QueryBridge implements IQueryBridge {
    private performBridging;
    private mapEntityArrays;
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
    otmObjectReference: OtmObjectReference;
    lastObjectTracker: LastObjectTracker;
    mtoStubReferenceMap: {
        [mtoEntityName: string]: {
            [mtoEntityId: string]: any[];
        };
    };
    otmStubBuffer: OneToManyStubReference[];
    mtoStubBuffer: ManyToOneStubReference[];
    constructor(performBridging: boolean, mapEntityArrays: boolean, config: QueryBridgeConfiguration, qEntity: IQEntity, qEntityMap: {
        [entityName: string]: IQEntity;
    });
    addEntity(entityAlias: string, resultObject: any): void;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string): void;
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): any;
    private bufferManyToOne(resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
    bufferBlankManyToOne(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferOneToManyStub(resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): any[] | MappedEntityArray<any>;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): any[] | MappedEntityArray<any>;
    private bufferOneToMany(resultObject, otmEntityName);
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: RelationRecord;
    }, entityId: any, resultObject: any): void;
    private getEntityToFlush(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
    private mergeEntities(source, target, qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap);
    flushOneToManyStubBuffer(qEntity: IQEntity, entityMetadata: EntityMetadata, entityId: any): void;
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[];
}
