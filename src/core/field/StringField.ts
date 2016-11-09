import {IQEntity} from "../entity/Entity";
import {StringOperation, IStringOperation, JSONRawStringOperation} from "../operation/StringOperation";
import {JSONClauseField, JSONClauseObjectType, SQLDataType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField, IQFunction} from "./OperableField";
import {FieldColumnAliases} from "../entity/Aliases";
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
		fieldName: string,
		objectType:JSONClauseObjectType = JSONClauseObjectType.FIELD
	) {
		super(q, qConstructor, entityName, fieldName, objectType, SQLDataType.STRING, new StringOperation());
	}

	getInstance( qEntity: IQEntity = this.q ): QStringField {
		return this.copyFunctions(new QStringField(qEntity, this.qConstructor, this.entityName, this.fieldName));
	}

	like(
		value: string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	): JSONRawStringOperation {
		return this.operation.like(<any>this, this.wrapPrimitive(value));
	}

}

export class QStringFunction extends QStringField implements IQFunction<string | PHRawFieldSQLQuery<any>> {

	parameterAlias: string;

	constructor(
		public value: string | PHRawFieldSQLQuery<any>,
		private isQueryParameter: boolean = false
	) {
		super(null, null, null, null, JSONClauseObjectType.FIELD_FUNCTION);
	}

	getInstance(): QStringFunction {
		return this.copyFunctions(new QStringFunction(this.value));
	}

	toJSON(
		columnAliases: FieldColumnAliases,
		forSelectClause: boolean
	): JSONClauseField {
		let json = this.operableFunctionToJson(this, columnAliases, forSelectClause);

		if (this.isQueryParameter) {
			this.parameterAlias = <string>json.value;
		}

		return json;
	}
}
