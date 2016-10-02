import { PHJsonSQLQuery } from "./PHSQLQuery";
import { RelationRecord } from "../../core/entity/Relation";
import { IEntity, QEntity, IQEntity } from "../../core/entity/Entity";
import { FieldMap } from "./FieldMap";
import { SQLStringWhereBase } from "./SQLStringWhereBase";
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
export declare class SQLStringQuery<IE extends IEntity> extends SQLStringWhereBase<IE> {
    columnAliasMap: {
        [aliasPropertyCombo: string]: string;
    };
    defaultsMap: {
        [property: string]: any;
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
    getFieldMap(): FieldMap;
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
    protected getSelectFragment(entityName: string, selectFragment: string, selectClauseFragment: any, joinAliasMap: {
        [entityName: string]: string;
    }, columnAliasMap: {
        [aliasPropertyCombo: string]: string;
    }, entityDefaultsMap: {
        [property: string]: any;
    }, embedParameters?: boolean, parameters?: any[]): string;
    private getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
    private getManyToOneColumnName(entityName, propertyName, tableAlias, joinColumnMap);
    protected getColumnSelectFragment(propertyName: string, tableAlias: string, columnName: string, columnAliasMap: {
        [aliasWithProperty: string]: string;
    }, existingSelectFragment: string): string;
    protected getFromFragment(joinQEntityMap: {
        [alias: string]: IQEntity;
    }, joinAliasMap: {
        [entityName: string]: string;
    }, embedParameters?: boolean, parameters?: any[]): string;
    parseQueryResults(results: any[]): any[];
    protected parseQueryResult(entityName: string, selectClauseFragment: any, resultRow: any, nextFieldIndex: number[], entityDefaultsMap: {
        [property: string]: any;
    }): any;
}
