import { PHJsonSQLQuery } from "./PHSQLQuery";
import { RelationRecord, JSONRelation } from "../../core/entity/Relation";
import { IEntity, IQEntity } from "../../core/entity/Entity";
import { FieldMap } from "./FieldMap";
import { SQLStringWhereBase } from "./SQLStringWhereBase";
import { JSONFieldInOrderBy } from "../../core/field/FieldInOrderBy";
import { IOrderByParser } from "./objectQuery/queryParser/IOrderByParser";
import { ColumnAliases } from "../../core/entity/ColumnAliases";
import { JoinTreeNode } from "../../core/entity/JoinTreeNode";
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
    BRIDGED = 0,
    HIERARCHICAL = 1,
    PLAIN = 2,
    RAW = 3,
}
/**
 * String based SQL query.
 */
export declare abstract class SQLStringQuery<IE extends IEntity> extends SQLStringWhereBase<IE> {
    protected phJsonQuery: PHJsonSQLQuery<IE>;
    protected queryResultType: QueryResultType;
    protected columnAliases: ColumnAliases;
    protected entityDefaults: EntityDefaults;
    protected joinTree: JoinTreeNode;
    protected orderByParser: IOrderByParser;
    constructor(phJsonQuery: PHJsonSQLQuery<IE>, rootQEntity: IQEntity, qEntityMapByName: {
        [alias: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect, queryResultType: QueryResultType);
    getFieldMap(): FieldMap;
    /**
     * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
     * result set.
     */
    buildJoinTree(): void;
    toSQL(embedParameters?: boolean, parameters?: any[]): string;
    buildFromJoinTree(entityName: string, joinRelations: JSONRelation[], joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }): JoinTreeNode;
    protected abstract getSELECTFragment(entityName: string, selectSqlFragment: string, selectClauseFragment: any, joinTree: JoinTreeNode, entityDefaults: EntityDefaults, embedParameters?: boolean, parameters?: any[]): string;
    protected getColumnSelectFragment(propertyName: string, tableAlias: string, columnName: string, existingSelectFragment: string): string;
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
