import { IValueOperation, ValueOperation, JSONRawValueOperation } from "./Operation";
import { IQEntity } from "../entity/Entity";
import { IQNumberField } from "../field/NumberField";
import { PHRawFieldSQLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONRawNumberOperation extends JSONRawValueOperation<number, IQNumberField> {
    operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
    lValue: IQNumberField;
    rValue: number | number[] | IQNumberField | IQNumberField[] | PHRawFieldSQLQuery<IQNumberField> | PHRawFieldSQLQuery<IQNumberField>[];
}
export interface INumberOperation extends IValueOperation<number, JSONRawNumberOperation, IQNumberField> {
}
export declare class NumberOperation<IQ extends IQEntity> extends ValueOperation<number, JSONRawNumberOperation, IQNumberField> implements INumberOperation {
    constructor();
}
