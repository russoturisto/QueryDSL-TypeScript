import { PHJsonSQLQuery } from "./PHSQLQuery";
import { RelationRecord, JSONRelation, JoinTreeNode, ColumnAliases } from "../../core/entity/Relation";
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
export declare class SQLStringQuery<IE extends IEntity> extends SQLStringWhereBase<IE> {
    phJsonQuery: PHJsonSQLQuery<IE>;
    columnAliases: ColumnAliases;
    entityDefaults: EntityDefaults;
    private queryBridge;
    private joinTree;
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
    }, dialect: SQLDialect, performBridging?: boolean);
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
    protected getSELECTFragment(entityName: string, selectSqlFragment: string, selectClauseFragment: any, joinTree: JoinTreeNode, entityDefaults: EntityDefaults, embedParameters?: boolean, parameters?: any[]): string;
    protected getColumnSelectFragment(propertyName: string, tableAlias: string, columnName: string, existingSelectFragment: string): string;
    private getFROMFragment(parentTree, currentTree, embedParameters?, parameters?);
    private getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
    protected getManyToOneColumnName(entityName: string, propertyName: string, tableAlias: string, joinColumnMap: {
        [propertyName: string]: JoinColumnConfiguration;
    }): string;
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
    parseQueryResults(results: any[]): any[];
    protected parseQueryResult(parentEntityName: string, parentPropertyName: string, entityName: string, selectClauseFragment: any, currentJoinNode: JoinTreeNode, resultRow: any, nextFieldIndex: number[]): any;
}
