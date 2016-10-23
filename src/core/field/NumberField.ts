import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {NumberOperation, JSONRawNumberOperation, INumberOperation} from "../operation/NumberOperation";
import {PHRawFieldSQLQuery} from "../../query/sql/PHSQLQuery";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
/**
 * Created by Papa on 8/11/2016.
 */


export interface IQNumberField<IQ extends IQEntity> extends IQField<IQ, number, JSONRawNumberOperation<IQ>, INumberOperation<IQ>, IQNumberField<IQ>> {

	greaterThan(
		value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>
	): JSONRawNumberOperation<IQ>;

	greaterThanOrEquals(
		value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>
	): JSONRawNumberOperation<IQ>;

	lessThan(
		value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>
	): JSONRawNumberOperation<IQ>;

	lessThanOrEquals(
		value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>
	): JSONRawNumberOperation<IQ>;

}

export class QNumberField<IQ extends IQEntity> extends QField<IQ, number, JSONRawNumberOperation<IQ>, INumberOperation<IQ>, IQNumberField<IQ>> implements IQNumberField<IQ> {

	constructor(
		q: IQ,
		qConstructor: new() => IQ,
		entityName: string,
		fieldName: string
	) {
		super(QNumberField, q, qConstructor, entityName, fieldName, FieldType.DATE, new NumberOperation<IQ>());
	}

	greaterThan(
		value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>
	): JSONRawNumberOperation<IQ> {
		return this.setOperation(this.operation.greaterThan(value));
	}

	greaterThanOrEquals(
		value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>
	): JSONRawNumberOperation<IQ> {
		return this.setOperation(this.operation.greaterThanOrEquals(value));
	}

	lessThan(
		value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>
	): JSONRawNumberOperation<IQ> {
		return this.setOperation(this.operation.lessThan(value));
	}

	lessThanOrEquals(
		value: number | IQNumberField<IQ> | PHRawFieldSQLQuery<IQNumberField<IQ>>
	): JSONRawNumberOperation<IQ> {
		return this.setOperation(this.operation.lessThanOrEquals(value));
	}

}

export class QNumberFunction extends QNumberField<any> {
	constructor() {
		super(null, null, null, null);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQNumberField<any> {
		let functionApplicable = new QNumberFunction();
		functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
		functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseField {
		return {
			__appliedFunctions__: this.__appliedFunctions__,
			type: JSONClauseObjectType.FIELD_FUNCTION
		};
	}
}