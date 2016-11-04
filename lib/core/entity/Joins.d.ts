import { PHRawMappedSQLQuery, IMappedEntity } from "../../query/sql/query/ph/PHMappedSQLQuery";
import { IFrom } from "./Entity";
import { JSONBaseOperation } from "../operation/Operation";
import { IQField } from "../field/Field";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 10/25/2016.
 */
export declare function view<IME extends IMappedEntity>(query: ((...args: any[]) => PHRawMappedSQLQuery<IME>) | PHRawMappedSQLQuery<IME>): IME & IFrom;
/**
 * Sub-queries in select clause
 * @param query
 * @returns {IQF}
 */
export declare function field<IQF extends IQField<any>>(query: (...args: any[]) => PHRawFieldSQLQuery<IQF> | PHRawFieldSQLQuery<IQF>): IQField<IQF>;
export declare enum JoinType {
    FULL_JOIN = 0,
    INNER_JOIN = 1,
    LEFT_JOIN = 2,
    RIGHT_JOIN = 3,
}
export interface JoinOperation<IF extends IFrom> {
    (entity: IF): JSONBaseOperation;
}
export declare class JoinFields<IF extends IFrom> {
    private joinTo;
    constructor(joinTo: IF);
    on(joinOperation: JoinOperation<IF>): IF;
}
