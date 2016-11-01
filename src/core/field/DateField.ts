import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {DateOperation, JSONRawDateOperation, IDateOperation} from "../operation/DateOperation";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField} from "./OperableField";
import {ColumnAliases} from "../entity/Aliases";
/**
 * Created by Papa on 8/11/2016.
 */

export interface IQDateField extends IQOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> {
}

const DATE_PROPERTY_ALIASES = new ColumnAliases('dp_');
const DATE_ENTITY_PROPERTY_ALIASES = new ColumnAliases('de_');

export class QDateField extends QOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> implements IQDateField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string,
	  alias = DATE_ENTITY_PROPERTY_ALIASES.getNextAlias()
	) {
		super(q, qConstructor, entityName, fieldName, FieldType.DATE, new DateOperation(), alias);
	}

	getInstance():QDateField {
		return new QDateField(this.q, this.qConstructor, this.entityName, this.fieldName, DATE_PROPERTY_ALIASES.getNextAlias())
	}

}

const DATE_FUNCTION_ALIASES = new ColumnAliases('df_');

export class QDateFunction extends QDateField {
	constructor(
		private value?: Date | PHRawFieldSQLQuery<QDateField>,
	  alias = DATE_FUNCTION_ALIASES.getNextAlias()
	) {
		super(null, null, null, null, alias);
	}

	getInstance():QDateFunction {
		return new QDateFunction(this.value);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQDateField {
		let functionApplicable = this.getInstance();
		functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
		functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseField {
		return this.operableFunctionToJson(JSONClauseObjectType.DATE_FIELD_FUNCTION, this.value);
	}
}