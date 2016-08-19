import { JSONBaseOperation } from "../operation/Operation";
import { IQEntity } from "../entity/Entity";
import { IQField, QField } from "./Field";
import { StringOperation } from "../operation/StringOperation";
/**
 * Created by Papa on 8/11/2016.
 */
export interface JSONStringFieldOperation extends JSONBaseOperation {
}
export interface IQStringField<IQ extends IQEntity> extends IQField<IQ> {
    equals(value: string): JSONStringFieldOperation;
    exists(exists: boolean): JSONStringFieldOperation;
    isIn(values: string[]): JSONStringFieldOperation;
    like(like: string | RegExp): JSONStringFieldOperation;
    notEquals(value: string): JSONStringFieldOperation;
    notIn(values: string[]): JSONStringFieldOperation;
}
export declare class QStringField<IQ extends IQEntity> extends QField<IQ> implements IQStringField<IQ> {
    stringOperation: StringOperation;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    equals(value: string): JSONStringFieldOperation;
    exists(exists: boolean): JSONStringFieldOperation;
    isIn(values: string[]): JSONStringFieldOperation;
    like(like: string | RegExp): JSONStringFieldOperation;
    notEquals(value: string): JSONStringFieldOperation;
    notIn(values: string[]): JSONStringFieldOperation;
}
