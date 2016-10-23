/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { PHRawFieldSQLQuery } from "../../query/sql/PHSQLQuery";
import { IQField } from "../field/Field";
export declare enum OperationCategory {
    BOOLEAN = 0,
    DATE = 1,
    LOGICAL = 2,
    NUMBER = 3,
    STRING = 4,
}
export interface JSONBaseOperation {
    operator: string;
    category: OperationCategory;
}
export interface JSONRawValueOperation<IQF extends IQField<any, any, any, any, any>> extends JSONBaseOperation {
    lValue?: IQF;
    rValue?: any;
}
export interface IOperation<T, JO extends JSONBaseOperation> {
}
export interface IValueOperation<T, JRO extends JSONBaseOperation, IQ extends IQEntity, IQF extends IQField<any, T, JRO, any, any>> extends IOperation<T, JRO> {
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
export declare abstract class ValueOperation<T, JRO extends JSONRawValueOperation<IQF>, IQ extends IQEntity, IQF extends IQField<any, T, JRO, any, any>> extends Operation<T, JRO> implements IValueOperation<T, JRO, IQ, IQF> {
    category: OperationCategory;
    constructor(category: OperationCategory);
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    isNotNull(): JRO;
    isNull(): JRO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JRO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JRO;
}
