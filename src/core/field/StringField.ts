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

export interface IQStringField<IQ extends IQEntity>
extends IQOperableField<IQ, string, JSONRawStringOperation<IQ>, IStringOperation<IQ>, IQStringField<IQ>> {

	like(
		like: string | IQStringField<IQ> | PHRawFieldSQLQuery<IQStringField<IQ>>
	): JSONRawStringOperation<IQ>;

}

export class QStringField<IQ extends IQEntity>
extends QOperableField<IQ, string, JSONRawStringOperation<IQ>, IStringOperation<IQ>, IQStringField<IQ>> implements IQStringField<IQ> {

	constructor(
		q: IQ,
		qConstructor: new() => IQ,
		entityName: string,
		fieldName: string
	) {
		super(QStringField, q, qConstructor, entityName, fieldName, FieldType.STRING, new StringOperation<IQ>());
	}

	like(
		like: string | IQStringField<IQ> | PHRawFieldSQLQuery<IQStringField<IQ>>
	): JSONRawStringOperation<IQ> {
		return this.setOperation(this.operation.like(like));
	}

}

export class QStringFunction extends QStringField<any> {

	constructor(
		private value?:string | PHRawFieldSQLQuery<any>
	) {
		super(null, null, null, null);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQStringField<any> {
		let functionApplicable = new QStringFunction(this.value);
		functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
		functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseField {
		return {
			__appliedFunctions__: this.__appliedFunctions__,
			type: JSONClauseObjectType.STRING_FIELD_FUNCTION,
			value: this.value
		};
	}
}
