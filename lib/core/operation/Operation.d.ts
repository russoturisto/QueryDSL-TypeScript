/**
 * Created by Papa on 4/21/2016.
 */
import { FieldType } from "../field/Field";
import { JSONClauseObject, Appliable } from "../field/Appliable";
import { IQEntity } from "../entity/Entity";
import { PHRawSQLQuery, PHRawFlatSQLQuery } from "../../query/sql/PHSQLQuery";
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
export interface JSONValueOperation<T> extends JSONBaseOperation {
    lValue: JSONClauseObject;
    rValue: JSONClauseObject | JSONClauseObject[] | T | T[];
}
export interface IOperation<T, JO extends JSONBaseOperation> {
}
export interface IValueOperation<T, JO extends JSONBaseOperation> extends IOperation<T, JO> {
    type: FieldType;
    equals<JCO extends JSONClauseObject, IQ extends IQEntity>(value: T | Appliable<JCO, IQ> | PHRawSQLQuery): JO;
    exists(exists: PHRawFlatSQLQuery): JO;
    isIn<JCO extends JSONClauseObject, IQ extends IQEntity>(values: (T | Appliable<JCO, IQ>)[]): JO;
    isNotNull(): JO;
    isNull(): JO;
    notEquals(value: T | PHRawFlatSQLQuery): JO;
    notIn(values: T[]): JO;
}
export declare abstract class Operation<T, JO extends JSONBaseOperation> implements IOperation<T, JO> {
    type: FieldType;
    constructor(type: FieldType);
}
export declare abstract class ValueOperation<T, JO extends JSONValueOperation> extends Operation<T, JO> implements IValueOperation<T, JO> {
    type: FieldType;
    constructor(type: FieldType);
    equals(value: T): JO;
    exists(exists: boolean): JO;
    isNotNull(): JO;
    isNull(): JO;
    isIn(values: T[]): JO;
    notEquals(value: T): JO;
    notIn(values: T[]): JO;
}
