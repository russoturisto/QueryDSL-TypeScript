import { JSONBaseOperation, IOperation, Operation } from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONDateOperation extends JSONBaseOperation {
    "$eq"?: Date;
    "$exists"?: boolean;
    "$gt"?: Date;
    "$gte"?: Date;
    "$in"?: Date[];
    "$lt"?: Date;
    "$lte"?: Date;
    "$ne"?: Date;
    "$nin"?: Date[];
}
export interface IDateOperation extends IOperation {
    equals(value: Date): JSONDateOperation;
    exists(exists: boolean): JSONDateOperation;
    greaterThan(greaterThan: Date): JSONDateOperation;
    greaterThanOrEquals(greaterThanOrEquals: Date): JSONDateOperation;
    isIn(values: Date[]): JSONDateOperation;
    lessThan(lessThan: Date): JSONDateOperation;
    lessThanOrEquals(lessThanOrEquals: Date): JSONDateOperation;
    notEquals(value: Date): JSONDateOperation;
    notIn(values: Date[]): JSONDateOperation;
}
export declare class DateOperation extends Operation implements IDateOperation {
    constructor();
    equals(value: Date): JSONDateOperation;
    exists(exists: boolean): JSONDateOperation;
    greaterThan(greaterThan: Date): JSONDateOperation;
    greaterThanOrEquals(greaterThanOrEquals: Date): JSONDateOperation;
    isIn(values: Date[]): JSONDateOperation;
    lessThan(lessThan: Date): JSONDateOperation;
    lessThanOrEquals(lessThanOrEquals: Date): JSONDateOperation;
    notEquals(value: Date): JSONDateOperation;
    notIn(values: Date[]): JSONDateOperation;
}
