import {BooleanOperation, JSONRawBooleanOperation, IBooleanOperation} from "../operation/BooleanOperation";
import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {IQOperableField, QOperableField} from "./OperableField";
import {JSONClauseObjectType, JSONClauseField} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {ColumnAliases} from "../entity/Aliases";
/**
 * Created by Papa on 8/10/2016.
 */


export interface IQBooleanField extends IQOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> {
}

const BOOLEAN_PROPERTY_ALIASES = new ColumnAliases('bp_');
export const BOOLEAN_ENTITY_PROPERTY_ALIASES = new ColumnAliases('be_');

export class QBooleanField extends QOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> implements IQBooleanField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string,
	  alias = BOOLEAN_ENTITY_PROPERTY_ALIASES.getNextAlias()
	) {
		super(q, qConstructor, entityName, fieldName, FieldType.BOOLEAN, new BooleanOperation(), alias);
	}

	getInstance():QBooleanField {
		return new QBooleanField(this.q, this.qConstructor, this.entityName, this.fieldName, BOOLEAN_PROPERTY_ALIASES.getNextAlias())
	}

}

const BOOLEAN_FUNCTION_ALIASES = new ColumnAliases('bf_');

export class QBooleanFunction extends QBooleanField {

	constructor(
		private value: boolean | PHRawFieldSQLQuery<QBooleanField>,
	  alias = BOOLEAN_FUNCTION_ALIASES.getNextAlias()
	) {
		super(null, null, null, null, alias);
	}

	getInstance():QBooleanFunction {
		return new QBooleanFunction(this.value);
	}

	toJSON(): JSONClauseField {
		return this.operableFunctionToJson(JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION, this.value);
	}
}
