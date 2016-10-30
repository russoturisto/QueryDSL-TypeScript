import { IQEntity } from "../entity/Entity";
import { JSONRawDateOperation, IDateOperation } from "../operation/DateOperation";
import { JSONSqlFunctionCall } from "./Functions";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField } from "./OperableField";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQDateField extends IQOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> {
    greaterThan(value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>): JSONRawDateOperation;
    greaterThanOrEquals(value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>): JSONRawDateOperation;
    lessThan(value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>): JSONRawDateOperation;
    lessThanOrEquals(value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>): JSONRawDateOperation;
}
export declare class QDateField extends QOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> implements IQDateField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string);
    greaterThan(value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>): JSONRawDateOperation;
    greaterThanOrEquals(value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>): JSONRawDateOperation;
    lessThan(value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>): JSONRawDateOperation;
    lessThanOrEquals(value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>): JSONRawDateOperation;
}
export declare class QDateFunction extends QDateField {
    private value;
    constructor(value?: Date);
    applySqlFunction(sqlFunctionCall: JSONSqlFunctionCall): IQDateField;
    toJSON(): JSONClauseField;
}
