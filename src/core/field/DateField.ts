import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {DateOperation, JSONRawDateOperation, IDateOperation} from "../operation/DateOperation";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField} from "./OperableField";
/**
 * Created by Papa on 8/11/2016.
 */

export interface IQDateField extends IQOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> {

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

export class QDateField extends QOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> implements IQDateField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string
	) {
		super(QDateField, q, qConstructor, entityName, fieldName, FieldType.DATE, new DateOperation());
	}

	greaterThan(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation {
		return this.setOperation(this.operation.greaterThan(value));
	}

	greaterThanOrEquals(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation {
		return this.setOperation(this.operation.greaterThanOrEquals(value));
	}

	lessThan(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation {
		return this.setOperation(this.operation.lessThan(value));
	}

	lessThanOrEquals(
		value: Date | IQDateField | PHRawFieldSQLQuery<IQDateField>
	): JSONRawDateOperation {
		return this.setOperation(this.operation.lessThanOrEquals(value));
	}

}

export class QDateFunction extends QDateField {
	constructor(
		private value?: Date
	) {
		super(null, null, null, null);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQDateField {
		let functionApplicable = new QDateFunction(this.value);
		functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
		functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseField {
		return {
			__appliedFunctions__: this.__appliedFunctions__,
			type: JSONClauseObjectType.DATE_FIELD_FUNCTION,
			value: this.value
		};
	}
}