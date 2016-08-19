import { JSONOperation } from "./Operation";
import { IQueryOperation, QueryOperation } from "./QueryOperation";
import { OperationType } from "./OperationType";
import { FieldType } from "../field/Field";
/**
 * Created by Papa on 6/15/2016.
 */
export interface JSONFieldReference {
}
export interface IFieldOperation<T> extends IQueryOperation {
    fieldType: FieldType;
    includeField: boolean;
}
export declare abstract class FieldOperation<T> extends QueryOperation {
    fieldType: FieldType;
    type: OperationType;
    includeField: boolean;
    constructor(fieldType: FieldType);
    include(): FieldOperation<T>;
    toJSON(): JSONOperation;
}
