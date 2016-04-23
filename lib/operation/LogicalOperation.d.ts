/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IOperation, Operation } from "./Operation";
import { OperationType } from "./OperationType";
export interface ILogicalOperation<Q extends IQEntity<Q>> extends IOperation<Q> {
    and(...ops: IOperation<Q>[]): IOperation<Q>;
    or(...ops: IOperation<Q>[]): IOperation<Q>;
    not(op: IOperation<Q>): IOperation<Q>;
}
export declare class LogicalOperation<Q extends IQEntity<Q>> extends Operation<Q> {
    childOps: IOperation<Q>[];
    constructor(q: Q, type?: OperationType, childOps?: IOperation<Q>[]);
    private verifyChildOps(ops?);
    private addOperation(operationType, ops);
    and(...ops: IOperation<Q>[]): IOperation<Q>;
    or(...ops: IOperation<Q>[]): IOperation<Q>;
    not(op: IOperation<Q>): IOperation<Q>;
    getChildOps(): IOperation<Q>[];
    objectEquals<OP extends Operation<Q>>(otherOp: OP, checkValue?: boolean): boolean;
    protected valueEquals<OP extends Operation<Q>>(otherOp: OP, checkChildValues?: boolean): boolean;
}
