import {JSONBaseOperation} from "../operation/Operation";
import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {StringOperation} from "../operation/StringOperation";
/**
 * Created by Papa on 8/11/2016.
 */


export interface JSONStringFieldOperation extends JSONBaseOperation {
}

export interface IQStringField<IQ extends IQEntity> extends IQField<IQ> {

    equals(
        value:string
    ):JSONStringFieldOperation;

    exists(
        exists:boolean
    ):JSONStringFieldOperation;

    isIn(
        values:string[]
    ):JSONStringFieldOperation;

    like(
        like:string | RegExp
    ):JSONStringFieldOperation;

    notEquals(
        value:string
    ):JSONStringFieldOperation;

    notIn(
        values:string[]
    ):JSONStringFieldOperation;

}

export class QStringField<IQ extends IQEntity> extends QField<IQ> implements IQStringField<IQ> {

    stringOperation:StringOperation = new StringOperation();

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(q, qConstructor, entityName, fieldName, FieldType.BOOLEAN);
    }

    equals(
        value:string
    ):JSONStringFieldOperation{
        return this.setOperation(this.stringOperation.equals(value));
    }

    exists(
        exists:boolean
    ):JSONStringFieldOperation{
        return this.setOperation(this.stringOperation.exists(exists));
    }

    isIn(
        values:string[]
    ):JSONStringFieldOperation{
        return this.setOperation(this.stringOperation.isIn(values));
    }

    like(
        like:string | RegExp
    ):JSONStringFieldOperation{
        return this.setOperation(this.stringOperation.like(like));
    }

    notEquals(
        value:string
    ):JSONStringFieldOperation{
        return this.setOperation(this.stringOperation.notEquals(value));
    }

    notIn(
        values:string[]
    ):JSONStringFieldOperation{
        return this.setOperation(this.stringOperation.notIn(values));
    }

}
