import { IValueOperation, ValueOperation, JSONRawValueOperation } from "./Operation";
import { IQStringField } from "../field/StringField";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONRawStringOperation extends JSONRawValueOperation<IQStringField> {
    operation: "$eq" | "$isNotNull" | "$isNull" | "$in" | "$ne" | "$nin" | "$like";
    lValue: IQStringField;
    rValue: string | string[] | IQStringField | IQStringField[] | PHRawFieldSQLQuery<IQStringField> | PHRawFieldSQLQuery<IQStringField>[];
}
export interface IStringOperation extends IValueOperation<string, JSONRawStringOperation, IQStringField> {
    like(like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>): JSONRawStringOperation;
}
export declare class StringOperation extends ValueOperation<string, JSONRawStringOperation, IQStringField> implements IStringOperation {
    constructor();
    like(like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>): JSONRawStringOperation;
}
