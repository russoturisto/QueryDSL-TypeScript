/**
 * Created by Papa on 4/21/2016.
 */
import { FieldType } from "../field/Field";
export interface JSONBaseOperation {
    "$eq"?: Date;
    "$exists"?: boolean;
    "$in"?: Date[];
    "$ne"?: Date;
    "$nin"?: Date[];
}
export interface IOperation<T, JO extends JSONBaseOperation> {
    type: FieldType;
    equals(value: T): JO;
    exists(exists: boolean): JO;
    isIn(values: T[]): JO;
    isNotNull(): JO;
    isNull(): JO;
    notEquals(value: T): JO;
    notIn(values: T[]): JO;
}
export declare abstract class Operation<T, JO extends JSONBaseOperation> implements IOperation<T, JO> {
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
