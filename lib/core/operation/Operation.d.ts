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
    category: OperationCategory;
    operation: string;
}
export interface JSONRawValueOperation<T, IQF extends IQOperableField<any, any, any, any>> extends JSONBaseOperation {
    lValue?: T | IQF;
    rValue?: T | T[] | IQF | IQF[] | PHRawFieldSQLQuery<IQF> | PHRawFieldSQLQuery<IQF>[];
}
export interface IOperation<T, JO extends JSONBaseOperation> {
}
export interface IValueOperation<T, JRO extends JSONBaseOperation, IQF extends IQOperableField<T, JRO, any, any>> extends IOperation<T, JRO> {
    category: OperationCategory;
    equals(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    greaterThan(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    greaterThanOrEquals(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isIn(lValue: T | IQF, rValue: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
    lessThan(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    lessThanOrEquals(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isNotNull(lValue: T | IQF): JRO;
    isNull(lValue: T | IQF): JRO;
    notEquals(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notIn(lValue: T | IQF, rValue: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
}
export declare abstract class Operation<T, JRO extends JSONBaseOperation> implements IOperation<T, JRO> {
    category: OperationCategory;
    constructor(category: OperationCategory);
}
export declare abstract class ValueOperation<T, JRO extends JSONRawValueOperation<T, IQF>, IQF extends IQOperableField<T, JRO, any, any>> extends Operation<T, JRO> implements IValueOperation<T, JRO, IQF> {
    category: OperationCategory;
    constructor(category: OperationCategory);
    equals(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    greaterThan(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    greaterThanOrEquals(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isNotNull(lValue: T | IQF): JRO;
    isNull(lValue: T | IQF): JRO;
    isIn(lValue: T | IQF, rValue: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
    lessThan(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    lessThanOrEquals(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notEquals(lValue: T | IQF, rValue: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notIn(lValue: T | IQF, rValue: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
}
