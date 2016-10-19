import { Appliable, JSONClauseObject } from "./Applicable";
/**
 * Created by Papa on 10/18/2016.
 */
export interface JSONSqlFunctionCall {
    functionType: SqlFunction;
    parameters: any[];
}
export interface JSONClauseFunction extends JSONClauseObject {
}
/**
 * Extrated from http://www.w3schools.com/sql/sql_functions.asp
 */
export declare enum SqlFunction {
    AVG = 0,
    COUNT = 1,
    FIRST = 2,
    LAST = 3,
    MAX = 4,
    MIN = 5,
    SUM = 6,
    UCASE = 7,
    LCASE = 8,
    MID = 9,
    LEN = 10,
    ROUND = 11,
    NOW = 12,
    FORMAT = 13,
    TRIM = 14,
}
export declare function avg<A extends Appliable<any, any>>(appliable: A): A;
export declare function count<A extends Appliable<any, any>>(appliable: A): A;
export declare function first<A extends Appliable<any, any>>(appliable: A): A;
export declare function last<A extends Appliable<any, any>>(appliable: A): A;
export declare function max<A extends Appliable<any, any>>(appliable: A): A;
export declare function min<A extends Appliable<any, any>>(appliable: A): A;
export declare function sum<A extends Appliable<any, any>>(appliable: A): A;
export declare function ucase<A extends Appliable<any, any>>(appliable: A): A;
export declare function lcase<A extends Appliable<any, any>>(appliable: A): A;
export declare function mid<A extends Appliable<any, any>>(appliable: A, start: number, length: number): A;
export declare function len<A extends Appliable<any, any>>(appliable: A): A;
export declare function round<A extends Appliable<any, any>>(appliable: A): A;
export declare function now(): Appliable<any, any>;
export declare function format<A extends Appliable<any, any>>(appliable: A, format: string): A;
export declare function trim<A extends Appliable<any, any>>(appliable: A): A;
export declare class FunctionApplicable implements Appliable<JSONClauseFunction, any> {
    fieldName: string;
    q: any;
    appliedFunctions: JSONSqlFunctionCall[];
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): Appliable<JSONClauseFunction, any>;
    toJSON(): JSONClauseFunction;
}
