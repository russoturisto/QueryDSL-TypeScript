import { IQEntity } from "../entity/Entity";
import { JSONRawDateOperation, IDateOperation } from "../operation/DateOperation";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField } from "./OperableField";
import { FieldColumnAliases } from "../entity/Aliases";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQDateField extends IQOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> {
}
export declare class QDateField extends QOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> implements IQDateField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string);
    getInstance(qEntity?: IQEntity): QDateField;
}
export declare class QDateFunction extends QDateField {
    private value;
    constructor(value?: Date | PHRawFieldSQLQuery<QDateField>);
    getInstance(): QDateFunction;
    toJSON(columnAliases?: FieldColumnAliases): JSONClauseField;
}
