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

export class QDateField extends QOperableField<Date, JSONRawDateOperation, IDateOperation, IQDateField> implements IQDateField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string
	) {
		super(q, qConstructor, entityName, fieldName, FieldType.DATE, new DateOperation());
	}

	getInstance(): QDateField {
		return this.copyFunctions(new QDateField(this.q, this.qConstructor, this.entityName, this.fieldName));
	}

}

export class QDateFunction extends QDateField {
	constructor(
		private value?: Date | PHRawFieldSQLQuery<QDateField>
	) {
		super(null, null, null, null);
	}

	getInstance(): QDateFunction {
		return this.copyFunctions(new QDateFunction(this.value));
	}

	toJSON( columnAliases?: ColumnAliases ): JSONClauseField {
		return this.operableFunctionToJson(JSONClauseObjectType.DATE_FIELD_FUNCTION, this.value, columnAliases);
	}
}