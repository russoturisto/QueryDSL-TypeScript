/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IOperation, Operation } from "./Operation";
import { OperationType } from "./OperationType";
export interface IComparisonOperation<T, Q extends IQEntity<Q>> extends IOperation<Q> {
    equals(value: T | IComparisonOperation<T, Q>): IComparisonOperation<T, Q>;
    exists(exists: boolean): IComparisonOperation<T, Q>;
    greaterThan(greaterThan: number): IComparisonOperation<T, Q>;
    greaterThanOrEquals(greaterThanOrEquals: number): IComparisonOperation<T, Q>;
    in(values: T[] | IComparisonOperation<T, Q>[]): IComparisonOperation<T, Q>;
    like(like: string | RegExp): IComparisonOperation<T, Q>;
    lessThan(lessThan: number): IComparisonOperation<T, Q>;
    lessThanOrEquals(lessThanOrEquals: number): IComparisonOperation<T, Q>;
    notEquals(value: T | IComparisonOperation<T, Q>): IComparisonOperation<T, Q>;
    notIn(values: T[] | IComparisonOperation<T, Q>[]): IComparisonOperation<T, Q>;
}
export declare class ComparisonOperation<T, Q extends IQEntity<Q>> extends Operation<Q> implements IComparisonOperation<T, Q> {
    isDefined: boolean;
    isEqComparison: boolean;
    isInComparison: boolean;
    isNinComparison: boolean;
    isNeComparison: boolean;
    isAnyComparison: boolean;
    isRegExp: boolean;
    anyValue: any;
    existsValue: boolean;
    eqValue: T | IComparisonOperation<T, Q>;
    gtValue: number;
    gteValue: number;
    inValues: T[] | IComparisonOperation<T, Q>[];
    likeValue: string | RegExp;
    ltValue: number;
    lteValue: number;
    neValue: T | IComparisonOperation<T, Q>;
    ninValues: T[] | IComparisonOperation<T, Q>[];
    constructor(q: Q, fieldName: string, type?: OperationType, nativeFieldName?: string);
    valueEquals<OQ extends IQEntity<OQ>, OP extends Operation<Q>>(otherOp: OP, checkValue?: boolean): boolean;
    getDefinedInstance(type: OperationType): ComparisonOperation<T, Q>;
    equals(value: T | IComparisonOperation<T, Q>): ComparisonOperation<T, Q>;
    exists(exists: boolean): IComparisonOperation<T, Q>;
    greaterThan(greaterThan: number): IComparisonOperation<T, Q>;
    greaterThanOrEquals(greaterThanOrEquals: number): IComparisonOperation<T, Q>;
    in(values: T[] | IComparisonOperation<T, Q>[]): IComparisonOperation<T, Q>;
    like(like: string | RegExp): IComparisonOperation<T, Q>;
    lessThan(lessThan: number): IComparisonOperation<T, Q>;
    lessThanOrEquals(greaterThanOrEquals: number): IComparisonOperation<T, Q>;
    notEquals(value: T | IComparisonOperation<T, Q>): IComparisonOperation<T, Q>;
    notIn(values: T[] | IComparisonOperation<T, Q>[]): IComparisonOperation<T, Q>;
}
