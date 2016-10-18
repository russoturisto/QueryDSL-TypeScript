import { IResultParser, AbstractObjectResultParser } from "./IResultParser";
import { IQEntity } from "../../../../core/entity/Entity";
import { SQLDataType } from "../../SQLStringQuery";
import { EntityMetadata } from "../../../../core/entity/EntityMetadata";
import { RelationRecord } from "../../../../core/entity/Relation";
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
export declare class HierarchicalResultParser extends AbstractObjectResultParser implements IResultParser {
    currentRowObjectMap: {
        [alias: string]: any;
    };
    objectEqualityMap: {
        [alias: string]: boolean;
    };
    lastRowObjectMap: {
        [alias: string]: any;
    };
    currentObjectOneToManys: {
        [propertyName: string]: any[];
    };
    addEntity(entityAlias: string, qEntity: IQEntity): any;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string, propertyValue: any): void;
    private isDifferentOrDoesntExist(entityAlias, resultObject, propertyName);
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationGenericQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    private addManyToOneReference(entityAlias, resultObject, propertyName, manyToOneIdField);
    bufferBlankManyToOneStub(entityAlias: string, resultObject: any, propertyName: string, relationEntityMetadata: EntityMetadata): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferBlankManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferOneToManyStub(otmEntityName: string, otmPropertyName: string): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    addOneToManyCollection(entityAlias: string, resultObject: any, propertyName: string): void;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: RelationRecord;
    }, entityId: any, resultObject: any): any;
    mergeEntity(entityAlias: string, resultObject: any): any;
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[];
}
