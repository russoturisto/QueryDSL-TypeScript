import { IOperation, Operation } from "./Operation";
import { OperationType } from "./OperationType";
export declare function and(...ops: IOperation[]): ILogicalOperation;
export declare function or(...ops: IOperation[]): ILogicalOperation;
export declare function not(op: IOperation): ILogicalOperation;
export interface ILogicalOperation extends IOperation {
    and(...ops: IOperation[]): IOperation;
    or(...ops: IOperation[]): IOperation;
    not(op: IOperation): IOperation;
}
export declare class LogicalOperation extends Operation implements ILogicalOperation {
    childOps: IOperation[];
    static verifyChildOps(ops: IOperation[]): void;
    static addOperation(operationType: OperationType, ops: IOperation[]): ILogicalOperation;
    constructor(type?: OperationType, childOps?: IOperation[]);
    private verifyChildOps(ops?);
    protected addOperation(operationType: OperationType, ops: IOperation[]): IOperation;
    and(...ops: IOperation[]): IOperation;
    or(...ops: IOperation[]): IOperation;
    not(op: IOperation): IOperation;
    getChildOps(): IOperation[];
    objectEquals<OP extends Operation>(otherOp: OP, checkValue?: boolean): boolean;
    toJSON(): any;
    protected valueEquals<OP extends Operation>(otherOp: OP, checkChildValues?: boolean): boolean;
}
