import { JSONBooleanOperation, IBooleanOperation } from "../operation/BooleanOperation";
import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
/**
 * Created by Papa on 8/10/2016.
 */
export interface JSONBooleanFieldOperation extends JSONBooleanOperation {
}
export interface IQBooleanField<IQ extends IQEntity> extends IQField<IQ, boolean, JSONBooleanFieldOperation, IBooleanOperation> {
    equals(value: boolean): JSONBooleanFieldOperation;
    exists(exists: boolean): JSONBooleanFieldOperation;
    notEquals(value: boolean): JSONBooleanFieldOperation;
}
export declare class QBooleanField<IQ extends IQEntity> extends QField<IQ, boolean, JSONBooleanFieldOperation, IBooleanOperation> implements IQBooleanField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
}
