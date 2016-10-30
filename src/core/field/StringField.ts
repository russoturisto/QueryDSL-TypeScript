import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {StringOperation, IStringOperation, JSONRawStringOperation} from "../operation/StringOperation";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField} from "./OperableField";
/**
 * Created by Papa on 8/11/2016.
 */

export interface IQStringField
extends IQOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> {

	like(
		like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	): JSONRawStringOperation;

}

export class QStringField
extends QOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> implements IQStringField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string
	) {
		super(QStringField, q, qConstructor, entityName, fieldName, FieldType.STRING, new StringOperation());
	}

	like(
		like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	): JSONRawStringOperation {
		return this.operation.like(<any>this, like);
	}

}

export class QStringFunction extends QStringField {

	constructor(
		private value?:string | PHRawFieldSQLQuery<any>
	) {
		super(null, null, null, null);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQStringField {
		let functionApplicable = new QStringFunction(this.value);
		functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
		functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseField {
		let value;
		if(typeof this.value === "string") {
			value = this.value;
		} else {
			va
		}

		return {
			__appliedFunctions__: this.__appliedFunctions__,
			type: JSONClauseObjectType.STRING_FIELD_FUNCTION,
			value: this.value
		};
	}
}
