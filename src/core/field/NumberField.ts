import {JSONBaseOperation} from "../operation/Operation";
import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {NumberOperation} from "../operation/NumberOperation";
/**
 * Created by Papa on 8/11/2016.
 */


export interface JSONNumberFieldOperation extends JSONBaseOperation {
}

export interface IQNumberField<IQ extends IQEntity> extends IQField<IQ> {

    equals(
        value:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    exists(
        exists:boolean
    ):JSONNumberFieldOperation;

    greaterThan(
        greaterThan:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    greaterThanOrEquals(
        greaterThanOrEquals:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    isIn(
        values:number[]
    ):JSONNumberFieldOperation;

    lessThan(
        lessThan:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    lessThanOrEquals(
        lessThanOrEquals:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    notEquals(
        value:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    notIn(
        values:number[]
    ):JSONNumberFieldOperation;

}

export class QNumberField<IQ extends IQEntity> extends QField<IQ> implements IQNumberField<IQ> {

    numberOperation:NumberOperation = new NumberOperation();

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(q, qConstructor, entityName, fieldName, FieldType.NUMBER);
    }

    equals(
        value:number
    ):JSONNumberFieldOperation{
        return this.setOperation(this.numberOperation.equals(value));
    }

    exists(
        exists:boolean
    ):JSONNumberFieldOperation{
        return this.setOperation(this.numberOperation.exists(exists));
    }

    greaterThan(
        greaterThan:number
    ):JSONNumberFieldOperation{
        return this.setOperation(this.numberOperation.greaterThan(greaterThan));
    }

    greaterThanOrEquals(
        greaterThanOrEquals:number
    ):JSONNumberFieldOperation{
        return this.setOperation(this.numberOperation.greaterThanOrEquals(greaterThanOrEquals));
    }

    isIn(
        values:number[]
    ):JSONNumberFieldOperation{
        return this.setOperation(this.numberOperation.isIn(values));
    }

    lessThan(
        lessThan:number
    ):JSONNumberFieldOperation{
        return this.setOperation(this.numberOperation.lessThan(lessThan));
    }

    lessThanOrEquals(
        lessThanOrEquals:number
    ):JSONNumberFieldOperation {
        return this.setOperation(this.numberOperation.lessThanOrEquals(lessThanOrEquals));
    }

    notEquals(
        value:number
    ):JSONNumberFieldOperation {
        return this.setOperation(this.numberOperation.notEquals(value));
    }

    notIn(
        values:number[]
    ):JSONNumberFieldOperation {
        return this.setOperation(this.numberOperation.notIn(values));
    }

}
