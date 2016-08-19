import { JSONBaseOperation } from "../operation/Operation";
import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
import { NumberOperation } from "../operation/NumberOperation";
/**
 * Created by Papa on 8/11/2016.
 */
export interface JSONNumberFieldOperation extends JSONBaseOperation {
}
export interface IQNumberField<IQ extends IQEntity> extends IQField<IQ> {
    equals(value: number | IQNumberField<any>): JSONNumberFieldOperation;
    exists(exists: boolean): JSONNumberFieldOperation;
    greaterThan(greaterThan: number | IQNumberField<any>): JSONNumberFieldOperation;
    greaterThanOrEquals(greaterThanOrEquals: number | IQNumberField<any>): JSONNumberFieldOperation;
    isIn(values: number[]): JSONNumberFieldOperation;
    lessThan(lessThan: number | IQNumberField<any>): JSONNumberFieldOperation;
    lessThanOrEquals(lessThanOrEquals: number | IQNumberField<any>): JSONNumberFieldOperation;
    notEquals(value: number | IQNumberField<any>): JSONNumberFieldOperation;
    notIn(values: number[]): JSONNumberFieldOperation;
}
export declare class QNumberField<IQ extends IQEntity> extends QField<IQ> implements IQNumberField<IQ> {
    numberOperation: NumberOperation;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    equals(value: number): JSONNumberFieldOperation;
    exists(exists: boolean): JSONNumberFieldOperation;
    greaterThan(greaterThan: number): JSONNumberFieldOperation;
    greaterThanOrEquals(greaterThanOrEquals: number): JSONNumberFieldOperation;
    isIn(values: number[]): JSONNumberFieldOperation;
    lessThan(lessThan: number): JSONNumberFieldOperation;
    lessThanOrEquals(lessThanOrEquals: number): JSONNumberFieldOperation;
    notEquals(value: number): JSONNumberFieldOperation;
    notIn(values: number[]): JSONNumberFieldOperation;
}
