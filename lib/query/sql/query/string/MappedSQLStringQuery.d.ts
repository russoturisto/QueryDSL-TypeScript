/**
 * Created by Papa on 10/28/2016.
 */
import { PHJsonMappedQSLQuery } from "../ph/PHMappedSQLQuery";
import { SQLDialect } from "../../SQLStringQuery";
import { IQEntity } from "../../../../core/entity/Entity";
import { EntityRelationRecord } from "../../../../core/entity/Relation";
import { NonEntitySQLStringQuery } from "./NonEntitySQLStringQuery";
import { MappedQueryResultParser } from "../result/MappedQueryResultParser";
import { AliasCache } from "../../../../core/entity/Aliases";
/**
 *
 */
export declare class MappedSQLStringQuery extends NonEntitySQLStringQuery<PHJsonMappedQSLQuery> {
    protected queryParser: MappedQueryResultParser;
    constructor(phJsonQuery: PHJsonMappedQSLQuery, qEntityMapByName: {
        [entityName: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect);
    protected getSELECTFragment(selectSqlFragment: string, selectClauseFragment: any): string;
    /**
     * Entities get merged if they are right next to each other in the result set.  If they are not, they are
     * treated as separate entities - hence, your sort order matters.
     *
     * @param results
     * @returns {any[]}
     */
    parseQueryResults(results: any[]): any[];
    protected parseQueryResult(selectClauseFragment: any, resultRow: any, nextFieldIndex: number[], aliasCache: AliasCache, entityAlias: string): any;
}
