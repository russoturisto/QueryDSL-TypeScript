import {IQEntity} from "../entity/Entity";
import {NumberOperation, JSONRawNumberOperation, INumberOperation} from "../operation/NumberOperation";
import {JSONClauseField, JSONClauseObjectType, SQLDataType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField, IQFunction} from "./OperableField";
import {FieldColumnAliases} from "../entity/Aliases";
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
		fieldName: string,
	  objectType:JSONClauseObjectType = JSONClauseObjectType.FIELD
	) {
		super(q, qConstructor, entityName, fieldName, objectType, SQLDataType.NUMBER, new NumberOperation());
	}

	getInstance( qEntity: IQEntity = this.q ): QNumberField {
		return this.copyFunctions(new QNumberField(qEntity, this.qConstructor, this.entityName, this.fieldName));
	}

}

export class QNumberFunction extends QNumberField implements IQFunction<number | PHRawFieldSQLQuery<any>> {

	parameterAlias: string;

	constructor(
		public value: number| PHRawFieldSQLQuery<IQNumberField>,
		private isQueryParameter: boolean = false
	) {
		super(null, null, null, null, JSONClauseObjectType.FIELD_FUNCTION);
	}

	getInstance(): QNumberFunction {
		return this.copyFunctions(new QNumberFunction(this.value));
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