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
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue: IQDateField;
	rValue: Date | Date[] | IQDateField | IQDateField[] | PHRawFieldSQLQuery<IQDateField> | PHRawFieldSQLQuery<IQDateField>[];
}

export interface IDateOperation extends IValueOperation<Date, JSONRawDateOperation, IQDateField> {

	greaterThan(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation;

	greaterThanOrEquals(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation;

	lessThan(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation;

	lessThanOrEquals(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation;

}

export class DateOperation
extends ValueOperation<Date, JSONRawDateOperation, IQDateField> implements IDateOperation {

	constructor() {
		super(OperationCategory.DATE);
	}

	greaterThan(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation {
		return {
			operation: "$gt",
			category: this.category,
			rValue: value
		};
	}

	greaterThanOrEquals(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation {
		return {
			operation: "$gte",
			category: this.category,
			rValue: value
		};
	}

	lessThan(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation {
		return {
			operation: "$lt",
			category: this.category,
			rValue: value
		};
	}

	lessThanOrEquals(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation {
		return {
			operation: "$lte",
			category: this.category,
			rValue: value
		};
	}

}