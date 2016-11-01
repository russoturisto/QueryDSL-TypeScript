import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {NumberOperation, JSONRawNumberOperation, INumberOperation} from "../operation/NumberOperation";
import {JSONSqlFunctionCall} from "./Functions";
import {JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField, QOperableField} from "./OperableField";
import {ColumnAliases} from "../entity/Aliases";
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

export const NUMBER_PROPERTY_ALIASES = new ColumnAliases('np_');
export const NUMBER_ENTITY_PROPERTY_ALIASES = new ColumnAliases('ne_');

export class QNumberField extends QOperableField<number, JSONRawNumberOperation, INumberOperation, IQNumberField> implements IQNumberField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string,
	  alias = NUMBER_ENTITY_PROPERTY_ALIASES.getNextAlias()
	) {
		super(q, qConstructor, entityName, fieldName, FieldType.DATE, new NumberOperation(), alias);
	}

	getInstance():QNumberField {
		return new QNumberField(this.q, this.qConstructor, this.entityName, this.fieldName, NUMBER_PROPERTY_ALIASES.getNextAlias())
	}

}

const NUMBER_FUNCTION_ALIASES = new ColumnAliases('nf_');

export class QNumberFunction extends QNumberField {

	constructor(
		private value?: number| PHRawFieldSQLQuery<IQNumberField>,
	  alias = NUMBER_FUNCTION_ALIASES.getNextAlias()
	) {
		super(null, null, null, null, alias);
	}

	getInstance():QNumberFunction {
		return new QNumberFunction(this.value);
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQNumberField {
		let functionApplicable = this.getInstance();
		functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
		functionApplicable.__appliedFunctions__.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseField {
		return this.operableFunctionToJson(JSONClauseObjectType.NUMBER_FIELD_FUNCTION, this.value);
	}
}