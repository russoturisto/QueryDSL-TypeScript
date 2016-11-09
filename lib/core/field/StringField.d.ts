import { IQEntity } from "../entity/Entity";
import { IStringOperation, JSONRawStringOperation } from "../operation/StringOperation";
import { JSONClauseField, JSONClauseObjectType } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQOperableField, QOperableField, IQFunction } from "./OperableField";
import { FieldColumnAliases } from "../entity/Aliases";
/**
 * Created by Papa on 8/11/2016.
 */
export interface IQStringField extends IQOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> {
    like(like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>): JSONRawStringOperation;
}
export declare class QStringField extends QOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> implements IQStringField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string, objectType?: JSONClauseObjectType);
    getInstance(qEntity?: IQEntity): QStringField;
    like(value: string | IQStringField | PHRawFieldSQLQuery<IQStringField>): JSONRawStringOperation;
}
export declare class QStringFunction extends QStringField implements IQFunction<string | PHRawFieldSQLQuery<any>> {
    value: string | PHRawFieldSQLQuery<any>;
    private isQueryParameter;
    parameterAlias: string;
    constructor(value: string | PHRawFieldSQLQuery<any>, isQueryParameter?: boolean);
    getInstance(): QStringFunction;
    toJSON(columnAliases: FieldColumnAliases, forSelectClause: boolean): JSONClauseField;
}
