/**
 * Created by Papa on 4/21/2016.
 */
import { ILogicalOperation, LogicalOperation } from "../operation/LogicalOperation";
import { IOperation } from "../operation/Operation";
import { IComparisonOperation } from "../operation/ComparisonOperation";
export interface IQEntity<Q extends IQEntity<Q>> extends ILogicalOperation<Q> {
    fields(fields: IOperation<Q>[]): Q;
    joinOn<T>(comparisonOp: IComparisonOperation<T, Q>): any;
}
export declare class QEntity<Q extends QEntity<Q>> implements IQEntity<Q> {
    private nativeName;
    relations: any[];
    rootOperation: LogicalOperation<Q>;
    constructor(nativeName?: string);
    addRelation(otherQ: Q): void;
    addOperation<O extends IOperation<Q>>(op: O): void;
    getQ(): Q;
    fields(fields: IOperation<Q>[]): Q;
    joinOn<T>(comparisonOp: IComparisonOperation<T, Q>): void;
    and(...ops: IOperation<Q>[]): IOperation<Q>;
    or(...ops: IOperation<Q>[]): IOperation<Q>;
    not(op: IOperation<Q>): IOperation<Q>;
    objectEquals<OP extends IOperation<Q>>(otherOp: OP, checkValues?: boolean): boolean;
}
