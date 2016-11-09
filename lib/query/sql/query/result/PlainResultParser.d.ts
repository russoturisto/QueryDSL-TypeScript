import { IEntityResultParser, AbstractObjectResultParser } from "./entity/IEntityResultParser";
import { IQEntity } from "../../../../core/entity/Entity";
import { EntityMetadata } from "../../../../core/entity/EntityMetadata";
import { EntityRelationRecord } from "../../../../core/entity/Relation";
import { SQLDataType } from "../../../../core/field/Appliable";
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this parser is to split a flat row of result set cells into an object graph (just for that row).
 */
export declare class PlainResultParser extends AbstractObjectResultParser implements IEntityResultParser {
    addEntity(entityAlias: string, qEntity: IQEntity): any;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string, propertyValue: any): void;
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationGenericQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, childResultObject: any): any;
    bufferBlankManyToOneStub(entityAlias: string, resultObject: any, propertyName: string, relationEntityMetadata: EntityMetadata): void;
    bufferBlankManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferOneToManyStub(otmEntityName: string, otmPropertyName: string): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: EntityRelationRecord;
    }, entityId: any, resultObject: any): any;
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[];
}
