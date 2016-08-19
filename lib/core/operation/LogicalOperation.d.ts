/**
 * Created by Papa on 4/21/2016.
 */
import { IOperation, Operation, JSONBaseOperation } from "./Operation";
export interface JSONLogicalOperation extends JSONBaseOperation {
    "$and"?: JSONBaseOperation[];
    "$not"?: JSONBaseOperation;
    "$or"?: JSONBaseOperation[];
}
export interface ILogicalOperation extends IOperation {
    and(...ops: JSONBaseOperation[]): JSONBaseOperation;
    or(...ops: JSONBaseOperation[]): JSONBaseOperation;
    not(op: JSONBaseOperation): JSONBaseOperation;
}
export declare class LogicalOperation extends Operation implements ILogicalOperation {
    static verifyChildOps(ops: IOperation[]): void;
    constructor();
    and(...ops: JSONBaseOperation[]): JSONBaseOperation;
    or(...ops: JSONBaseOperation[]): JSONBaseOperation;
    not(op: JSONBaseOperation): JSONBaseOperation;
}
