import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {DateOperation, JSONDateOperation, IDateOperation} from "../operation/DateOperation";
/**
 * Created by Papa on 8/11/2016.
 */


export interface JSONDateFieldOperation extends JSONDateOperation {
}

export interface IQDateField<IQ extends IQEntity> extends IQField<IQ, Date, JSONDateFieldOperation, IDateOperation> {

    greaterThan(
        greaterThan:Date
    ):JSONDateFieldOperation;

    greaterThanOrEquals(
        greaterThanOrEquals:Date
    ):JSONDateFieldOperation;

    lessThan(
        lessThan:Date
    ):JSONDateFieldOperation;

    lessThanOrEquals(
        lessThanOrEquals:Date
    ):JSONDateFieldOperation;

}

export class QDateField<IQ extends IQEntity> extends QField<IQ, Date, JSONDateFieldOperation, IDateOperation> implements IQDateField<IQ> {

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(q, qConstructor, entityName, fieldName, FieldType.DATE, new DateOperation());
    }

    greaterThan(
        greaterThan:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.operation.greaterThan(greaterThan));
    }

    greaterThanOrEquals(
        greaterThanOrEquals:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.operation.greaterThanOrEquals(greaterThanOrEquals));
    }

    lessThan(
        lessThan:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.operation.lessThan(lessThan));
    }

    lessThanOrEquals(
        lessThanOrEquals:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.operation.lessThanOrEquals(lessThanOrEquals));
    }

}