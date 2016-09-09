import { PHJsonSQLQuery } from "./PHSQLQuery";
import { RelationRecord } from "../../core/entity/Relation";
import { IEntity, QEntity, IQEntity } from "../../core/entity/Entity";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { ISQLAdaptor } from "./adaptor/SQLAdaptor";
import { ColumnConfiguration, JoinColumnConfiguration } from "../../core/entity/metadata/ColumnDecorators";
/**
 * Created by Papa on 8/20/2016.
 */
export declare enum SQLDialect {
    SQLITE = 0,
    ORACLE = 1,
}
export declare enum SQLDataType {
    BOOLEAN = 0,
    DATE = 1,
    NUMBER = 2,
    STRING = 3,
}
export declare class SQLStringQuery<IE extends IEntity> {
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
    defaultsMap: {
        [property: string]: any;
    };
    columnAliasMap: {
        [aliasPropertyCombo: string]: string;
    };
    joinAliasMap: {
        [entityName: string]: string;
    };
    private currentFieldIndex;
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
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
    getSelectFragment(entityName: string, selectFragment: string, selectClauseFragment: any, joinAliasMap: {
        [entityName: string]: string;
    }, columnAliasMap: {
        [aliasPropertyCombo: string]: string;
    }, entityDefaultsMap: {
        [property: string]: any;
    }): string;
    getColumnSelectFragment(entityName: string, propertyName: string, tableAlias: string, columnMap: {
        [propertyName: string]: ColumnConfiguration;
    }, joinColumnMap: {
        [propertyName: string]: JoinColumnConfiguration;
    }, columnAliasMap: {
        [aliasWithProperty: string]: string;
    }, existingSelectFragment: string): string;
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
    parseQueryResults(entityName: string, selectClauseFragment: any, results: any[]): any[];
    parseQueryResult(entityName: string, selectClauseFragment: any, resultRow: any, nextFieldIndex: number[], entityDefaultsMap: {
        [property: string]: any;
    }): any;
}
