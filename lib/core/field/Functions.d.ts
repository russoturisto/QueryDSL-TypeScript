import { IQStringField } from "./StringField";
import { Appliable, JSONClauseObject, JSONClauseField } from "./Appliable";
import { IQEntity } from "../entity/Entity";
import { PHRawNonEntitySQLQuery } from "../../query/sql/PHSQLQuery";
import { IQNumberField } from "./NumberField";
import { IQDateField } from "./DateField";
import { IQField } from "./Field";
/**
 * Created by Papa on 10/18/2016.
 */
export interface JSONSqlFunctionCall {
    functionType: SqlFunction;
    parameters: any[];
    valueIsPrimitive: boolean;
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
export declare function abs<A extends Appliable<any, any, any>>(appliable: A | number): A;
export declare function avg<A extends Appliable<any, any, any>>(appliable: A): A;
export declare function count<IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, IQF>>(field: IQF): IQF;
export declare function max<IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, IQF>>(field: IQF): IQF;
export declare function min<IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, IQF>>(field: IQF): IQF;
export declare function sum<IQ extends IQEntity>(numberField: IQNumberField<IQ>): IQNumberField<IQ>;
export declare function ucase<IQ extends IQEntity>(stringField: IQStringField<IQ> | string): IQStringField<IQ>;
export declare function lcase<IQ extends IQEntity>(stringField: IQStringField<IQ> | string): IQStringField<IQ>;
export declare function mid<IQ extends IQEntity>(stringField: IQStringField<IQ> | string, start: number, length: number): IQStringField<IQ>;
export declare function len<IQ extends IQEntity>(stringField: IQStringField<IQ> | string): IQStringField<IQ>;
export declare function round<IQ extends IQEntity>(numberField: IQNumberField<IQ> | number, digits?: number): IQNumberField<IQ>;
export declare function now(): IQDateField<any>;
export declare function format(format: string, ...formatParameters: any[]): IQStringField<any>;
export declare function replace<IQ extends IQEntity>(stringField: IQStringField<IQ> | string, toReplace: string, replaceWith: string): IQStringField<IQ>;
export declare function trim<IQ extends IQEntity>(stringField: IQStringField<IQ> | string): IQStringField<IQ>;
export declare function distinct(selectClause: any): IQDistinctFunction;
export interface IQDistinctFunction {
}
export declare class QDistinctFunction implements IQDistinctFunction, Appliable<JSONClauseObject, any, any> {
    __appliedFunctions__: JSONSqlFunctionCall[];
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): any;
    toJSON(): JSONClauseField;
}
export declare function exists(phRawQuery: PHRawNonEntitySQLQuery): IQExistsFunction;
export interface IQExistsFunction {
}
export declare class QExistsFunction implements IQDistinctFunction, Appliable<JSONClauseObject, any, any> {
    __appliedFunctions__: JSONSqlFunctionCall[];
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): any;
    toJSON(): JSONClauseField;
}
