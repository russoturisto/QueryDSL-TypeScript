/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation } from "../operation/Operation";
import { JSONFieldInOrderBy } from "./FieldInOrderBy";
import { JSONSqlFunctionCall } from "./Functions";
import { Appliable, JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
export declare enum FieldType {
    BOOLEAN = 0,
    DATE = 1,
    NUMBER = 2,
    STRING = 3,
}
export interface Orderable<IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, any>> {
    asc(): JSONFieldInOrderBy;
    desc(): JSONFieldInOrderBy;
}
export interface IQField<IQ extends IQEntity, T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>, IQF extends IQField<IQ, T, JO, IO, any>> extends Orderable<IQ, IQF> {
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    isNotNull(): JO;
    isNull(): JO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
}
export declare abstract class QField<IQ extends IQEntity, T, JO extends JSONRawValueOperation<IQF>, IO extends IValueOperation<T, JO, IQ, IQF>, IQF extends IQField<any, T, JO, IO, any>> implements IQField<IQ, T, JO, IO, IQF>, Appliable<JSONClauseField, IQ, IQF> {
    childConstructor: new (q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, fieldType: FieldType) => IQField<IQ, T, JO, IO, IQF>;
    q: IQ;
    qConstructor: new () => IQ;
    entityName: string;
    fieldName: string;
    fieldType: FieldType;
    operation: IO;
    0: any;
    __appliedFunctions__: JSONSqlFunctionCall[];
    constructor(childConstructor: new (q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, fieldType: FieldType) => IQField<IQ, T, JO, IO, IQF>, q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string, fieldType: FieldType, operation: IO);
    protected getFieldKey(): string;
    setOperation(jsonOperation: JO): JO;
    objectEquals<QF extends QField<any, any, any, any, any>>(otherField: QF, checkValue?: boolean): boolean;
    equals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    isNotNull(): JO;
    isNull(): JO;
    isIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    notEquals(value: T | IQF | PHRawFieldSQLQuery<IQF>): JO;
    notIn(values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]): JO;
    asc(): JSONFieldInOrderBy;
    desc(): JSONFieldInOrderBy;
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQField<IQ, T, JO, IO, IQF>;
    toJSON(): JSONClauseField;
}
