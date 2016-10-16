/**
 * Created by Papa on 10/16/2016.
 */
import { SQLDataType } from "../SQLStringQuery";
import { IQEntity } from "../../../core/entity/Entity";
import { EntityMetadata } from "../../../core/entity/EntityMetadata";
import { MappedEntityArray } from "../../../core/MappedEntityArray";
import { RelationRecord } from "../../../core/entity/Relation";
export declare enum QueryResultType {
    BRIDGED = 0,
    HIERARCHICAL = 1,
    PLAIN = 2,
    RAW = 3,
}
export declare class BridgedQueryConfiguration {
    strict: boolean;
    mapped: boolean;
}
export interface IQueryBridge {
    addEntity(entityAlias: string, resultObject: any): any;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string, propertyValue: any): void;
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferBlankManyToOne(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferOneToManyStub(entityName: string, otmPropertyName: string): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: RelationRecord;
    }, entityId: any, resultObject: any): void;
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[] | MappedEntityArray<any>;
}
