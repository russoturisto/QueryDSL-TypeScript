import { PHRawMappedSQLQuery, IMappedEntity } from "../../query/sql/query/ph/PHMappedSQLQuery";
import { IFrom } from "./Entity";
import { JSONBaseOperation } from "../operation/Operation";
import { IQField } from "../field/Field";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 10/25/2016.
 */
export declare const SUB_SELECT_QUERY: string;
export declare function view<IME extends IMappedEntity>(query: (...args: any[]) => PHRawMappedSQLQuery<IME> | PHRawMappedSQLQuery<IME>): IME;
/**
 * Sub-queries in select clause
 * @param query
 * @returns {IQF}
 */
export declare function field<IQF extends IQField<any, any>>(query: (...args: any[]) => PHRawFieldSQLQuery<IQF> | PHRawFieldSQLQuery<IQF>): IQField<any, IQF>;
export declare enum JoinType {
    FULL_JOIN = 0,
    INNER_JOIN = 1,
    LEFT_JOIN = 2,
    RIGHT_JOIN = 3,
}
export interface JoinOperation<IF extends IFrom, IME extends IMappedEntity> {
    (entity: IF | IME): JSONBaseOperation;
}
export declare class JoinFields<IF extends IFrom, IME extends IMappedEntity> {
    private joinTo;
    constructor(joinTo: IF | PHRawMappedSQLQuery<IME>);
    on(joinOperation: JoinOperation<IF, IME>): IF | IME;
}
export declare function fullJoin<IF extends IFrom, IME extends IMappedEntity>(left: IF | IME, right: IF | PHRawMappedSQLQuery<IME>): JoinFields<IF, IME>;
export declare function innerJoin<IF extends IFrom, IME extends IMappedEntity>(left: IF | IME, right: IF | PHRawMappedSQLQuery<IME>): JoinFields<IF, IME>;
export declare function leftJoin<IF extends IFrom, IME extends IMappedEntity>(left: IF | IME, right: IF | PHRawMappedSQLQuery<IME>): JoinFields<IF, IME>;
export declare function rightJoin<IF extends IFrom, IME extends IMappedEntity>(left: IF | IME, right: IF | PHRawMappedSQLQuery<IME>): JoinFields<IF, IME>;
