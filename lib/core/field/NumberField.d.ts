import { IQEntity } from "../entity/Entity";
import { JSONRawNumberOperation, INumberOperation } from "../operation/NumberOperation";
import { JSONSqlFunctionCall } from "./Functions";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField } from "./OperableField";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQNumberField extends IQOperableField<number, JSONRawNumberOperation, INumberOperation, IQNumberField> {
    greaterThan(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    greaterThanOrEquals(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    lessThan(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    lessThanOrEquals(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
}
export declare class QNumberField<IQ extends IQEntity> extends QOperableField<IQ, number, JSONRawNumberOperation, INumberOperation<IQ>, IQNumberField> implements IQNumberField {
    constructor(q: IQ, qConstructor: new () => IQ, entityName: string, fieldName: string);
    greaterThan(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    greaterThanOrEquals(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    lessThan(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    lessThanOrEquals(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
}
export declare class QNumberFunction extends QNumberField<any> {
    private value;
    constructor(value?: number | PHRawFieldSQLQuery<IQNumberField>);
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQNumberField;
    toJSON(): JSONClauseField;
}
