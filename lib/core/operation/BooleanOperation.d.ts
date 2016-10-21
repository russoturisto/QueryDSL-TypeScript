import { ValueOperation, IValueOperation, JSONValueOperation } from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONBooleanOperation extends JSONValueOperation<boolean> {
    operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin";
}
export interface IBooleanOperation extends IValueOperation<boolean, JSONBooleanOperation> {
}
export declare class BooleanOperation extends ValueOperation<boolean, JSONBooleanOperation> implements IBooleanOperation {
    constructor();
}
