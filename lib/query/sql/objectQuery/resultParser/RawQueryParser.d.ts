import { IQueryParser } from "./IQueryParser";
import { IQEntity } from "../../../../core/entity/Entity";
import { SQLDataType } from "../../SQLStringQuery";
import { EntityMetadata } from "../../../../core/entity/EntityMetadata";
import { RelationRecord } from "../../../../core/entity/Relation";
/**
 * Created by Papa on 10/16/2016.
 */
export declare class RawQueryParser implements IQueryParser {
    currentResultRow: any[];
    addEntity(entityAlias: string, qEntity: IQEntity): any;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string, propertyValue: any): void;
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferBlankManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, childResultObject: any): any;
    bufferBlankManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferOneToManyStub(otmEntityName: string, otmPropertyName: string): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: RelationRecord;
    }, entityId: any, resultObject: any): any;
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[];
}
