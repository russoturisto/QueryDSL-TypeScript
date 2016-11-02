import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {StringOperation, IStringOperation, JSONRawStringOperation} from "../operation/StringOperation";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField} from "./OperableField";
import {ColumnAliases} from "../entity/Aliases";
/**
 * Created by Papa on 8/11/2016.
 */

export interface IQStringField extends IQOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> {

	like(
		like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	): JSONRawStringOperation;

}

export class QStringField extends QOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> implements IQStringField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string
	) {
		super(q, qConstructor, entityName, fieldName, FieldType.STRING, new StringOperation());
	}

	getInstance(): QStringField {
		return this.copyFunctions(new QStringField(this.q, this.qConstructor, this.entityName, this.fieldName));
	}

	like(
		like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	): JSONRawStringOperation {
		return this.operation.like(<any>this, like);
	}

}

export class QStringFunction extends QStringField {

	constructor(
		private value?: string | PHRawFieldSQLQuery<any>
	) {
		super(null, null, null, null);
	}

	getInstance(): QStringFunction {
		return this.copyFunctions(new QStringFunction(this.value));
	}

	toJSON( columnAliases?: ColumnAliases ): JSONClauseField {
		return this.operableFunctionToJson(JSONClauseObjectType.STRING_FIELD_FUNCTION, this.value, columnAliases);
	}
}
