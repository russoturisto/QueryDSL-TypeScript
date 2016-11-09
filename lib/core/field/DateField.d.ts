import { IQEntity } from "../entity/Entity";
import { JSONRawDateOperation, IDateOperation } from "../operation/DateOperation";
import { JSONClauseField, JSONClauseObjectType } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField, IQFunction } from "./OperableField";
import { FieldColumnAliases } from "../entity/Aliases";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQDateField extends IQOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> {
}
export declare class QDateField extends QOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> implements IQDateField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, objectType?: JSONClauseObjectType);
    getInstance(qEntity?: IQEntity): QDateField;
}
export declare class QDateFunction extends QDateField implements IQFunction<Date | PHRawFieldSQLQuery<any>> {
    value: Date | PHRawFieldSQLQuery<QDateField>;
    private isQueryParameter;
    parameterAlias: string;
    constructor(value: Date | PHRawFieldSQLQuery<QDateField>, isQueryParameter?: boolean);
    getInstance(): QDateFunction;
    toJSON(columnAliases: FieldColumnAliases, forSelectClause: boolean): JSONClauseField;
}
