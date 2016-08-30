import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {StringOperation, IStringOperation, JSONStringOperation} from "../operation/StringOperation";
/**
 * Created by Papa on 8/11/2016.
 */


export interface JSONStringFieldOperation extends JSONStringOperation {
}

export interface IQStringField<IQ extends IQEntity> extends IQField<IQ, string, JSONStringFieldOperation, IStringOperation> {

    like(
        like:string | RegExp
    ):JSONStringFieldOperation;

}

export class QStringField<IQ extends IQEntity> extends QField<IQ, string, JSONStringFieldOperation, IStringOperation> implements IQStringField<IQ> {

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(q, qConstructor, entityName, fieldName, FieldType.BOOLEAN, new StringOperation());
    }

    like(
        like:string | RegExp
    ):JSONStringFieldOperation{
        return this.setOperation(this.operation.like(like));
    }

}
