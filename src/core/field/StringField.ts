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

export interface IQStringField
extends IQOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> {

	like(
		like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	): JSONRawStringOperation;

}

const STRING_PROPERTY_ALIASES = new ColumnAliases('sp_');
const STRING_ENTITY_PROPERTY_ALIASES = new ColumnAliases('se_');

export class QStringField
extends QOperableField<string, JSONRawStringOperation, IStringOperation, IQStringField> implements IQStringField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string,
		alias = STRING_ENTITY_PROPERTY_ALIASES.getNextAlias()
	) {
		super(q, qConstructor, entityName, fieldName, FieldType.STRING, new StringOperation(), alias);
	}

	getInstance():QStringField {
		return new QStringField(this.q, this.qConstructor, this.entityName, this.fieldName, STRING_PROPERTY_ALIASES.getNextAlias())
	}

	like(
		like: string | IQStringField | PHRawFieldSQLQuery<IQStringField>
	): JSONRawStringOperation {
		return this.operation.like(<any>this, like);
	}

}

const STRING_PRIMITIVE_ALIASES = new ColumnAliases('sp_');

export class QStringFunction extends QStringField {

	constructor(
		private value?:string | PHRawFieldSQLQuery<any>,
	  alias = STRING_PRIMITIVE_ALIASES.getNextAlias()
	) {
		super(null, null, null, null, alias);
	}

	getInstance():QStringFunction {
		return new QStringFunction(this.value);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQStringField {
		let functionApplicable = this.getInstance();
		functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
		functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseField {
		return this.operableFunctionToJson(JSONClauseObjectType.STRING_FIELD_FUNCTION, this.value);
	}
}
