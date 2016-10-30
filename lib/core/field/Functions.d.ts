import { IQEntity } from "../entity/Entity";
import { IQNumberField } from "./NumberField";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 10/18/2016.
 */
export interface JSONSqlFunctionCall {
    functionType: SqlFunction;
    parameters: any[];
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
    DISTINCT = 15,
    EXISTS = 16,
}
export declare function abs<IQF extends IQNumberField>(numeric: IQF | number | PHRawFieldSQLQuery<IQNumberField>): IQF;
export declare function avg<IQ extends IQEntity, IQF extends IQNumberField>(numberField: IQF | number | PHRawFieldSQLQuery<IQNumberField>): IQF;
