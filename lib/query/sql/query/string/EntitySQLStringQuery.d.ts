/**
 * Created by Papa on 10/16/2016.
 */
import { EntityRelationRecord, JSONEntityRelation } from "../../../../core/entity/Relation";
import { EntityDefaults, SQLStringQuery, QueryResultType, SQLDialect } from "../../SQLStringQuery";
import { IEntity, IQEntity } from "../../../../core/entity/Entity";
import { BridgedQueryConfiguration } from "../result/entity/IEntityResultParser";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
import { PHJsonEntitySQLQuery } from "../ph/PHEntitySQLQuery";
import { IEntityOrderByParser } from "../orderBy/IEntityOrderByParser";
/**
 * Represents SQL String query with Entity tree Select clause.
 */
export declare class EntitySQLStringQuery<IE extends IEntity> extends SQLStringQuery<PHJsonEntitySQLQuery<IE>> {
    protected rootQEntity: IQEntity;
    protected bridgedQueryConfiguration: BridgedQueryConfiguration;
    private queryParser;
    protected joinTree: JoinTreeNode;
    orderByParser: IEntityOrderByParser;
    private columnAliases;
    constructor(rootQEntity: IQEntity, phJsonQuery: PHJsonEntitySQLQuery<IE>, qEntityMapByName: {
        [entityName: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect, queryResultType: QueryResultType, bridgedQueryConfiguration?: BridgedQueryConfiguration);
    toSQL(): string;
    /**
     * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
     * result set.
     */
    buildJoinTree(): void;
    buildFromJoinTree(joinRelations: JSONEntityRelation[], joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }, entityName: string): JoinTreeNode;
    protected getSELECTFragment(entityName: string, selectSqlFragment: string, selectClauseFragment: any, joinTree: JoinTreeNode, entityDefaults: EntityDefaults, embedParameters?: boolean, parameters?: any[]): string;
    private getFROMFragment(parentTree, currentTree, embedParameters?, parameters?);
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
    protected parseQueryResult(entityName: string, selectClauseFragment: any, entityAlias: string, currentJoinNode: JoinTreeNode, resultRow: any, nextFieldIndex: number[]): any;
}
