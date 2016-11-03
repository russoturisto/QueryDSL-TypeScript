import {BooleanOperation, JSONRawBooleanOperation, IBooleanOperation} from "../operation/BooleanOperation";
import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {IQOperableField, QOperableField} from "./OperableField";
import {JSONClauseObjectType, JSONClauseField} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {FieldColumnAliases} from "../entity/Aliases";
/**
 * Created by Papa on 8/10/2016.
 */


export interface IQBooleanField extends IQOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> {
}

export class QBooleanField extends QOperableField<boolean, JSONRawBooleanOperation, IBooleanOperation, IQBooleanField> implements IQBooleanField {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string
	) {
		super(q, qConstructor, entityName, fieldName, FieldType.BOOLEAN, new BooleanOperation());
	}

	getInstance(): QBooleanField {
		return this.copyFunctions(new QBooleanField(this.q, this.qConstructor, this.entityName, this.fieldName));
	}

}

export class QBooleanFunction extends QBooleanField {

	constructor(
		private value: boolean | PHRawFieldSQLQuery<QBooleanField>
	) {
		super(null, null, null, null);
	}

	getInstance(): QBooleanFunction {
		return this.copyFunctions(new QBooleanFunction(this.value));
	}

	toJSON( columnAliases?: FieldColumnAliases ): JSONClauseField {
		return this.operableFunctionToJson(JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION, this.value, columnAliases);
	}
}
