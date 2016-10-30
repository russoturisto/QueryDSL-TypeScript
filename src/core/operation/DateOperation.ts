import {
	JSONRawValueOperation, IValueOperation,
	ValueOperation, OperationCategory
} from "./Operation";
import {IQDateField} from "../field/DateField";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONRawDateOperation extends JSONRawValueOperation<Date, IQDateField> {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue: IQDateField;
	rValue: Date | Date[] | IQDateField | IQDateField[] | PHRawFieldSQLQuery<IQDateField> | PHRawFieldSQLQuery<IQDateField>[];
}

export interface IDateOperation extends IValueOperation<Date, JSONRawDateOperation, IQDateField> {

}

export class DateOperation
extends ValueOperation<Date, JSONRawDateOperation, IQDateField> implements IDateOperation {

	constructor() {
		super(OperationCategory.DATE);
	}

}