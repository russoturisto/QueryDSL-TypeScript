import { PHJsonSQLQuery } from "./sql/PHSQLQuery";
import { RelationRecord } from "../core/entity/Relation";
import { IEntity, QEntity, IQEntity } from "../core/entity/Entity";
import { JSONBaseOperation } from "../core/operation/Operation";
import { ISQLAdaptor } from "./sql/adaptor/SQLAdaptor";
/**
 * Created by Papa on 8/20/2016.
 */
export declare enum SQLDialect {
    MY_SQL = 0,
    ORACLE = 1,
}
export declare enum SQLDataType {
    BOOLEAN = 0,
    DATE = 1,
    NUMBER = 2,
    STRING = 3,
}
export declare class SQLQuery<IE extends IEntity> {
    phJsonQuery: PHJsonSQLQuery<IE>;
    qEntity: QEntity<any>;
    qEntityMap: {
        [entityName: string]: QEntity<any>;
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
    private dialect;
    sqlAdaptor: ISQLAdaptor;
    constructor(phJsonQuery: PHJsonSQLQuery<IE>, qEntity: QEntity<any>, qEntityMap: {
        [entityName: string]: QEntity<any>;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect);
    toSQL(): string;
    getSelectFragment(entityName: string, existingSelectFragment: string, selectClauseFragment: any, joinAliasMap: {
        [entityName: string]: string;
    }): string;
    getFromFragment(joinQEntityMap: {
        [alias: string]: IQEntity;
    }, joinAliasMap: {
        [entityName: string]: string;
    }): string;
    getWHEREFragment(operation: JSONBaseOperation, nestingIndex: number, joinQEntityMap: {
        [alias: string]: IQEntity;
    }): string;
    getComparibleOperatorAndValueFragment<T>(fieldOperation: string, value: any, alias: string, propertyName: string, typeCheckFunction: (value: any) => boolean, typeName: string, conversionFunction?: (value: any) => any): string;
    getCommonOperatorAndValueFragment<T>(fieldOperation: string, value: any, alias: string, propertyName: string, typeCheckFunction: (value: any) => boolean, typeName: string, conversionFunction?: (value: any) => any): string;
    booleanTypeCheck(valueToCheck: any): boolean;
    dateTypeCheck(valueToCheck: any): boolean;
    numberTypeCheck(valueToCheck: any): boolean;
    stringTypeCheck(valueToCheck: any): boolean;
    throwValueOnOperationError(valueType: string, operation: string, alias: string, propertyName: string): void;
    sanitizeStringValue(value: string): string;
    warn(warning: string): void;
    parseResults(selectClauseFragment: any, results: any[]): any;
    parseQueryResults(entityName: string, selectClauseFragment: any, results: any[], numResultColumns: number): any[];
    getDataType(): {};
    parseQueryResult(entityName: string, resultObject: any, selectClauseFragment: any, result: any, numResultColumns: number, nextFieldIndex: number): any;
}
