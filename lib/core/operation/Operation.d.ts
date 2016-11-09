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
    rValue?: JSONClauseField | JSONClauseField[] | PHJsonFieldQSLQuery;
}
export interface JSONBaseOperation {
    category: OperationCategory;
    operator: string;
}
export interface JSONRawValueOperation<IQF extends IQOperableField<any, any, any, any>> extends JSONBaseOperation {
    lValue?: IQF;
    rValue?: IQF | IQF[] | PHRawFieldSQLQuery<IQF> | PHRawFieldSQLQuery<IQF>[];
}
export interface IOperation {
}
export interface IValueOperation<JRO extends JSONBaseOperation, IQF extends IQOperableField<any, JRO, any, any>> extends IOperation {
    category: OperationCategory;
    equals(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    greaterThan(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    greaterThanOrEquals(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isIn(lValue: IQF, rValue: (IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
    lessThan(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    lessThanOrEquals(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isNotNull(lValue: IQF): JRO;
    isNull(lValue: IQF): JRO;
    notEquals(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notIn(lValue: IQF, rValue: (IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
}
export declare abstract class Operation implements IOperation {
    category: OperationCategory;
    constructor(category: OperationCategory);
}
export declare abstract class ValueOperation<JRO extends JSONRawValueOperation<IQF>, IQF extends IQOperableField<any, JRO, any, any>> extends Operation implements IValueOperation<JRO, IQF> {
    category: OperationCategory;
    constructor(category: OperationCategory);
    equals(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    greaterThan(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    greaterThanOrEquals(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isNotNull(lValue: IQF): JRO;
    isNull(lValue: IQF): JRO;
    isIn(lValue: IQF, rValue: (IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
    lessThan(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    lessThanOrEquals(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notEquals(lValue: IQF, rValue: IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notIn(lValue: IQF, rValue: (IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
}
