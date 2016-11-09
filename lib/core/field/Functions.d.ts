import { IQStringField } from "./StringField";
import { Appliable, JSONClauseObject, JSONClauseField } from "./Appliable";
import { IQNumberField } from "./NumberField";
import { IQDateField } from "./DateField";
import { JSONBaseOperation, OperationCategory, JSONFunctionOperation } from "../operation/Operation";
import { QOperableField, IQOperableField } from "./OperableField";
import { IQBooleanField } from "./BooleanField";
import { PHRawMappedSQLQuery, PHJsonMappedQSLQuery, IMappedEntity } from "../../query/sql/query/ph/PHMappedSQLQuery";
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
export declare function abs(numeric: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>): IQNumberField;
export declare function avg(numeric: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>): IQNumberField;
export declare function getFunctionObject<T extends boolean | Date | number | string>(value: T | PHRawFieldSQLQuery<any>): QOperableField<T, any, any, any>;
export declare function count<T extends boolean | Date | number | string, IQF extends IQOperableField<T, any, any, any>>(value: IQF | T | PHRawFieldSQLQuery<IQF>): IQF;
export declare function max<T extends boolean | Date | number | string, IQF extends IQOperableField<T, any, any, any>>(value: IQF | T | PHRawFieldSQLQuery<IQF>): IQF;
export declare function min<T extends boolean | Date | number | string, IQF extends IQOperableField<T, any, any, any>>(value: IQF | T | PHRawFieldSQLQuery<IQF>): IQF;
export declare function sum(numeric: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>): IQNumberField;
export declare function ucase(stringValue: IQStringField | string | PHRawFieldSQLQuery<IQStringField>): IQStringField;
export declare function lcase(stringValue: IQStringField | string | PHRawFieldSQLQuery<any>): IQStringField;
export declare function mid(stringValue: IQStringField | string | PHRawFieldSQLQuery<IQStringField>, start: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>, length: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>): IQStringField;
export declare function len(stringValue: IQStringField | string | PHRawFieldSQLQuery<IQStringField>): IQStringField;
export declare function round(numeric: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>, digits?: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>): IQNumberField;
export declare function now(): IQDateField;
export declare function format<T extends boolean | Date | number | string, IQF extends IQOperableField<T, any, any, IQF>>(format: string | IQStringField | PHRawFieldSQLQuery<IQF>, ...formatParameters: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): IQStringField;
export declare function replace(stringValue: IQStringField | string | PHRawFieldSQLQuery<IQStringField>, toReplace: IQStringField | string | PHRawFieldSQLQuery<IQStringField>, replaceWith: IQStringField | string | PHRawFieldSQLQuery<IQStringField>): IQStringField;
export declare function trim(stringField: IQStringField | string | PHRawFieldSQLQuery<any>): IQStringField;
export declare abstract class StandAloneFunction {
}
export declare function distinct<ISelect>(selectClause: ISelect): IQDistinctFunction<ISelect>;
export interface IQDistinctFunction<ISelect> {
}
export declare class QDistinctFunction<ISelect> extends StandAloneFunction implements IQDistinctFunction<ISelect>, Appliable<JSONClauseObject, any> {
    private selectClause;
    __appliedFunctions__: JSONSqlFunctionCall[];
    constructor(selectClause: ISelect);
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): any;
    getSelectClause(): any;
    toJSON(parsedSelectClause?: any): JSONClauseField;
    static getSelect(distinct: QDistinctFunction<any>): any;
}
export declare function exists<IME extends IMappedEntity>(phRawQuery: PHRawMappedSQLQuery<IME>): IQExistsFunction;
export interface IQExistsFunction extends JSONBaseOperation {
}
export declare class QExistsFunction<IME extends IMappedEntity> extends StandAloneFunction implements IQExistsFunction, Appliable<JSONClauseObject, any> {
    private subQuery;
    __appliedFunctions__: JSONSqlFunctionCall[];
    operator: string;
    category: OperationCategory;
    constructor(subQuery: PHRawMappedSQLQuery<IME>);
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): any;
    getQuery(): PHRawMappedSQLQuery<any>;
    toJSON(parsedQuery?: PHJsonMappedQSLQuery): JSONFunctionOperation;
}
export declare function bool(primitive: boolean): IQBooleanField;
export declare function date(primitive: Date): IQDateField;
export declare function num(primitive: number): IQNumberField;
export declare function str(primitive: string): IQStringField;
