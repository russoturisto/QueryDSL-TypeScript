import { JSONFieldReference, IFieldOperation, FieldOperation } from "./FieldOperation";
import { IQNumberField } from "../field/Field";
import { OperationType } from "./OperationType";
import { JSONBaseOperation } from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONNumberOperation extends JSONBaseOperation {
    "$and"?: JSONNumberOperation[];
    "$eq"?: number | JSONFieldReference;
    "$exists"?: boolean;
    "$gt"?: number | JSONFieldReference;
    "$gte"?: number | JSONFieldReference;
    "$in"?: number[];
    "$lt"?: number | JSONFieldReference;
    "$lte"?: number | JSONFieldReference;
    "$ne"?: number | JSONFieldReference;
    "$nin"?: number[];
    "$not"?: JSONNumberOperation;
    "$or"?: JSONNumberOperation[];
}
export interface INumberOperation extends IFieldOperation<number> {
    equals(value: number | IQNumberField<any>): INumberOperation;
    exists(exists: boolean): INumberOperation;
    greaterThan(greaterThan: number | IQNumberField<any>): INumberOperation;
    greaterThanOrEquals(greaterThanOrEquals: number | IQNumberField<any>): INumberOperation;
    isIn(values: number[]): INumberOperation;
    lessThan(lessThan: number | IQNumberField<any>): INumberOperation;
    lessThanOrEquals(lessThanOrEquals: number | IQNumberField<any>): INumberOperation;
    notEquals(value: number | IQNumberField<any>): INumberOperation;
    notIn(values: number[]): INumberOperation;
    and(...ops: INumberOperation[]): INumberOperation;
    or(...ops: INumberOperation[]): INumberOperation;
    not(op: INumberOperation): INumberOperation;
}
export declare class NumberOperation extends FieldOperation<number> implements INumberOperation {
    constructor(type: OperationType);
    getDefinedInstance(type: OperationType, value: any): INumberOperation;
    equals(value: number | IQNumberField<any>): INumberOperation;
    exists(exists: boolean): INumberOperation;
    greaterThan(greaterThan: number | IQNumberField<any>): INumberOperation;
    greaterThanOrEquals(greaterThanOrEquals: number | IQNumberField<any>): INumberOperation;
    isIn(values: number[]): INumberOperation;
    lessThan(lessThan: number | IQNumberField<any>): INumberOperation;
    lessThanOrEquals(lessThanOrEquals: number | IQNumberField<any>): INumberOperation;
    notEquals(value: number | IQNumberField<any>): INumberOperation;
    notIn(values: number[]): INumberOperation;
    and(...ops: INumberOperation[]): INumberOperation;
    or(...ops: INumberOperation[]): INumberOperation;
    not(op: INumberOperation): INumberOperation;
}
