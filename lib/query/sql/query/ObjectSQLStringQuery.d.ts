/**
 * Created by Papa on 10/16/2016.
 */
import { EntityRelationRecord } from "../../../core/entity/Relation";
import { EntityDefaults, SQLStringQuery, QueryResultType, SQLDialect } from "../SQLStringQuery";
import { IEntity, IQEntity } from "../../../core/entity/Entity";
import { BridgedQueryConfiguration } from "./result/IObjectResultParser";
import { JSONFieldInOrderBy } from "../../../core/field/FieldInOrderBy";
import { PHJsonCommonSQLQuery } from "../PHSQLQuery";
import { JoinTreeNode } from "../../../core/entity/JoinTreeNode";
/**
 * Represents SQL String query with object tree Select clause.
 */
export declare class ObjectSQLStringQuery<IE extends IEntity> extends SQLStringQuery<IE> {
    protected bridgedQueryConfiguration: BridgedQueryConfiguration;
    private queryParser;
    constructor(phJsonQuery: PHJsonCommonSQLQuery<IE>, qEntity: IQEntity, qEntityMapByName: {
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
    protected getSELECTFragment(entityName: string, selectSqlFragment: string, selectClauseFragment: any, joinTree: JoinTreeNode, entityDefaults: EntityDefaults, embedParameters?: boolean, parameters?: any[]): string;
    protected getOrderByFragment(orderBy?: JSONFieldInOrderBy[]): string;
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
