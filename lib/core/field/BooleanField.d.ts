import { JSONBaseOperation } from "../operation/Operation";
import { BooleanOperation } from "../operation/BooleanOperation";
import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
/**
 * Created by Papa on 8/10/2016.
 */
export interface JSONBooleanFieldOperation extends JSONBaseOperation {
}
export interface IQBooleanField<IQ extends IQEntity> extends IQField<IQ> {
    equals(value: boolean): JSONBooleanFieldOperation;
    exists(exists: boolean): JSONBooleanFieldOperation;
    notEquals(value: boolean): JSONBooleanFieldOperation;
}
export declare class QBooleanField<IQ extends IQEntity> extends QField<IQ> implements IQBooleanField<IQ> {
    booleanOperation: BooleanOperation;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    equals(value: boolean): JSONBooleanFieldOperation;
    exists(exists: boolean): JSONBooleanFieldOperation;
    notEquals(value: boolean): JSONBooleanFieldOperation;
}
