import { EntityRelationRecord, JSONEntityRelation, JSONRelation } from "../../core/entity/Relation";
import { IQEntity } from "../../core/entity/Entity";
import { FieldMap } from "./FieldMap";
import { SQLStringWhereBase } from "./SQLStringWhereBase";
import { JoinTreeNode } from "../../core/entity/JoinTreeNode";
import { PHJsonCommonSQLQuery } from "./PHSQLQuery";
/**
 * Created by Papa on 8/20/2016.
 */
export declare enum SQLDialect {
    SQLITE = 0,
    ORACLE = 1,
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
    ENTITY_HIERARCHICAL = 1,
    MAPPED_HIERARCHICAL = 2,
    FLAT = 3,
    FIELD = 4,
    RAW = 5,
}
/**
 * String based SQL query.
 */
export declare abstract class SQLStringQuery<PHJQ extends PHJsonCommonSQLQuery> extends SQLStringWhereBase {
    protected phJsonQuery: PHJQ;
    protected queryResultType: QueryResultType;
    protected entityDefaults: EntityDefaults;
    constructor(phJsonQuery: PHJQ, qEntityMapByName: {
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
    protected getEntitySchemaRelationFromJoin(leftEntity: IQEntity, rightEntity: IQEntity, entityRelation: JSONEntityRelation, parentRelation: JSONRelation, currentAlias: string, parentAlias: string, tableName: string, joinTypeString: string, errorPrefix: string): string;
}
