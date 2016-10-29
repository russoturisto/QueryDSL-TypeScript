/**
 * Created by Papa on 10/16/2016.
 */
import { SQLDataType, QueryResultType } from "../../SQLStringQuery";
import { IQEntity } from "../../../../core/entity/Entity";
import { EntityMetadata } from "../../../../core/entity/EntityMetadata";
import { MappedEntityArray } from "../../../../core/MappedEntityArray";
import { EntityRelationRecord } from "../../../../core/entity/Relation";
export declare class BridgedQueryConfiguration {
    strict: boolean;
    mapped: boolean;
}
export interface IEntityResultParser {
    addEntity(entityAlias: string, resultObject: any): any;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string, propertyValue: any): void;
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationGenericQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferBlankManyToOneStub(entityAlias: string, resultObject: any, propertyName: string, relationEntityMetadata: EntityMetadata): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferBlankManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferOneToManyStub(entityName: string, otmPropertyName: string): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: EntityRelationRecord;
    }, entityId: any, resultObject: any): any;
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[] | MappedEntityArray<any>;
}
export declare function getObjectResultParser(queryResultType: QueryResultType, config: BridgedQueryConfiguration, rootQEntity: IQEntity, qEntityMapByName: {
    [entityName: string]: IQEntity;
}): IEntityResultParser;
export declare abstract class AbstractObjectResultParser {
    protected addManyToOneStub(resultObject: any, propertyName: string, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
}
