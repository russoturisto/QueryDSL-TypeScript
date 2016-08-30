/**
 * Created by Papa on 4/21/2016.
 */
import { IOperation, Operation, JSONBaseOperation } from "./Operation";
export interface JSONLogicalOperation extends JSONBaseOperation {
    "$and"?: JSONBaseOperation[];
    "$not"?: JSONBaseOperation;
    "$or"?: JSONBaseOperation[];
}
export interface ILogicalOperation extends IOperation<any, JSONLogicalOperation> {
    and(...ops: JSONBaseOperation[]): JSONLogicalOperation;
    or(...ops: JSONBaseOperation[]): JSONLogicalOperation;
    not(op: JSONBaseOperation): JSONLogicalOperation;
}
export declare class LogicalOperation extends Operation<any, JSONLogicalOperation> implements ILogicalOperation {
    static verifyChildOps(ops: IOperation<any, JSONLogicalOperation>[]): void;
    constructor();
    and(...ops: JSONBaseOperation[]): JSONLogicalOperation;
    or(...ops: JSONBaseOperation[]): JSONLogicalOperation;
    not(op: JSONBaseOperation): JSONLogicalOperation;
}
