/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IOperation, Operation } from "./Operation";
import { OperationType } from "./OperationType";
import { FieldType } from "../field/Field";
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
export declare class ComparisonOperation<T, IQ extends IQEntity<IQ>> extends Operation<IQ> implements IComparisonOperation<T, IQ> {
    isDefined: boolean;
    isEqComparison: boolean;
    isInComparison: boolean;
    isNinComparison: boolean;
    isNeComparison: boolean;
    isAnyComparison: boolean;
    isRegExp: boolean;
    anyValue: any;
    existsValue: boolean;
    eqValue: T | IComparisonOperation<T, IQ>;
    gtValue: number;
    gteValue: number;
    inValues: T[] | IComparisonOperation<T, IQ>[];
    likeValue: string | RegExp;
    ltValue: number;
    lteValue: number;
    neValue: T | IComparisonOperation<T, IQ>;
    ninValues: T[] | IComparisonOperation<T, IQ>[];
    constructor(owningEntity: IQ, fieldType: FieldType, fieldName: string, nativeFieldName?: string, type?: OperationType);
    valueEquals<OQ extends IQEntity<OQ>, OP extends Operation<IQ>>(otherOp: OP, checkValue?: boolean): boolean;
    getDefinedInstance(type: OperationType): ComparisonOperation<T, IQ>;
    equals(value: T | IComparisonOperation<T, IQ>): ComparisonOperation<T, IQ>;
    exists(exists: boolean): IComparisonOperation<T, IQ>;
    greaterThan(greaterThan: number): IComparisonOperation<T, IQ>;
    greaterThanOrEquals(greaterThanOrEquals: number): IComparisonOperation<T, IQ>;
    in(values: T[] | IComparisonOperation<T, IQ>[]): IComparisonOperation<T, IQ>;
    like(like: string | RegExp): IComparisonOperation<T, IQ>;
    lessThan(lessThan: number): IComparisonOperation<T, IQ>;
    lessThanOrEquals(greaterThanOrEquals: number): IComparisonOperation<T, IQ>;
    notEquals(value: T | IComparisonOperation<T, IQ>): IComparisonOperation<T, IQ>;
    notIn(values: T[] | IComparisonOperation<T, IQ>[]): IComparisonOperation<T, IQ>;
}
