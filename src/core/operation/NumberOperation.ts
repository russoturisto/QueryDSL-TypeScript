import {
	IValueOperation, ValueOperation,
	OperationCategory, JSONRawValueOperation
} from "./Operation";
import {IQEntity} from "../entity/Entity";
import {IQNumberField} from "../field/NumberField";
import {PHRawFieldSQLQuery} from "../../query/sql/PHSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONRawNumberOperation<IQ extends IQEntity> extends JSONRawValueOperation<IQNumberField<IQ>> {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue: IQNumberField<IQ>;
	rValue: number | number[] | IQNumberField<any> | IQNumberField<any>[] | PHRawFieldSQLQuery<IQNumberField<any>> | PHRawFieldSQLQuery<IQNumberField<any>>[];
}

export interface INumberOperation<IQ extends IQEntity>
extends IValueOperation<number, JSONRawNumberOperation<IQ>, IQ, IQNumberField<any>> {

	greaterThan(
		value: number | IQNumberField<any> | PHRawFieldSQLQuery<IQNumberField<any>>
	): JSONRawNumberOperation<IQ>;

	greaterThanOrEquals(
		value: number | IQNumberField<any> | PHRawFieldSQLQuery<IQNumberField<any>>
	): JSONRawNumberOperation<IQ>;

	lessThan(
		value: number | IQNumberField<any> | PHRawFieldSQLQuery<IQNumberField<any>>
	): JSONRawNumberOperation<IQ>;

	lessThanOrEquals(
		value: number | IQNumberField<any> | PHRawFieldSQLQuery<IQNumberField<any>>
	): JSONRawNumberOperation<IQ>;

}

export class NumberOperation<IQ extends IQEntity>
extends ValueOperation<number, JSONRawNumberOperation<IQ>, IQ, IQNumberField<any>> implements INumberOperation<IQ> {

	constructor() {
		super(OperationCategory.NUMBER);
	}

	greaterThan(
		value: number | IQNumberField<any> | PHRawFieldSQLQuery<IQNumberField<any>>
	): JSONRawNumberOperation<IQ> {
		return <any>{
			operator: "$gt",
			category: this.category,
			rValue: value
		};
	}

	greaterThanOrEquals(
		value: number | IQNumberField<any> | PHRawFieldSQLQuery<IQNumberField<any>>
	): JSONRawNumberOperation<IQ> {
		return <any>{
			operator: "$gte",
			category: this.category,
			rValue: value
		};
	}

	lessThan(
		value: number | IQNumberField<any> | PHRawFieldSQLQuery<IQNumberField<any>>
	): JSONRawNumberOperation<IQ> {
		return <any>{
			operator: "$lt",
			category: this.category,
			rValue: value
		};
	}

	lessThanOrEquals(
		value: number | IQNumberField<any> | PHRawFieldSQLQuery<IQNumberField<any>>
	): JSONRawNumberOperation<IQ> {
		return <any>{
			operator: "$lte",
			category: this.category,
			rValue: value
		};
	}

}