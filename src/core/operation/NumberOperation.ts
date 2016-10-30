import {
	IValueOperation, ValueOperation,
	OperationCategory, JSONRawValueOperation
} from "./Operation";
import {IQEntity} from "../entity/Entity";
import {IQNumberField} from "../field/NumberField";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONRawNumberOperation extends JSONRawValueOperation<IQNumberField> {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue: IQNumberField;
	rValue: number | number[] | IQNumberField | IQNumberField[] | PHRawFieldSQLQuery<IQNumberField> | PHRawFieldSQLQuery<IQNumberField>[];
}

export interface INumberOperation
extends IValueOperation<number, JSONRawNumberOperation, IQNumberField> {

	greaterThan(
		value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>
	): JSONRawNumberOperation;

	greaterThanOrEquals(
		value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>
	): JSONRawNumberOperation;

	lessThan(
		value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>
	): JSONRawNumberOperation;

	lessThanOrEquals(
		value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>
	): JSONRawNumberOperation;

}

export class NumberOperation<IQ extends IQEntity>
extends ValueOperation<number, JSONRawNumberOperation, IQNumberField> implements INumberOperation {

	constructor() {
		super(OperationCategory.NUMBER);
	}

	greaterThan(
		value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>
	): JSONRawNumberOperation {
		return {
			category: this.category,
			operator: "$gt",
			rValue: value
		};
	}

	greaterThanOrEquals(
		value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>
	): JSONRawNumberOperation {
		return <any>{
			operator: "$gte",
			category: this.category,
			rValue: value
		};
	}

	lessThan(
		value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>
	): JSONRawNumberOperation {
		return <any>{
			operator: "$lt",
			category: this.category,
			rValue: value
		};
	}

	lessThanOrEquals(
		value: number | IQNumberField | PHRawFieldSQLQuery<IQNumberField>
	): JSONRawNumberOperation {
		return <any>{
			operator: "$lte",
			category: this.category,
			rValue: value
		};
	}

}