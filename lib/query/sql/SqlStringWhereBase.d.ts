import { IQEntity } from "../../core/entity/Entity";
import { ISQLAdaptor, SqlValueProvider } from "./adaptor/SQLAdaptor";
import { SQLDialect } from "./SQLStringQuery";
import { EntityRelationRecord } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { FieldMap } from "./FieldMap";
import { IValidator } from "../../validation/Validator";
import { JSONClauseField, JSONClauseObject } from "../../core/field/Appliable";
import { PHJsonFieldQSLQuery } from "./query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 10/2/2016.
 */
export declare enum ClauseType {
    MAPPED_SELECT_CLAUSE = 0,
    NON_MAPPED_SELECT_CLAUSE = 1,
    WHERE_CLAUSE = 2,
    FUNCTION_CALL = 3,
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
    protected parameterReferences: string[];
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
    protected getEntityPropertyColumnName(qEntity: IQEntity, propertyName: string, tableAlias: string): string;
    protected getTableName(qEntity: IQEntity): string;
    protected addField(entityName: string, tableName: string, propertyName: string, columnName: string): void;
    protected warn(warning: string): void;
    getFunctionCallValue(rawValue: any): string;
    getFieldValue(clauseField: JSONClauseObject | JSONClauseField[] | PHJsonFieldQSLQuery, clauseType: ClauseType, defaultCallback?: () => string): string;
    protected isParameterReference(value: any): boolean;
    protected getSimpleColumnFragment(value: JSONClauseField, columnName: string): string;
    protected getComplexColumnFragment(value: JSONClauseField, columnName: string): string;
    protected getEntityManyToOneColumnName(qEntity: IQEntity, propertyName: string, tableAlias: string): string;
    applyOperator(operator: string, rValue: string): string;
}
