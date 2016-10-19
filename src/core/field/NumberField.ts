import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {NumberOperation, JSONNumberOperation, INumberOperation} from "../operation/NumberOperation";
/**
 * Created by Papa on 8/11/2016.
 */


export interface JSONNumberFieldOperation extends JSONNumberOperation {
}

export interface IQNumberField<IQ extends IQEntity> extends IQField<IQ, number, JSONNumberFieldOperation, INumberOperation> {

    greaterThan(
        greaterThan:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    greaterThanOrEquals(
        greaterThanOrEquals:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    lessThan(
        lessThan:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

    lessThanOrEquals(
        lessThanOrEquals:number | IQNumberField<any>
    ):JSONNumberFieldOperation;

}

export class QNumberField<IQ extends IQEntity> extends QField<IQ, number, JSONNumberFieldOperation, INumberOperation> implements IQNumberField<IQ> {

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(QNumberField, q, qConstructor, entityName, fieldName, FieldType.NUMBER, new NumberOperation());
    }

    greaterThan(
        greaterThan:number
    ):JSONNumberFieldOperation{
        return this.setOperation(this.operation.greaterThan(greaterThan));
    }

    greaterThanOrEquals(
        greaterThanOrEquals:number
    ):JSONNumberFieldOperation{
        return this.setOperation(this.operation.greaterThanOrEquals(greaterThanOrEquals));
    }

    lessThan(
        lessThan:number
    ):JSONNumberFieldOperation{
        return this.setOperation(this.operation.lessThan(lessThan));
    }

    lessThanOrEquals(
        lessThanOrEquals:number
    ):JSONNumberFieldOperation {
        return this.setOperation(this.operation.lessThanOrEquals(lessThanOrEquals));
    }

}
