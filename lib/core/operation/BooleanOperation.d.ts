import { IFieldOperation, JSONFieldReference, FieldOperation } from "./FieldOperation";
import { IQBooleanField } from "../field/Field";
import { OperationType } from "./OperationType";
import { JSONBaseOperation } from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONBooleanOperation extends JSONBaseOperation {
    "$and"?: JSONBooleanOperation[];
    "$eq"?: boolean | JSONFieldReference;
    "$exists"?: boolean;
    "$ne"?: boolean | JSONFieldReference;
    "$not"?: JSONBooleanOperation;
    "$or"?: JSONBooleanOperation[];
}
export interface IBooleanOperation extends IFieldOperation<Date> {
    equals(value: boolean | IQBooleanField<any>): IBooleanOperation;
    exists(exists: boolean): IBooleanOperation;
    notEquals(value: boolean | IQBooleanField<any>): IBooleanOperation;
    and(...ops: IBooleanOperation[]): IBooleanOperation;
    or(...ops: IBooleanOperation[]): IBooleanOperation;
    not(op: IBooleanOperation): IBooleanOperation;
}
export declare class BooleanOperation extends FieldOperation<boolean> implements IBooleanOperation {
    constructor(type: OperationType);
    getDefinedInstance(type: OperationType, value: any): IBooleanOperation;
    equals(value: boolean | IQBooleanField<any>): IBooleanOperation;
    exists(exists: boolean): IBooleanOperation;
    notEquals(value: boolean | IQBooleanField<any>): IBooleanOperation;
    and(...ops: IBooleanOperation[]): IBooleanOperation;
    or(...ops: IBooleanOperation[]): IBooleanOperation;
    not(op: IBooleanOperation): IBooleanOperation;
}
