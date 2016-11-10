import { IQField, QField } from "./Field";
import { JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation } from "../operation/Operation";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQEntity } from "../entity/Entity";
import { JSONClauseObjectType, SQLDataType } from "./Appliable";
/**
 * Created by Papa on 10/25/2016.
 */
export interface IQFunction<V extends boolean | Date | number | string | PHRawFieldSQLQuery<any>> {
    parameterAlias: string;
    value: V;
}
export interface IQOperableField<T, JO extends JSONBaseOperation, IO extends IOperation, IQF extends IQOperableField<T, JO, IO, any>> extends IQField<IQF> {
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    greaterThan(value: T | IQF | PHRawFieldSQLQuery<IQF>): any;
    greaterThanOrEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): any;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    isNotNull(): JO;
    isNull(): JO;
    lessThan(value: T | IQF | PHRawFieldSQLQuery<IQF>): any;
    lessThanOrEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): any;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
}
export declare abstract class QOperableField<T, JO extends JSONRawValueOperation<IQF>, IO extends IValueOperation<JO, IQF>, IQF extends IQOperableField<T, JO, IO, IQF>> extends QField<IQF> implements IQOperableField<T, JO, IO, IQF> {
    operation: IO;
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, objectType: JSONClauseObjectType, dataType: SQLDataType, operation: IO);
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    greaterThan(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    greaterThanOrEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    isNotNull(): JO;
    isNull(): JO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    lessThan(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    lessThanOrEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    static wrapPrimitive(value: any): any;
}
