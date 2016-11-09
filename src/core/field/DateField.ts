import {IQEntity} from "../entity/Entity";
import {DateOperation, JSONRawDateOperation, IDateOperation} from "../operation/DateOperation";
import {JSONClauseField, JSONClauseObjectType, SQLDataType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField, IQFunction} from "./OperableField";
import {FieldColumnAliases} from "../entity/Aliases";
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
		fieldName: string,
		objectType:JSONClauseObjectType = JSONClauseObjectType.FIELD
	) {
		super(q, qConstructor, entityName, fieldName, objectType, SQLDataType.DATE, new DateOperation());
	}

	getInstance( qEntity: IQEntity = this.q ): QDateField {
		return this.copyFunctions(new QDateField(qEntity, this.qConstructor, this.entityName, this.fieldName));
	}

}

export class QDateFunction extends QDateField implements IQFunction<Date | PHRawFieldSQLQuery<any>> {

	parameterAlias: string;

	constructor(
		public value: Date | PHRawFieldSQLQuery<QDateField>,
		private isQueryParameter: boolean = false
	) {
		super(null, null, null, null, JSONClauseObjectType.FIELD_FUNCTION);
	}

	getInstance(): QDateFunction {
		return this.copyFunctions(new QDateFunction(this.value));
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