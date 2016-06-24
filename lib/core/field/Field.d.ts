/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { JSONOperation, IOperation } from "../operation/Operation";
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
export interface IQBooleanField<IQ extends IQEntity> extends IQField<IQ> {
}
export declare class QBooleanField<IQ extends IQEntity> extends QField<IQ> implements IQBooleanField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, nativeFieldName?: string);
}
export interface IQDateField<IQ extends IQEntity> extends IQField<IQ> {
}
export declare class QDateField<IQ extends IQEntity> extends QField<IQ> implements IQDateField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, nativeFieldName?: string);
}
export interface IQNumberField<IQ extends IQEntity> extends IQField<IQ> {
}
export declare class QNumberField<IQ extends IQEntity> extends QField<IQ> implements IQNumberField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, nativeFieldName?: string);
}
export interface IQStringField<IQ extends IQEntity> extends IQField<IQ> {
}
export declare class QStringField<IQ extends IQEntity> extends QField<IQ> implements IQStringField<IQ> {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, nativeFieldName?: string);
}
export interface IQField<IQ extends IQEntity> {
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    nativeFieldName: string;
    q: IQ;
    qConstructor: new () => IQ;
    objectEquals<OP extends IOperation>(otherOp: OP, checkValue?: boolean): boolean;
    getQ(): IQ;
    toJSON(): JSONOperation;
}
export declare abstract class QField<IQ extends IQEntity> implements IQField<IQ> {
    q: IQ;
    qConstructor: new () => IQ;
    entityName: string;
    fieldName: string;
    nativeFieldName: string;
    fieldType: FieldType;
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, nativeFieldName?: string);
    toJSON(): JSONOperation;
    getQ(): IQ;
    objectEquals<IQF extends IQField<any>>(otherField: IQF, checkValue?: boolean): boolean;
}
