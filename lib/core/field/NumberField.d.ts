import { IQEntity } from "../entity/Entity";
import { JSONRawNumberOperation, INumberOperation } from "../operation/NumberOperation";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField } from "./OperableField";
import { FieldColumnAliases } from "../entity/Aliases";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQNumberField extends IQOperableField<number, JSONRawNumberOperation, INumberOperation, IQNumberField> {
    greaterThan(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    greaterThanOrEquals(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    lessThan(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
    lessThanOrEquals(value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>): JSONRawNumberOperation;
}
export declare class QNumberField extends QOperableField<number, JSONRawNumberOperation, INumberOperation, IQNumberField> implements IQNumberField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string);
    getInstance(qEntity?: IQEntity): QNumberField;
}
export declare class QNumberFunction extends QNumberField {
    private value;
    constructor(value?: number | PHRawFieldSQLQuery<IQNumberField>);
    getInstance(): QNumberFunction;
    toJSON(columnAliases?: FieldColumnAliases): JSONClauseField;
}
