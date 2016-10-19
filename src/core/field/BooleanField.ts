import {JSONBaseOperation} from "../operation/Operation";
import {BooleanOperation, JSONBooleanOperation, IBooleanOperation} from "../operation/BooleanOperation";
import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
/**
 * Created by Papa on 8/10/2016.
 */


export interface JSONBooleanFieldOperation extends JSONBooleanOperation {
}

export interface IQBooleanField<IQ extends IQEntity> extends IQField<IQ, boolean, JSONBooleanFieldOperation, IBooleanOperation> {

    equals(
        value:boolean
    ):JSONBooleanFieldOperation;

    exists(
        exists:boolean
    ):JSONBooleanFieldOperation;

    notEquals(
        value:boolean
    ):JSONBooleanFieldOperation;

}

export class QBooleanField<IQ extends IQEntity> extends QField<IQ, boolean, JSONBooleanFieldOperation, IBooleanOperation> implements IQBooleanField<IQ> {

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(QBooleanField, q, qConstructor, entityName, fieldName, FieldType.BOOLEAN, new BooleanOperation());
    }

}
