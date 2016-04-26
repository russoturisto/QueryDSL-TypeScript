/**
 * Created by Papa on 4/21/2016.
 */
import { ILogicalOperation, LogicalOperation } from "../operation/LogicalOperation";
import { IOperation } from "../operation/Operation";
import { IComparisonOperation } from "../operation/ComparisonOperation";
import { IQRelation } from "./Relation";
export interface IQEntity<Q extends IQEntity<Q>> extends ILogicalOperation<Q> {
    fields(fields: IOperation<Q>[]): Q;
    joinOn<T, C extends IComparisonOperation<T, Q>>(comparisonOp: IComparisonOperation<T, Q>): any;
    addOneRelation<OQ extends IQEntity<OQ>>(otherEntity: OQ, foreignKeyProperty: string): any;
    addManyRelation<OQ extends IQEntity<OQ>>(otherEntity: OQ): any;
}
export declare class QEntity<Q extends QEntity<Q>> implements IQEntity<Q> {
    private nativeName;
    relations: IQRelation<any>[];
    rootOperation: LogicalOperation<Q>;
    constructor(nativeName?: string);
    addOneRelation<OQ extends IQEntity<OQ>>(otherEntity: OQ, foreignKeyProperty: string): void;
    addManyRelation<OQ extends IQEntity<OQ>>(otherEntity: OQ): void;
    addOperation<O extends IOperation<Q>>(op: O): void;
    getQ(): Q;
    fields(fields: IOperation<Q>[]): Q;
    joinOn<T, C extends IComparisonOperation<T, Q>>(comparisonOp: IComparisonOperation<T, Q>): void;
    and(...ops: IOperation<Q>[]): IOperation<Q>;
    or(...ops: IOperation<Q>[]): IOperation<Q>;
    not(op: IOperation<Q>): IOperation<Q>;
    objectEquals<OP extends IOperation<Q>>(otherOp: OP, checkValues?: boolean): boolean;
}
