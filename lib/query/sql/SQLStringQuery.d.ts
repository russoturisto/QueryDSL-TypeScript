import { PHJsonSQLQuery } from "./PHSQLQuery";
import { RelationRecord } from "../../core/entity/Relation";
import { IEntity, IQEntity } from "../../core/entity/Entity";
import { JoinColumnConfiguration } from "../../core/entity/metadata/ColumnDecorators";
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
    phJsonQuery: PHJsonSQLQuery<IE>;
    columnAliasMap: {
        [aliasPropertyCombo: string]: string;
    };
    defaultsMap: {
        [property: string]: any;
    };
    private currentFieldIndex;
    constructor(phJsonQuery: PHJsonSQLQuery<IE>, qEntity: IQEntity, qEntityMap: {
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
    getFieldMap(): FieldMap;
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
    private getFROMFragment(joinQEntityMap, joinAliasMap, joinRelations, embedParameters?, parameters?);
    private getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
    protected getManyToOneColumnName(entityName: string, propertyName: string, tableAlias: string, joinColumnMap: {
        [propertyName: string]: JoinColumnConfiguration;
    }): string;
    protected getSELECTFragment(entityName: string, selectFragment: string, selectClauseFragment: any, joinAliasMap: {
        [entityName: string]: string;
    }, columnAliasMap: {
        [aliasPropertyCombo: string]: string;
    }, entityDefaultsMap: {
        [property: string]: any;
    }, embedParameters?: boolean, parameters?: any[]): string;
    protected getColumnSelectFragment(propertyName: string, tableAlias: string, columnName: string, columnAliasMap: {
        [aliasWithProperty: string]: string;
    }, existingSelectFragment: string): string;
    parseQueryResults(results: any[]): any[];
    protected parseQueryResult(entityName: string, selectClauseFragment: any, resultRow: any, nextFieldIndex: number[], entityDefaultsMap: {
        [property: string]: any;
    }): any;
}
