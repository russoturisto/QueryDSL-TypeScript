import { ValueOperation, IValueOperation, JSONRawValueOperation } from "./Operation";
import { IQBooleanField } from "../field/BooleanField";
import { IQEntity } from "../entity/Entity";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONRawBooleanOperation extends JSONRawValueOperation<IQBooleanField> {
    operator: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
    lValue: IQBooleanField;
    rValue: IQBooleanField | IQBooleanField[] | PHRawFieldSQLQuery<IQBooleanField> | PHRawFieldSQLQuery<IQBooleanField>[];
}
export interface IBooleanOperation extends IValueOperation<JSONRawBooleanOperation, IQBooleanField> {
}
export declare class BooleanOperation<IQ extends IQEntity> extends ValueOperation<JSONRawBooleanOperation, IQBooleanField> implements IBooleanOperation {
    constructor();
}
