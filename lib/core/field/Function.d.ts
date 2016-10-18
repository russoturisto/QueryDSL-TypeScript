import { QNumberField } from "./NumberField";
import { JSONSelectField } from "./Field";
/**
 * Created by Papa on 10/18/2016.
 */
export interface JSONSqlFunctionCall {
    functionName: string;
    field: JSONSelectField;
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
}
export declare function avg(numberField: QNumberField): void;
