import { JSONRawBooleanOperation, IBooleanOperation } from "../operation/BooleanOperation";
import { IQEntity } from "../entity/Entity";
import { IQOperableField, QOperableField } from "./OperableField";
import { JSONClauseField } from "./Appliable";
/**
 * Created by Papa on 8/10/2016.
 */
export interface IQBooleanField extends IQOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> {
}
export declare class QBooleanField extends QOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> implements IQBooleanField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string);
}
export declare class QBooleanFunction extends QBooleanField {
    private value;
    constructor(value: boolean);
    toJSON(): JSONClauseField;
}
