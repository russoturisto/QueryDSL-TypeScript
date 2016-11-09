/**
 * Created by Papa on 10/16/2016.
 */
import { IQEntity } from "../../../../core/entity/Entity";
import { SQLDialect } from "../../SQLStringQuery";
import { EntityRelationRecord } from "../../../../core/entity/Relation";
import { PHJsonFlatQSLQuery } from "../ph/PHFlatSQLQuery";
import { NonEntitySQLStringQuery } from "./NonEntitySQLStringQuery";
/**
 * Represents SQL String query with flat (aka traditional) Select clause.
 */
export declare class FlatSQLStringQuery extends NonEntitySQLStringQuery<PHJsonFlatQSLQuery> {
    constructor(phJsonQuery: PHJsonFlatQSLQuery, qEntityMapByName: {
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
    parseQueryResults(results: any[]): any[];
    protected parseQueryResult(selectClauseFragment: any, resultRow: any, nextFieldIndex: number[]): any;
}
