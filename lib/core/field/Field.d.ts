/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { JSONBaseOperation } from "../operation/Operation";
export declare enum FieldType {
    BOOLEAN = 0,
    BOOLEAN_ARRAY = 1,
    DATE = 2,
    DATE_ARRAY = 3,
    NUMBER = 4,
    NUMBER_ARRAY = 5,
    STRING = 6,
    STRING_ARRAY = 7,
}
export interface IQField<IQ extends IQEntity> {
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    nativeFieldName: string;
    q: IQ;
    qConstructor: new () => IQ;
    getFieldKey(): string;
}
export declare abstract class QField<IQ extends IQEntity> implements IQField<IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    nativeFieldName: string;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, fieldType: FieldType, nativeFieldName?: string);
    getFieldKey(): string;
    setOperation(jsonOperation: JSONBaseOperation): JSONBaseOperation;
    objectEquals<IQF extends IQField<any>>(otherField: IQF, checkValue?: boolean): boolean;
}
