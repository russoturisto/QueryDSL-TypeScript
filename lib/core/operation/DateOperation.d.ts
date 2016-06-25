import { JSONFieldReference, IFieldOperation, FieldOperation } from "./FieldOperation";
import { IQDateField } from "../field/Field";
import { OperationType } from "./OperationType";
import { JSONBaseOperation } from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONDateOperation extends JSONBaseOperation {
    "$and"?: JSONDateOperation[];
    "$eq"?: Date | JSONFieldReference;
    "$exists"?: boolean;
    "$gt"?: Date | JSONFieldReference;
    "$gte"?: Date | JSONFieldReference;
    "$in"?: Date[];
    "$lt"?: Date | JSONFieldReference;
    "$lte"?: Date | JSONFieldReference;
    "$ne"?: Date | JSONFieldReference;
    "$nin"?: Date[];
    "$not"?: JSONDateOperation;
    "$or"?: JSONDateOperation[];
}
export interface IDateOperation extends IFieldOperation<Date> {
    equals(value: Date | IQDateField<any>): IDateOperation;
    exists(exists: boolean): IDateOperation;
    greaterThan(greaterThan: Date | IQDateField<any>): IDateOperation;
    greaterThanOrEquals(greaterThanOrEquals: Date | IQDateField<any>): IDateOperation;
    isIn(values: Date[]): IDateOperation;
    lessThan(lessThan: Date | IQDateField<any>): IDateOperation;
    lessThanOrEquals(lessThanOrEquals: Date | IQDateField<any>): IDateOperation;
    notEquals(value: Date | IQDateField<any>): IDateOperation;
    notIn(values: Date[]): IDateOperation;
    and(...ops: IDateOperation[]): IDateOperation;
    or(...ops: IDateOperation[]): IDateOperation;
    not(op: IDateOperation): IDateOperation;
}
export declare class DateOperation extends FieldOperation<Date> implements IDateOperation {
    constructor(type: OperationType);
    getDefinedInstance(type: OperationType, value: any): IDateOperation;
    equals(value: Date | IQDateField<any>): IDateOperation;
    exists(exists: boolean): IDateOperation;
    greaterThan(greaterThan: Date | IQDateField<any>): IDateOperation;
    greaterThanOrEquals(greaterThanOrEquals: Date | IQDateField<any>): IDateOperation;
    isIn(values: Date[]): IDateOperation;
    lessThan(lessThan: Date | IQDateField<any>): IDateOperation;
    lessThanOrEquals(lessThanOrEquals: Date | IQDateField<any>): IDateOperation;
    notEquals(value: Date | IQDateField<any>): IDateOperation;
    notIn(values: Date[]): IDateOperation;
    and(...ops: IDateOperation[]): IDateOperation;
    or(...ops: IDateOperation[]): IDateOperation;
    not(op: IDateOperation): IDateOperation;
}
