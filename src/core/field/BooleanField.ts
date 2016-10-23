import {BooleanOperation, JSONRawBooleanOperation, IBooleanOperation} from "../operation/BooleanOperation";
import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
/**
 * Created by Papa on 8/10/2016.
 */


export interface IQBooleanField<IQ extends IQEntity> extends IQField<IQ, boolean, JSONRawBooleanOperation<IQ>, IBooleanOperation<IQ>, IQBooleanField<IQ>> {
}

export class QBooleanField<IQ extends IQEntity> extends QField<IQ, boolean, JSONRawBooleanOperation<IQ>, IBooleanOperation<IQ>, IQBooleanField<IQ>> implements IQBooleanField<IQ> {

    constructor(
        q:IQ,
        qConstructor:new() => IQ,
        entityName:string,
        fieldName:string
    ) {
        super(QBooleanField, q, qConstructor, entityName, fieldName, FieldType.BOOLEAN, new BooleanOperation<IQ>());
    }

}
