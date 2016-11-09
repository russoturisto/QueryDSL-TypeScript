/**
 * Created by Papa on 4/21/2016.
 */
import { IOperation, Operation, JSONBaseOperation } from "./Operation";
export declare function and(...ops: JSONBaseOperation[]): JSONLogicalOperation;
export declare function or(...ops: JSONBaseOperation[]): JSONLogicalOperation;
export declare function not(op: JSONBaseOperation): JSONLogicalOperation;
export interface JSONLogicalOperation extends JSONBaseOperation {
    operator: "$and" | "$not" | "$or";
    value: JSONBaseOperation | JSONBaseOperation[];
}
export interface ILogicalOperation extends IOperation {
    and(ops: JSONBaseOperation[]): JSONLogicalOperation;
    or(ops: JSONBaseOperation[]): JSONLogicalOperation;
    not(op: JSONBaseOperation): JSONLogicalOperation;
}
export declare class LogicalOperation extends Operation implements ILogicalOperation {
    static verifyChildOps(ops: IOperation[]): void;
    constructor();
    and(ops: JSONBaseOperation[]): JSONLogicalOperation;
    or(ops: JSONBaseOperation[]): JSONLogicalOperation;
    not(op: JSONBaseOperation): JSONLogicalOperation;
}
