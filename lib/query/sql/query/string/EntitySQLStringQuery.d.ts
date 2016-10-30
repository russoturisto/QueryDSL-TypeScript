/**
 * Created by Papa on 10/16/2016.
 */
import { EntityRelationRecord, JSONEntityRelation } from "../../../../core/entity/Relation";
import { EntityDefaults, SQLStringQuery, QueryResultType, SQLDialect } from "../../SQLStringQuery";
import { IEntity, IQEntity } from "../../../../core/entity/Entity";
import { BridgedQueryConfiguration } from "../result/IEntityResultParser";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
import { PHJsonEntitySQLQuery } from "../ph/PHEntitySQLQuery";
/**
 * Represents SQL String query with Entity tree Select clause.
 */
export declare class EntitySQLStringQuery<IE extends IEntity> extends SQLStringQuery<PHJsonEntitySQLQuery<IE>> {
    protected rootQEntity: IQEntity;
    protected bridgedQueryConfiguration: BridgedQueryConfiguration;
    private queryParser;
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
    /**
     * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
     * result set.
     */
    buildJoinTree(): void;
    buildFromJoinTree(joinRelations: JSONEntityRelation[], joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }, entityName: string): JoinTreeNode;
    protected getSELECTFragment(entityName: string, selectSqlFragment: string, selectClauseFragment: any, joinTree: JoinTreeNode, entityDefaults: EntityDefaults, embedParameters?: boolean, parameters?: any[]): string;
}
