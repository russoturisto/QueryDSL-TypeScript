import { IQEntity } from "../../core/entity/Entity";
import { ISQLAdaptor, SqlValueProvider } from "./adaptor/SQLAdaptor";
import { SQLDialect } from "./SQLStringQuery";
import { EntityRelationRecord } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { FieldMap } from "./FieldMap";
import { IValidator } from "../../validation/Validator";
import { JSONClauseField } from "../../core/field/Appliable";
/**
 * Created by Papa on 10/2/2016.
 */
export declare enum ClauseType {
    MAPPED_SELECT_CLAUSE = 0,
    NON_MAPPED_SELECT_CLAUSE = 1,
    WHERE_CLAUSE = 2,
    FUNCTION_CLALL = 3,
}
export declare abstract class SQLStringWhereBase implements SqlValueProvider {
    protected qEntityMapByName: {
        [entityName: string]: IQEntity;
    };
    protected entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    };
    protected entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    };
    protected dialect: SQLDialect;
    protected fieldMap: FieldMap;
    protected qEntityMapByAlias: {
        [entityAlias: string]: IQEntity;
    };
    protected sqlAdaptor: ISQLAdaptor;
    protected validator: IValidator;
    protected embedParameters: boolean;
    protected parameters: any[];
    constructor(qEntityMapByName: {
        [entityName: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect);
    protected getWHEREFragment(operation: JSONBaseOperation, nestingPrefix: string): string;
    private getLogicalWhereFragment(operation, nestingPrefix);
    private getComparibleOperatorAndValueFragment<T>(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters?, parameters?, conversionFunction?);
    private getCommonOperatorAndValueFragment<T>(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters?, parameters?, conversionFunction?);
    protected getEntityPropertyColumnName(qEntity: IQEntity, propertyName: string, tableAlias: string): string;
    protected getTableName(qEntity: IQEntity): string;
    private throwValueOnOperationError(valueType, operation, alias, propertyName);
    protected sanitizeStringValue(value: string, embedParameters: boolean): string;
    protected booleanTypeCheck(valueToCheck: any): boolean;
    protected dateTypeCheck(valueToCheck: any): boolean;
    protected numberTypeCheck(valueToCheck: any): boolean;
    protected stringTypeCheck(valueToCheck: any): boolean;
    protected addField(entityName: string, tableName: string, propertyName: string, columnName: string): void;
    protected warn(warning: string): void;
    getFunctionCallValue(rawValue: any): string;
    getFieldValue(clauseField: JSONClauseField, clauseType: ClauseType, defaultCallback?: () => string): string;
    protected isPrimitive(value: any): boolean;
    protected parsePrimitive(primitiveValue: any): string;
    protected getSimpleColumnFragment(value: JSONClauseField, columnName: string): string;
    protected getComplexColumnFragment(value: JSONClauseField, columnName: string): string;
    protected getEntityManyToOneColumnName(qEntity: IQEntity, propertyName: string, tableAlias: string): string;
}
