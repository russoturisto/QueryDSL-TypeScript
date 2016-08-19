import { JSONBaseOperation, Operation, IOperation } from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONBooleanOperation extends JSONBaseOperation {
    "$eq"?: boolean;
    "$exists"?: boolean;
    "$ne"?: boolean;
}
export interface IBooleanOperation extends IOperation {
    equals(value: boolean): JSONBooleanOperation;
    exists(exists: boolean): JSONBooleanOperation;
    notEquals(value: boolean): JSONBooleanOperation;
}
export declare class BooleanOperation extends Operation implements IBooleanOperation {
    constructor();
    equals(value: boolean): JSONBooleanOperation;
    exists(exists: boolean): JSONBooleanOperation;
    notEquals(value: boolean): JSONBooleanOperation;
}
