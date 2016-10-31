import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {NumberOperation, JSONRawNumberOperation, INumberOperation} from "../operation/NumberOperation";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField} from "./OperableField";
/**
 * Created by Papa on 8/11/2016.
 */


export interface IQNumberField extends IQOperableField<number, JSONRawNumberOperation, INumberOperation, IQNumberField> {

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

export class QNumberField extends QOperableField<number, JSONRawNumberOperation, INumberOperation, IQNumberField> implements IQNumberField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string
	) {
		super(QNumberField, q, qConstructor, entityName, fieldName, FieldType.DATE, new NumberOperation());
	}

}

export class QNumberFunction extends QNumberField {

	constructor(
		private value?: number| PHRawFieldSQLQuery<IQNumberField>
	) {
		super(null, null, null, null);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQNumberField {
		let functionApplicable = new QNumberFunction(this.value);
		functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
		functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseField {
		return this.operableFunctionToJson(JSONClauseObjectType.NUMBER_FIELD_FUNCTION, this.value);
	}
}