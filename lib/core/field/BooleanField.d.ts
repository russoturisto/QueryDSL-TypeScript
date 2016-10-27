import { JSONRawBooleanOperation, IBooleanOperation } from "../operation/BooleanOperation";
import { IQEntity } from "../entity/Entity";
import { IQOperableField, QOperableField } from "./OperableField";
import { JSONClauseField } from "./Appliable";
/**
 * Created by Papa on 8/10/2016.
 */
export interface IQBooleanField<IQ extends IQEntity> extends IQOperableField<IQ, boolean, JSONRawBooleanOperation<IQ>, IBooleanOperation<IQ>, IQBooleanField<IQ>> {
}
export declare class QBooleanField<IQ extends IQEntity> extends QOperableField<IQ, boolean, JSONRawBooleanOperation<IQ>, IBooleanOperation<IQ>, IQBooleanField<IQ>> implements IQBooleanField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
}
export declare class QBooleanFunction extends QBooleanField<any> {
    private value;
    constructor(value: boolean);
    toJSON(): JSONClauseField;
}
