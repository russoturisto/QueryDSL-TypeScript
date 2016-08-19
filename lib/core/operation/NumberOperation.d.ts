import { JSONBaseOperation, Operation, IOperation } from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONNumberOperation extends JSONBaseOperation {
    "$eq"?: number;
    "$exists"?: boolean;
    "$gt"?: number;
    "$gte"?: number;
    "$in"?: number[];
    "$lt"?: number;
    "$lte"?: number;
    "$ne"?: number;
    "$nin"?: number[];
}
export interface INumberOperation extends IOperation {
    equals(value: number): JSONNumberOperation;
    exists(exists: boolean): JSONNumberOperation;
    greaterThan(greaterThan: number): JSONNumberOperation;
    greaterThanOrEquals(greaterThanOrEquals: number): JSONNumberOperation;
    isIn(values: number[]): JSONNumberOperation;
    lessThan(lessThan: number): JSONNumberOperation;
    lessThanOrEquals(lessThanOrEquals: number): JSONNumberOperation;
    notEquals(value: number): JSONNumberOperation;
    notIn(values: number[]): JSONNumberOperation;
}
export declare class NumberOperation extends Operation implements INumberOperation {
    constructor();
    equals(value: number): JSONNumberOperation;
    exists(exists: boolean): JSONNumberOperation;
    greaterThan(greaterThan: number): JSONNumberOperation;
    greaterThanOrEquals(greaterThanOrEquals: number): JSONNumberOperation;
    isIn(values: number[]): JSONNumberOperation;
    lessThan(lessThan: number): JSONNumberOperation;
    lessThanOrEquals(lessThanOrEquals: number): JSONNumberOperation;
    notEquals(value: number): JSONNumberOperation;
    notIn(values: number[]): JSONNumberOperation;
}
