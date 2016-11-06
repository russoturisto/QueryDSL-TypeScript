import { JSONRawBooleanOperation, IBooleanOperation } from "../operation/BooleanOperation";
import { IQEntity } from "../entity/Entity";
import { IQOperableField, QOperableField } from "./OperableField";
import { JSONClauseField } from "./Appliable";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { FieldColumnAliases } from "../entity/Aliases";
/**
 * Created by Papa on 8/10/2016.
 */
export interface IQBooleanField extends IQOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> {
}
export declare class QBooleanField extends QOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> implements IQBooleanField {
    constructor(q: IQEntity, qConstructor: new () => IQEntity, entityName: string, fieldName: string);
    getInstance(qEntity?: IQEntity): QBooleanField;
}
export declare class QBooleanFunction extends QBooleanField {
    private value;
    constructor(value: boolean | PHRawFieldSQLQuery<QBooleanField>);
    getInstance(): QBooleanFunction;
    toJSON(columnAliases?: FieldColumnAliases): JSONClauseField;
}
