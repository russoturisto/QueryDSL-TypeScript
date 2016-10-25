import {IQEntity} from "../entity/Entity";
import {IQField, QField, FieldType} from "./Field";
import {StringOperation, IStringOperation, JSONRawStringOperation} from "../operation/StringOperation";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 8/11/2016.
 */

export interface IQStringField<IQ extends IQEntity>
extends IQField<IQ, string, JSONRawStringOperation<IQ>, IStringOperation<IQ>, IQStringField<IQ>> {

	like(
		like: string | IQStringField<IQ> | PHRawFieldSQLQuery<IQStringField<IQ>>
	): JSONRawStringOperation<IQ>;

}

export class QStringField<IQ extends IQEntity>
extends QField<IQ, string, JSONRawStringOperation<IQ>, IStringOperation<IQ>, IQStringField<IQ>> implements IQStringField<IQ> {

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
	constructor() {
		super(null, null, null, null);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQStringField<any> {
		let functionApplicable = new QStringFunction();
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
