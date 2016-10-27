import { PHRawNonEntitySQLQuery, PHNonEntitySQLQuery } from "./PHNonEntitySQLQuery";
import { PHSQLQuery, PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery } from "../../PHSQLQuery";
import { JSONJoinRelation } from "../../../../core/entity/Relation";
import { IQDistinctFunction } from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonMappedQSLQuery extends PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery, JSONJoinRelation {
}
export interface PHRawMappedSQLQuery<IE> extends PHRawNonEntitySQLQuery {
    select: IE | IQDistinctFunction;
}
export declare class PHMappedSQLQuery<IE> extends PHNonEntitySQLQuery implements PHSQLQuery {
    phRawQuery: PHRawMappedSQLQuery<IE>;
    constructor(phRawQuery: PHRawMappedSQLQuery<IE>);
    nonDistinctSelectClauseToJSON(rawSelect: any): any;
    toJSON(): PHJsonMappedQSLQuery;
}
