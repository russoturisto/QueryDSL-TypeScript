import {
	JSONRawValueOperation, IValueOperation,
	ValueOperation, OperationCategory
} from "./Operation";
import {IQEntity} from "../entity/Entity";
import {IQDateField} from "../field/DateField";
import {PHRawFieldSQLQuery} from "../../query/sql/PHSQLQuery";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONRawDateOperation<IQ extends IQEntity> extends JSONRawValueOperation<IQDateField<IQ>> {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue: IQDateField<IQ>;
	rValue: Date | Date[] | IQDateField<any> | IQDateField<any>[] | PHRawFieldSQLQuery<IQDateField<any>> | PHRawFieldSQLQuery<IQDateField<any>>[];
}

export interface IDateOperation<IQ extends IQEntity> extends IValueOperation<Date, JSONRawDateOperation<IQ>, IQ, IQDateField<any>> {

	greaterThan(
		value: Date | IQDateField<any> | PHRawFieldSQLQuery<IQDateField<any>>
	): JSONRawDateOperation<IQ>;

	greaterThanOrEquals(
		value: Date | IQDateField<any> | PHRawFieldSQLQuery<IQDateField<any>>
	): JSONRawDateOperation<IQ>;

	lessThan(
		value: Date | IQDateField<any> | PHRawFieldSQLQuery<IQDateField<any>>
	): JSONRawDateOperation<IQ>;

	lessThanOrEquals(
		value: Date | IQDateField<any> | PHRawFieldSQLQuery<IQDateField<any>>
	): JSONRawDateOperation<IQ>;

}

export class DateOperation<IQ extends IQEntity>
extends ValueOperation<Date, JSONRawDateOperation<IQ>, IQ, IQDateField<any>> implements IDateOperation<IQ> {

	constructor() {
		super(OperationCategory.DATE);
	}

	greaterThan(
		value: Date | IQDateField<any> | PHRawFieldSQLQuery<IQDateField<any>>
	): JSONRawDateOperation<IQ> {
		return <any>{
			operator: "$gt",
			category: this.category,
			rValue: value
		};
	}

	greaterThanOrEquals(
		value: Date | IQDateField<any> | PHRawFieldSQLQuery<IQDateField<any>>
	): JSONRawDateOperation<IQ> {
		return <any>{
			operator: "$gte",
			category: this.category,
			rValue: value
		};
	}

	lessThan(
		value: Date | IQDateField<any> | PHRawFieldSQLQuery<IQDateField<any>>
	): JSONRawDateOperation<IQ> {
		return <any>{
			operator: "$lt",
			category: this.category,
			rValue: value
		};
	}

	lessThanOrEquals(
		value: Date | IQDateField<any> | PHRawFieldSQLQuery<IQDateField<any>>
	): JSONRawDateOperation<IQ> {
		return <any>{
			operator: "$lte",
			category: this.category,
			rValue: value
		};
	}

}