import { PHJsonSQLQuery } from "./PHSQLQuery";
import { RelationRecord } from "../../core/entity/Relation";
import { IEntity, QEntity, IQEntity } from "../../core/entity/Entity";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { ISQLAdaptor } from "./adaptor/SQLAdaptor";
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
export declare class FieldMap {
    entityMap: {
        [entityName: string]: EntityFieldMap;
    };
    tableMap: {
        [tableName: string]: EntityFieldMap;
    };
    ensure(entityName: string, tableName: string): EntityFieldMap;
    existsByStructure(tableName: string, columnName: string): boolean;
    existsByModel(entityName: string, propertyName: string): boolean;
}
export declare class EntityFieldMap {
    entityName: string;
    tableName: string;
    columnMap: {
        [columnName: string]: PropertyFieldEntry;
    };
    propertyMap: {
        [propertyName: string]: PropertyFieldEntry;
    };
    constructor(entityName: string, tableName: string);
    ensure(propertyName: string, columnName: string): PropertyFieldEntry;
}
export declare class PropertyFieldEntry {
    propertyName: string;
    columnName: string;
    constructor(propertyName: string, columnName: string);
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
    columnAliasMap: {
        [aliasPropertyCombo: string]: string;
    };
    defaultsMap: {
        [property: string]: any;
    };
    fieldMap: FieldMap;
    joinAliasMap: {
        [entityName: string]: string;
    };
    sqlAdaptor: ISQLAdaptor;
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
    getFieldMap(): FieldMap;
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
    private addField(entityName, tableName, propertyName, columnName);
    protected getSelectFragment(entityName: string, selectFragment: string, selectClauseFragment: any, joinAliasMap: {
        [entityName: string]: string;
    }, columnAliasMap: {
        [aliasPropertyCombo: string]: string;
    }, entityDefaultsMap: {
        [property: string]: any;
    }, embedParameters?: boolean, parameters?: any[]): string;
    private getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
    private getPropertyColumnName(entityName, propertyName, tableAlias, columnMap);
    private getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
    private getManyToOneColumnName(entityName, propertyName, tableAlias, joinColumnMap);
    protected getColumnSelectFragment(propertyName: string, tableAlias: string, columnName: string, columnAliasMap: {
        [aliasWithProperty: string]: string;
    }, existingSelectFragment: string): string;
    private getTableName(qEntity);
    protected getFromFragment(joinQEntityMap: {
        [alias: string]: IQEntity;
    }, joinAliasMap: {
        [entityName: string]: string;
    }, embedParameters?: boolean, parameters?: any[]): string;
    protected getWHEREFragment(operation: JSONBaseOperation, nestingIndex: number, joinQEntityMap: {
        [alias: string]: IQEntity;
    }, embedParameters?: boolean, parameters?: any[]): string;
    protected getComparibleOperatorAndValueFragment<T>(fieldOperation: string, value: any, alias: string, propertyName: string, typeCheckFunction: (value: any) => boolean, typeName: string, embedParameters?: boolean, parameters?: any[], conversionFunction?: (value: any, embedParameters: boolean) => any): string;
    protected getCommonOperatorAndValueFragment<T>(fieldOperation: string, value: any, alias: string, propertyName: string, typeCheckFunction: (value: any) => boolean, typeName: string, embedParameters?: boolean, parameters?: any[], conversionFunction?: (value: any, embedParameters: boolean) => any): string;
    private booleanTypeCheck(valueToCheck);
    private dateTypeCheck(valueToCheck);
    private numberTypeCheck(valueToCheck);
    private stringTypeCheck(valueToCheck);
    private throwValueOnOperationError(valueType, operation, alias, propertyName);
    private sanitizeStringValue(value, embedParameters);
    protected warn(warning: string): void;
    parseQueryResults(results: any[]): any[];
    protected parseQueryResult(entityName: string, selectClauseFragment: any, resultRow: any, nextFieldIndex: number[], entityDefaultsMap: {
        [property: string]: any;
    }): any;
}
