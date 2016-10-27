import { IQField, QField, FieldType } from "./Field";
import { IQEntity } from "../entity/Entity";
import { JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation } from "../operation/Operation";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 10/25/2016.
 */
export interface IQOperableField<IQ extends IQEntity, T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>, IQF extends IQOperableField<IQ, T, JO, IO, any>> extends IQField<IQ, IQF> {
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    isNotNull(): JO;
    isNull(): JO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
}
export declare abstract class QOperableField<IQ extends IQEntity, T, JO extends JSONRawValueOperation<IQF>, IO extends IValueOperation<T, JO, IQ, IQF>, IQF extends IQOperableField<any, T, JO, IO, any>> extends QField<IQ, IQF> implements IQOperableField<IQ, T, JO, IO, IQF> {
    operation: IO;
    constructor(childConstructor: new (...args: any[]) => IQOperableField<IQ, T, JO, IO, IQF>, q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, fieldType: FieldType, operation: IO);
    getInstance(): any;
    setOperation(jsonOperation: JO): JO;
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    isNotNull(): JO;
    isNull(): JO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
}
