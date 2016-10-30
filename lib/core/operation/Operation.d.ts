import { PHRawFieldSQLQuery, PHJsonFieldQSLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { JSONClauseField, JSONClauseObject } from "../field/Appliable";
import { IQOperableField } from "../field/OperableField";
export declare enum OperationCategory {
    BOOLEAN = 0,
    DATE = 1,
    FUNCTION = 2,
    LOGICAL = 3,
    NUMBER = 4,
    STRING = 5,
}
export interface JSONFunctionOperation extends JSONBaseOperation {
    object: JSONClauseObject;
}
export interface JSONValueOperation extends JSONBaseOperation {
    lValue: JSONClauseField;
    rValue?: boolean | boolean[] | Date | Date[] | number | number[] | string | string[] | JSONClauseField | JSONClauseField[] | PHJsonFieldQSLQuery;
}
export interface JSONBaseOperation {
    operator: string;
    category: OperationCategory;
}
export interface JSONRawValueOperation<IQF extends IQOperableField<any, any, any, any>> extends JSONBaseOperation {
    lValue?: IQF;
    rValue?: any;
}
export interface IOperation<T, JO extends JSONBaseOperation> {
}
export interface IValueOperation<T, JRO extends JSONBaseOperation, IQF extends IQOperableField<T, JRO, any, any>> extends IOperation<T, JRO> {
    category: OperationCategory;
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
    isNotNull(): JRO;
    isNull(): JRO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
}
export declare abstract class Operation<T, JRO extends JSONBaseOperation> implements IOperation<T, JRO> {
    category: OperationCategory;
    constructor(category: OperationCategory);
}
export declare abstract class ValueOperation<T, JRO extends JSONRawValueOperation<IQF>, IQF extends IQOperableField<T, JRO, any, any>> extends Operation<T, JRO> implements IValueOperation<T, JRO, IQF> {
    category: OperationCategory;
    constructor(category: OperationCategory);
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isNotNull(): JRO;
    isNull(): JRO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
}
