import { Appliable, JSONClauseObject } from "./Appliable";
/**
 * Created by Papa on 10/18/2016.
 */
export interface JSONSqlFunctionCall {
    functionType: SqlFunction;
    parameters: any[];
    valueIsPrimitive: boolean;
}
export interface JSONClauseFunction extends JSONClauseObject {
}
/**
 * Extrated from http://www.w3schools.com/sql/sql_functions.asp
 */
export declare enum SqlFunction {
    ABS = 0,
    AVG = 1,
    COUNT = 2,
    MAX = 3,
    MIN = 4,
    SUM = 5,
    UCASE = 6,
    LCASE = 7,
    MID = 8,
    LEN = 9,
    ROUND = 10,
    NOW = 11,
    FORMAT = 12,
    REPLACE = 13,
    TRIM = 14,
}
export declare function abs<A extends Appliable<any, any>>(appliable: A | number): A;
export declare function avg<A extends Appliable<any, any>>(appliable: A): A;
export declare function count<A extends Appliable<any, any>>(appliable: A): A;
export declare function max<A extends Appliable<any, any>>(appliable: A): A;
export declare function min<A extends Appliable<any, any>>(appliable: A): A;
export declare function sum<A extends Appliable<any, any>>(appliable: A): A;
export declare function ucase<A extends Appliable<any, any>>(appliable: A | string): A;
export declare function lcase<A extends Appliable<any, any>>(appliable: A | string): A;
export declare function mid<A extends Appliable<any, any>>(appliable: A | string, start: number, length: number): A;
export declare function len<A extends Appliable<any, any>>(appliable: A | string): A;
export declare function round<A extends Appliable<any, any>>(appliable: A | number, digits?: number): A;
export declare function now(): Appliable<any, any>;
export declare function format<A extends Appliable<any, any>>(format: string, ...appliables: any[]): A;
export declare function replace<A extends Appliable<any, any>>(appliable: A | string, toReplace: string, replaceWith: string): A;
export declare function trim<A extends Appliable<any, any>>(appliable: A | string): A;
export declare class FunctionAppliable implements Appliable<JSONClauseFunction, any> {
    fieldName: string;
    q: any;
    appliedFunctions: JSONSqlFunctionCall[];
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): Appliable<JSONClauseFunction, any>;
    toJSON(): JSONClauseFunction;
}
