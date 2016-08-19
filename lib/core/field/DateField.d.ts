import { JSONBaseOperation } from "../operation/Operation";
import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
import { DateOperation } from "../operation/DateOperation";
/**
 * Created by Papa on 8/11/2016.
 */
export interface JSONDateFieldOperation extends JSONBaseOperation {
}
export interface IQDateField<IQ extends IQEntity> extends IQField<IQ> {
    equals(value: Date): JSONDateFieldOperation;
    exists(exists: boolean): JSONDateFieldOperation;
    greaterThan(greaterThan: Date): JSONDateFieldOperation;
    greaterThanOrEquals(greaterThanOrEquals: Date): JSONDateFieldOperation;
    isIn(values: Date[]): JSONDateFieldOperation;
    lessThan(lessThan: Date): JSONDateFieldOperation;
    lessThanOrEquals(lessThanOrEquals: Date): JSONDateFieldOperation;
    notEquals(value: Date): JSONDateFieldOperation;
    notIn(values: Date[]): JSONDateFieldOperation;
}
export declare class QDateField<IQ extends IQEntity> extends QField<IQ> implements IQDateField<IQ> {
    dateOperation: DateOperation;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    equals(value: Date): JSONDateFieldOperation;
    exists(exists: boolean): JSONDateFieldOperation;
    greaterThan(greaterThan: Date): JSONDateFieldOperation;
    greaterThanOrEquals(greaterThanOrEquals: Date): JSONDateFieldOperation;
    isIn(values: Date[]): JSONDateFieldOperation;
    lessThan(lessThan: Date): JSONDateFieldOperation;
    lessThanOrEquals(lessThanOrEquals: Date): JSONDateFieldOperation;
    notEquals(value: Date): JSONDateFieldOperation;
    notIn(values: Date[]): JSONDateFieldOperation;
}
