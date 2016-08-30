import { JSONBaseOperation, Operation, IOperation } from "./Operation";
import { JSONStringOperation } from "./StringOperation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONNumberOperation extends JSONBaseOperation {
    "$gt"?: number;
    "$gte"?: number;
    "$lt"?: number;
    "$lte"?: number;
}
export interface INumberOperation extends IOperation<number, JSONStringOperation> {
    greaterThan(greaterThan: number): JSONNumberOperation;
    greaterThanOrEquals(greaterThanOrEquals: number): JSONNumberOperation;
    lessThan(lessThan: number): JSONNumberOperation;
    lessThanOrEquals(lessThanOrEquals: number): JSONNumberOperation;
}
export declare class NumberOperation extends Operation<number, JSONStringOperation> implements INumberOperation {
    constructor();
    greaterThan(greaterThan: number): JSONNumberOperation;
    greaterThanOrEquals(greaterThanOrEquals: number): JSONNumberOperation;
    lessThan(lessThan: number): JSONNumberOperation;
    lessThanOrEquals(lessThanOrEquals: number): JSONNumberOperation;
}
