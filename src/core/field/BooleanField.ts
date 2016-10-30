import {BooleanOperation, JSONRawBooleanOperation, IBooleanOperation} from "../operation/BooleanOperation";
import {IQEntity} from "../entity/Entity";
import {FieldType} from "./Field";
import {IQOperableField, QOperableField} from "./OperableField";
import {JSONClauseObjectType, JSONClauseField} from "./Appliable";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
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
		super(QBooleanField, q, qConstructor, entityName, fieldName, FieldType.BOOLEAN, new BooleanOperation());
	}

}

export class QBooleanFunction extends QBooleanField {

	constructor(
		private value: boolean | PHRawFieldSQLQuery<QBooleanField>
	) {
		super(null, null, null, null);
	}

	toJSON(): JSONClauseField {
		return {
			__appliedFunctions__: [],
			type: JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION,
			value: this.value
		};
	}
}
