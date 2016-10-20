import { JSONBaseOperation, Operation, IOperation } from "./Operation";
import { JSONStringOperation } from "./StringOperation";
import { JSONClauseObject } from "../field/Appliable";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONNumberOperation extends JSONBaseOperation {
    operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
    lValue: JSONClauseObject | JSONClauseObject[] | number | number[];
    rValue: JSONClauseObject | JSONClauseObject[] | number | number[];
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
