/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IOperation, Operation } from "./Operation";
import { OperationType } from "./OperationType";
export declare function and<IQ extends IQEntity<IQ>>(...ops: IOperation<IQ>[]): IOperation<IQ>;
export declare function or<IQ extends IQEntity<IQ>>(...ops: IOperation<IQ>[]): IOperation<IQ>;
export declare function not<IQ extends IQEntity<IQ>>(op: IOperation<IQ>): IOperation<IQ>;
export interface ILogicalOperation<IQ extends IQEntity<IQ>> extends IOperation<IQ> {
    and(...ops: IOperation<IQ>[]): IOperation<IQ>;
    or(...ops: IOperation<IQ>[]): IOperation<IQ>;
    not(op: IOperation<IQ>): IOperation<IQ>;
}
export declare class LogicalOperation<IQ extends IQEntity<IQ>> extends Operation<IQ> {
    childOps?: IOperation<IQ>[];
    static verifyChildOps<IQ extends IQEntity<IQ>>(ops: IOperation<IQ>[]): void;
    static addOperation<IQ extends IQEntity<IQ>>(operationType: OperationType, ops: IOperation<IQ>[]): IOperation<IQ>;
    constructor(q: IQ, type?: OperationType, childOps?: IOperation<IQ>[]);
    private verifyChildOps(ops?);
    private addOperation(operationType, ops);
    and(...ops: IOperation<IQ>[]): IOperation<IQ>;
    or(...ops: IOperation<IQ>[]): IOperation<IQ>;
    not(op: IOperation<IQ>): IOperation<IQ>;
    getChildOps(): IOperation<IQ>[];
    objectEquals<OP extends Operation<IQ>>(otherOp: OP, checkValue?: boolean): boolean;
    protected valueEquals<OP extends Operation<IQ>>(otherOp: OP, checkChildValues?: boolean): boolean;
}
