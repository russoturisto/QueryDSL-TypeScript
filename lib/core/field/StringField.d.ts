import { IQEntity } from "../entity/Entity";
import { IStringOperation, JSONRawStringOperation } from "../operation/StringOperation";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField } from "./OperableField";
import { ColumnAliases } from "../entity/Aliases";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQStringField extends IQOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> {
    like(like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>): JSONRawStringOperation;
}
export declare class QStringField extends QOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> implements IQStringField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string);
    getInstance(): QStringField;
    like(like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>): JSONRawStringOperation;
}
export declare class QStringFunction extends QStringField {
    private value;
    constructor(value?: string | PHRawFieldSQLQuery<any>);
    getInstance(): QStringFunction;
    toJSON(columnAliases?: ColumnAliases): JSONClauseField;
}
