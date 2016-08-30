import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
import { JSONDateOperation, IDateOperation } from "../operation/DateOperation";
/**
 * Created by Papa on 8/11/2016.
 */
export interface JSONDateFieldOperation extends JSONDateOperation {
}
export interface IQDateField<IQ extends IQEntity> extends IQField<IQ, Date, JSONDateFieldOperation, IDateOperation> {
    greaterThan(greaterThan: Date): JSONDateFieldOperation;
    greaterThanOrEquals(greaterThanOrEquals: Date): JSONDateFieldOperation;
    lessThan(lessThan: Date): JSONDateFieldOperation;
    lessThanOrEquals(lessThanOrEquals: Date): JSONDateFieldOperation;
}
export declare class QDateField<IQ extends IQEntity> extends QField<IQ, Date, JSONDateFieldOperation, IDateOperation> implements IQDateField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    greaterThan(greaterThan: Date): JSONDateFieldOperation;
    greaterThanOrEquals(greaterThanOrEquals: Date): JSONDateFieldOperation;
    lessThan(lessThan: Date): JSONDateFieldOperation;
    lessThanOrEquals(lessThanOrEquals: Date): JSONDateFieldOperation;
}
