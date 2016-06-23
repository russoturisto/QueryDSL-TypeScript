import { JSONFieldReference, IFieldOperation, FieldOperation } from "./FieldOperation";
import { IQStringField, FieldType } from "../field/Field";
import { OperationType } from "./OperationType";
import { JSONBaseOperation } from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONStringOperation extends JSONBaseOperation {
    "$and"?: JSONStringOperation[];
    "$eq"?: JSONFieldReference | string;
    "$exists"?: boolean;
    "$in"?: Date[] | string[];
    "$like"?: string | RegExp;
    "$ne"?: JSONFieldReference | string;
    "$nin"?: string[];
    "$not"?: JSONStringOperation;
    "$or"?: JSONStringOperation[];
}
export interface IStringOperation extends IFieldOperation<string> {
    equals(value: string | IQStringField<any>): IStringOperation;
    exists(exists: boolean): IStringOperation;
    isIn(values: string[]): IStringOperation;
    like(like: string | RegExp): IStringOperation;
    notEquals(value: string | IQStringField<any>): IStringOperation;
    notIn(values: string[]): IStringOperation;
    and(...ops: IStringOperation[]): IStringOperation;
    or(...ops: IStringOperation[]): IStringOperation;
    not(op: IStringOperation): IStringOperation;
}
export declare class StringOperation extends FieldOperation<string> implements IStringOperation {
    fieldType: FieldType;
    getDefinedInstance(type: OperationType, value: any): IStringOperation;
    equals(value: string | IQStringField<any>): IStringOperation;
    exists(exists: boolean): IStringOperation;
    isIn(values: string[]): IStringOperation;
    like(like: string | RegExp): IStringOperation;
    notEquals(value: string | IQStringField<any>): IStringOperation;
    notIn(values: string[]): IStringOperation;
    and(...ops: IStringOperation[]): IStringOperation;
    or(...ops: IStringOperation[]): IStringOperation;
    not(op: IStringOperation): IStringOperation;
}
