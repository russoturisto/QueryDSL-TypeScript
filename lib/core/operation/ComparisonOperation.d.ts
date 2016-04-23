/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IOperation, Operation } from "./Operation";
export interface IComparisonOperation<T, Q extends IQEntity<Q>> extends IOperation<Q> {
    equals(value: T | IComparisonOperation<T, Q>): IComparisonOperation<T, Q>;
}
export declare class ComparisonOperation<T, Q extends IQEntity<Q>> extends Operation<Q> implements IComparisonOperation<T, Q> {
    value: T;
    operationValue: ComparisonOperation<T, Q>;
    constructor(q: Q, fieldName: string, nativeFieldName?: string);
    equals(value: T | IComparisonOperation<T, Q>): ComparisonOperation<T, Q>;
    valueEquals<OQ extends IQEntity<OQ>, OP extends Operation<Q>>(otherOp: OP, checkValue?: boolean): boolean;
}
