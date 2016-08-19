import {JSONBaseOperation} from "../operation/Operation";
import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {DateOperation} from "../operation/DateOperation";
/**
 * Created by Papa on 8/11/2016.
 */


export interface JSONDateFieldOperation extends JSONBaseOperation {
}

export interface IQDateField<IQ extends IQEntity> extends IQField<IQ> {

    equals(
        value:Date
    ):JSONDateFieldOperation;

    exists(
        exists:boolean
    ):JSONDateFieldOperation;

    greaterThan(
        greaterThan:Date
    ):JSONDateFieldOperation;

    greaterThanOrEquals(
        greaterThanOrEquals:Date
    ):JSONDateFieldOperation;

    isIn(
        values:Date[]
    ):JSONDateFieldOperation;

    lessThan(
        lessThan:Date
    ):JSONDateFieldOperation;

    lessThanOrEquals(
        lessThanOrEquals:Date
    ):JSONDateFieldOperation;

    notEquals(
        value:Date
    ):JSONDateFieldOperation;

    notIn(
        values:Date[]
    ):JSONDateFieldOperation;

}

export class QDateField<IQ extends IQEntity> extends QField<IQ> implements IQDateField<IQ> {

    dateOperation:DateOperation = new DateOperation();

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(q, qConstructor, entityName, fieldName, FieldType.DATE);
    }

    equals(
        value:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.equals(value));
    }

    exists(
        exists:boolean
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.exists(exists));
    }

    greaterThan(
        greaterThan:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.greaterThan(greaterThan));
    }

    greaterThanOrEquals(
        greaterThanOrEquals:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.greaterThanOrEquals(greaterThanOrEquals));
    }

    isIn(
        values:Date[]
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.isIn(values));
    }

    lessThan(
        lessThan:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.lessThan(lessThan));
    }

    lessThanOrEquals(
        lessThanOrEquals:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.lessThanOrEquals(lessThanOrEquals));
    }

    notEquals(
        value:Date
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.notEquals(value));
    }

    notIn(
        values:Date[]
    ):JSONDateFieldOperation {
        return this.setOperation(this.dateOperation.notIn(values));
    }

}