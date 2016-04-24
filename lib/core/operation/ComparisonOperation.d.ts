/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IOperation, Operation } from "./Operation";
import { OperationType } from "./OperationType";
export interface IComparisonOperation<T, Q extends IQEntity<Q>, C extends IComparisonOperation<T, Q, C>> extends IOperation<Q> {
    equals(value: T | IComparisonOperation<T, Q, C>): IComparisonOperation<T, Q, C>;
    exists(exists: boolean): IComparisonOperation<T, Q, C>;
    greaterThan(greaterThan: number): IComparisonOperation<T, Q, C>;
    greaterThanOrEquals(greaterThanOrEquals: number): IComparisonOperation<T, Q, C>;
    in(values: T[] | IComparisonOperation<T, Q, C>[]): IComparisonOperation<T, Q, C>;
    like(like: string | RegExp): IComparisonOperation<T, Q, C>;
    lessThan(lessThan: number): IComparisonOperation<T, Q, C>;
    lessThanOrEquals(lessThanOrEquals: number): IComparisonOperation<T, Q, C>;
    notEquals(value: T | IComparisonOperation<T, Q, C>): IComparisonOperation<T, Q, C>;
    notIn(values: T[] | IComparisonOperation<T, Q, C>[]): IComparisonOperation<T, Q, C>;
}
export declare abstract class ComparisonOperation<T, Q extends IQEntity<Q>, C extends ComparisonOperation<T, Q, C>> extends Operation<Q> implements IComparisonOperation<T, Q, C> {
    isDefined: boolean;
    isEqComparison: boolean;
    isInComparison: boolean;
    isNinComparison: boolean;
    isNeComparison: boolean;
    isAnyComparison: boolean;
    isRegExp: boolean;
    anyValue: any;
    existsValue: boolean;
    eqValue: T | IComparisonOperation<T, Q, C>;
    gtValue: number;
    gteValue: number;
    inValues: T[] | IComparisonOperation<T, Q, C>[];
    likeValue: string | RegExp;
    ltValue: number;
    lteValue: number;
    neValue: T | IComparisonOperation<T, Q, C>;
    ninValues: T[] | IComparisonOperation<T, Q, C>[];
    constructor(q: Q, fieldName: string, type?: OperationType, nativeFieldName?: string);
    valueEquals<OQ extends IQEntity<OQ>, OP extends Operation<Q>>(otherOp: OP, checkValue?: boolean): boolean;
    getDefinedInstance(type: OperationType): ComparisonOperation<T, Q, C>;
    abstract getInstance(type: OperationType): ComparisonOperation<T, Q, C>;
    equals(value: T | IComparisonOperation<T, Q, C>): ComparisonOperation<T, Q, C>;
    exists(exists: boolean): IComparisonOperation<T, Q, C>;
    greaterThan(greaterThan: number): IComparisonOperation<T, Q, C>;
    greaterThanOrEquals(greaterThanOrEquals: number): IComparisonOperation<T, Q, C>;
    in(values: T[] | IComparisonOperation<T, Q, C>[]): IComparisonOperation<T, Q, C>;
    like(like: string | RegExp): IComparisonOperation<T, Q, C>;
    lessThan(lessThan: number): IComparisonOperation<T, Q, C>;
    lessThanOrEquals(greaterThanOrEquals: number): IComparisonOperation<T, Q, C>;
    notEquals(value: T | IComparisonOperation<T, Q, C>): IComparisonOperation<T, Q, C>;
    notIn(values: T[] | IComparisonOperation<T, Q, C>[]): IComparisonOperation<T, Q, C>;
}
