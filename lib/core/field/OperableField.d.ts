import { IQField, QField, FieldType } from "./Field";
import { JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation } from "../operation/Operation";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQEntity } from "../entity/Entity";
/**
 * Created by Papa on 10/25/2016.
 */
export interface IQOperableField<T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>, IQF extends IQOperableField<T, JO, IO, any>> extends IQField<IQF> {
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    isNotNull(): JO;
    isNull(): JO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
}
export declare abstract class QOperableField<T, JO extends JSONRawValueOperation<IQF>, IO extends IValueOperation<T, JO, IQF>, IQF extends IQOperableField<T, JO, IO, IQF>> extends QField<IQF> implements IQOperableField<T, JO, IO, IQF> {
    operation: IO;
    constructor(childConstructor: new (...args: any[]) => IQOperableField<T, JO, IO, IQF>, q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, fieldType: FieldType, operation: IO);
    getInstance(): any;
    setOperation(jsonOperation: JO): JO;
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    isNotNull(): JO;
    isNull(): JO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
}
