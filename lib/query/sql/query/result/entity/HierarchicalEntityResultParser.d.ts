import { IEntityResultParser } from "./IEntityResultParser";
import { IQEntity } from "../../../../../core/entity/Entity";
import { EntityMetadata } from "../../../../../core/entity/EntityMetadata";
import { EntityRelationRecord } from "../../../../../core/entity/Relation";
import { HierarchicalResultParser } from "../HierarchicalResultParser";
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
export declare class HierarchicalEntityResultParser extends HierarchicalResultParser implements IEntityResultParser {
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
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationGenericQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    private addManyToOneReference(entityAlias, resultObject, propertyName, manyToOneIdField);
    bufferBlankManyToOneStub(entityAlias: string, resultObject: any, propertyName: string, relationEntityMetadata: EntityMetadata): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    addManyToOneStub(resultObject: any, propertyName: string, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferBlankManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferOneToManyStub(otmEntityName: string, otmPropertyName: string): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: EntityRelationRecord;
    }, entityId: any, resultObject: any): any;
    bridge(parsedResults: any[], selectClauseFragment: any): any[];
}
