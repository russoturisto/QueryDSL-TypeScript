import { IEntity, IQEntity } from "../../core/entity/Entity";
import { ISQLAdaptor } from "./adaptor/SQLAdaptor";
import { SQLDialect } from "./SQLStringQuery";
import { RelationRecord, JoinTreeNode } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { ColumnConfiguration, JoinColumnConfiguration } from "../../core/entity/metadata/ColumnDecorators";
import { FieldMap } from "./FieldMap";
/**
 * Created by Papa on 10/2/2016.
 */
export declare abstract class SQLStringWhereBase<IE extends IEntity> {
    qEntity: IQEntity;
    qEntityMap: {
        [entityName: string]: IQEntity;
    };
    entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    };
    entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    };
    protected dialect: SQLDialect;
    fieldMap: FieldMap;
    joinAliasMap: {
        [key: string]: string;
    };
    sqlAdaptor: ISQLAdaptor;
    constructor(qEntity: IQEntity, qEntityMap: {
        [entityName: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect);
    protected getWHEREFragment(operation: JSONBaseOperation, nestingIndex: number, joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }, embedParameters?: boolean, parameters?: any[]): string;
    private getComparibleOperatorAndValueFragment<T>(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters?, parameters?, conversionFunction?);
    private getCommonOperatorAndValueFragment<T>(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters?, parameters?, conversionFunction?);
    protected getEntityPropertyColumnName(qEntity: IQEntity, propertyName: string, tableAlias: string): string;
    protected getTableName(qEntity: IQEntity): string;
    protected getPropertyColumnName(entityName: string, propertyName: string, tableAlias: string, columnMap: {
        [propertyName: string]: ColumnConfiguration;
    }): string;
    protected getManyToOneColumnName(entityName: string, propertyName: string, tableAlias: string, joinColumnMap: {
        [propertyName: string]: JoinColumnConfiguration;
    }): string;
    private throwValueOnOperationError(valueType, operation, alias, propertyName);
    protected sanitizeStringValue(value: string, embedParameters: boolean): string;
    protected booleanTypeCheck(valueToCheck: any): boolean;
    protected dateTypeCheck(valueToCheck: any): boolean;
    protected numberTypeCheck(valueToCheck: any): boolean;
    protected stringTypeCheck(valueToCheck: any): boolean;
    protected addField(entityName: string, tableName: string, propertyName: string, columnName: string): void;
    protected warn(warning: string): void;
}
