import { PHRawMappedSQLQuery } from "../../query/sql/query/ph/PHMappedSQLQuery";
import { IFrom } from "./Entity";
import { JSONBaseOperation } from "../operation/Operation";
/**
 * Created by Papa on 10/25/2016.
 */
export declare const SUB_SELECT_QUERY: string;
export declare function fromQuery<EMap>(query: PHRawMappedSQLQuery<EMap>): EMap;
export declare enum JoinType {
    FULL_JOIN = 0,
    INNER_JOIN = 1,
    LEFT_JOIN = 2,
    RIGHT_JOIN = 3,
}
export interface JoinOperation<IF extends IFrom, EMap> {
    (entity: IF | EMap): JSONBaseOperation;
}
export declare class JoinFields<IF extends IFrom, EMap> {
    private joinTo;
    constructor(joinTo: IF | PHRawMappedSQLQuery<EMap>);
    on(joinOperation: JoinOperation<IF, EMap>): IF | EMap;
}
export declare function fullJoin<IF extends IFrom, EMap>(left: IF | EMap, right: IF | PHRawMappedSQLQuery<EMap>): JoinFields<IF, EMap>;
export declare function innerJoin<IF extends IFrom, EMap>(left: IF | EMap, right: IF | PHRawMappedSQLQuery<EMap>): JoinFields<IF, EMap>;
export declare function leftJoin<IF extends IFrom, EMap>(left: IF | EMap, right: IF | PHRawMappedSQLQuery<EMap>): JoinFields<IF, EMap>;
export declare function rightJoin<IF extends IFrom, EMap>(left: IF | EMap, right: IF | PHRawMappedSQLQuery<EMap>): JoinFields<IF, EMap>;
