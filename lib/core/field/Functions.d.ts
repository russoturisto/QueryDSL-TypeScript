import { IQStringField } from "./StringField";
import { Appliable, JSONClauseObject, JSONClauseField } from "./Appliable";
import { IQEntity } from "../entity/Entity";
import { IQNumberField } from "./NumberField";
import { IQDateField } from "./DateField";
import { JSONBaseOperation, OperationCategory, JSONFunctionOperation } from "../operation/Operation";
import { IQOperableField } from "./OperableField";
import { IQBooleanField } from "./BooleanField";
import { PHRawMappedSQLQuery, PHJsonMappedQSLQuery } from "../../query/sql/query/ph/PHMappedSQLQuery";
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
export declare function abs<IQ extends IQEntity, IQF extends IQNumberField<IQ>>(numberField: IQF | number): IQF;
export declare function avg<IQ extends IQEntity, IQF extends IQNumberField<IQ>>(numberField: IQF): IQF;
export declare function count<IQ extends IQEntity, IQF extends IQOperableField<IQ, any, any, any, IQF>>(field: IQF): IQF;
export declare function max<IQ extends IQEntity, IQF extends IQOperableField<IQ, any, any, any, IQF>>(field: IQF): IQF;
export declare function min<IQ extends IQEntity, IQF extends IQOperableField<IQ, any, any, any, IQF>>(field: IQF): IQF;
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
export declare abstract class StandAloneFunction {
}
export declare function distinct(selectClause: any): IQDistinctFunction;
export interface IQDistinctFunction {
}
export declare class QDistinctFunction extends StandAloneFunction implements IQDistinctFunction, Appliable<JSONClauseObject, any, any> {
    __appliedFunctions__: JSONSqlFunctionCall[];
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): any;
    getSelectClause(): any;
    toJSON(parsedSelectClause?: any): JSONClauseField;
    static getSelect(distinct: QDistinctFunction): any;
}
export declare function exists<IE>(phRawQuery: PHRawMappedSQLQuery<IE>): IQExistsFunction;
export interface IQExistsFunction extends JSONBaseOperation {
}
export declare class QExistsFunction extends StandAloneFunction implements IQExistsFunction, Appliable<JSONClauseObject, any, any> {
    __appliedFunctions__: JSONSqlFunctionCall[];
    operator: string;
    category: OperationCategory;
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): any;
    getQuery(): PHRawMappedSQLQuery<any>;
    toJSON(parsedQuery?: PHJsonMappedQSLQuery): JSONFunctionOperation;
}
export declare function bool(primitive: boolean): IQBooleanField<any>;
export declare function date(primitive: Date): IQDateField<any>;
export declare function num(primitive: number): IQNumberField<any>;
export declare function str(primitive: string): IQStringField<any>;
