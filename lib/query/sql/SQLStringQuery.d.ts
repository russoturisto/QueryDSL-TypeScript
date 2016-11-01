import { EntityRelationRecord, JSONRelation } from "../../core/entity/Relation";
import { IQEntity } from "../../core/entity/Entity";
import { FieldMap } from "./FieldMap";
import { SQLStringWhereBase } from "./SQLStringWhereBase";
import { JSONFieldInOrderBy } from "../../core/field/FieldInOrderBy";
import { IOrderByParser } from "./query/orderBy/IOrderByParser";
import { ColumnAliases } from "../../core/entity/Aliases";
import { JoinTreeNode } from "../../core/entity/JoinTreeNode";
import { PHJsonCommonSQLQuery } from "./PHSQLQuery";
import { JSONClauseField } from "../../core/field/Appliable";
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
export declare class EntityDefaults {
    map: {
        [alias: string]: {
            [property: string]: any;
        };
    };
    getForAlias(alias: string): {
        [property: string]: any;
    };
}
export declare enum QueryResultType {
    ENTITY_BRIDGED = 0,
    ENTITY_FLATTENED = 1,
    ENTITY_HIERARCHICAL = 2,
    ENTITY_PLAIN = 3,
    MAPPED_HIERARCHICAL = 4,
    MAPPED_PLAIN = 5,
    FLAT = 6,
    FIELD = 7,
    RAW = 8,
}
/**
 * String based SQL query.
 */
export declare abstract class SQLStringQuery<PHJQ extends PHJsonCommonSQLQuery> extends SQLStringWhereBase {
    protected phJsonQuery: PHJsonCommonSQLQuery;
    protected queryResultType: QueryResultType;
    protected columnAliases: ColumnAliases;
    protected entityDefaults: EntityDefaults;
    protected joinTree: JoinTreeNode;
    protected orderByParser: IOrderByParser;
    constructor(phJsonQuery: PHJsonCommonSQLQuery, qEntityMapByName: {
        [alias: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect, queryResultType: QueryResultType);
    getFieldMap(): FieldMap;
    protected abstract buildFromJoinTree<JR extends JSONRelation>(joinRelations: JR[], joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }, entityName?: string): any;
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
    protected abstract getSELECTFragment(entityName: string, selectSqlFragment: string, selectClauseFragment: any, joinTree: JoinTreeNode, entityDefaults: EntityDefaults, embedParameters?: boolean, parameters?: any[]): string;
    protected getSimpleColumnFragment(propertyName: string, tableAlias: string, columnName: string, existingFragment: string, forSelectClause: boolean): string;
    protected getComplexColumnFragment(value: JSONClauseField, columnName: string, existingFragment: string, forSelectClause: boolean): string;
    private getFROMFragment(parentTree, currentTree, embedParameters?, parameters?);
    protected getEntityManyToOneColumnName(qEntity: IQEntity, propertyName: string, tableAlias: string): string;
    /**
     * If bridging is not applied:
     *
     * Entities get merged if they are right next to each other in the result set.  If they are not, they are
     * treated as separate entities - hence, your sort order matters.
     *
     * If bridging is applied - all entities get merged - your sort order does not matter.  Might as well disallow
     * sort order for bridged queries (or re-sort in memory)?
     *
     * @param results
     * @returns {any[]}
     */
    protected abstract parseQueryResults(results: any[], queryResultType: QueryResultType, bridgedQueryConfiguration?: any): any[];
    protected abstract getOrderByFragment(orderBy?: JSONFieldInOrderBy[]): string;
}
