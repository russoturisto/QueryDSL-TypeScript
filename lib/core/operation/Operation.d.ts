/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { OperationType } from "./OperationType";
export interface IOperation<Q extends IQEntity<Q>> {
    objectEquals<OP extends IOperation<Q>>(otherOp: OP, checkValue?: boolean): boolean;
    getQ(): Q;
}
export declare abstract class Operation<Q extends IQEntity<Q>> implements IOperation<Q> {
    q: Q;
    fieldName: string;
    type: OperationType;
    constructor(q: Q, fieldName?: string, type?: OperationType);
    getQ(): Q;
    objectEquals<OP extends Operation<Q>>(otherOp: OP, checkValue?: boolean): boolean;
    protected abstract valueEquals<OP extends Operation<Q>>(otherOp: OP, checkChildValues?: boolean): boolean;
}
