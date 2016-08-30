import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
import { JSONNumberOperation, INumberOperation } from "../operation/NumberOperation";
/**
 * Created by Papa on 8/11/2016.
 */
export interface JSONNumberFieldOperation extends JSONNumberOperation {
}
export interface IQNumberField<IQ extends IQEntity> extends IQField<IQ, number, JSONNumberFieldOperation, INumberOperation> {
    greaterThan(greaterThan: number | IQNumberField<any>): JSONNumberFieldOperation;
    greaterThanOrEquals(greaterThanOrEquals: number | IQNumberField<any>): JSONNumberFieldOperation;
    lessThan(lessThan: number | IQNumberField<any>): JSONNumberFieldOperation;
    lessThanOrEquals(lessThanOrEquals: number | IQNumberField<any>): JSONNumberFieldOperation;
}
export declare class QNumberField<IQ extends IQEntity> extends QField<IQ, number, JSONNumberFieldOperation, INumberOperation> implements IQNumberField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    greaterThan(greaterThan: number): JSONNumberFieldOperation;
    greaterThanOrEquals(greaterThanOrEquals: number): JSONNumberFieldOperation;
    lessThan(lessThan: number): JSONNumberFieldOperation;
    lessThanOrEquals(lessThanOrEquals: number): JSONNumberFieldOperation;
}
