import { IQEntity } from "../../../core/entity/Entity";
import { EntityMetadata } from "../../../core/entity/EntityMetadata";
import { RelationRecord } from "../../../core/entity/Relation";
import { HierachicyTracker } from "./HierachicyTracker";
import { SQLDataType } from "../SQLStringQuery";
import { BridgedQueryOtmMapper, OneToManyStubReference } from "./BridgedOtmMapper";
import { BridgedQueryMtoMapper, ManyToOneStubReference } from "./BridgedMtoMapper";
import { IQueryParser, QueryResultType, BridgedQueryConfiguration } from "./IQueryParser";
/**
 * Created by Papa on 10/8/2016.
 */
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
export declare class QueryBridge implements IQueryParser {
    private queryResultType;
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
    otmMapper: BridgedQueryOtmMapper;
    mtoMapper: BridgedQueryMtoMapper;
    hierarchyTracker: HierachicyTracker;
    otmStubBuffer: OneToManyStubReference[];
    mtoStubBuffer: ManyToOneStubReference[];
    currentResultRow: any[];
    constructor(queryResultType: QueryResultType, config: BridgedQueryConfiguration, qEntity: IQEntity, qEntityMap: {
        [entityName: string]: IQEntity;
    });
    addEntity(entityAlias: string, qEntity: IQEntity): void;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string, propertyValue: any): void;
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    private addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, childResultObject: any): any;
    private bufferManyToOne(entityName, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
    bufferBlankManyToOne(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferOneToManyStub(otmEntityName: string, otmPropertyName: string): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    private bufferOneToMany(otmEntityName, otmPropertyName);
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: RelationRecord;
    }, entityId: any, resultObject: any): void;
    private getEntityToFlush(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
    private mergeEntities(source, target, qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap);
    private flushRelationStubBuffers(entityId, currentEntity);
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[];
}
