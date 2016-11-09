import {
	JSONRawValueOperation, IValueOperation,
	ValueOperation, OperationCategory
} from "./Operation";
import {IQDateField} from "../field/DateField";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONRawDateOperation extends JSONRawValueOperation<IQDateField> {
	operator: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue: IQDateField;
	rValue: IQDateField | IQDateField[] | PHRawFieldSQLQuery<IQDateField> | PHRawFieldSQLQuery<IQDateField>[];
}

export interface IDateOperation extends IValueOperation<JSONRawDateOperation, IQDateField> {

}

export class DateOperation
extends ValueOperation<JSONRawDateOperation, IQDateField> implements IDateOperation {

	constructor() {
		super(OperationCategory.DATE);
	}

}