import {BooleanOperation, JSONRawBooleanOperation, IBooleanOperation} from "../operation/BooleanOperation";
import {IQEntity} from "../entity/Entity";
import {IQOperableField, QOperableField, IQFunction} from "./OperableField";
import {JSONClauseObjectType, JSONClauseField, SQLDataType} from "./Appliable";
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
		fieldName: string,
		objectType:JSONClauseObjectType = JSONClauseObjectType.FIELD
	) {
		super(q, qConstructor, entityName, fieldName, objectType, SQLDataType.BOOLEAN, new BooleanOperation());
	}

	getInstance( qEntity: IQEntity = this.q ): QBooleanField {
		return this.copyFunctions(new QBooleanField(qEntity, this.qConstructor, this.entityName, this.fieldName));
	}

}

export class QBooleanFunction extends QBooleanField implements IQFunction<boolean | PHRawFieldSQLQuery<any>> {

	parameterAlias: string;

	constructor(
		public value: boolean | PHRawFieldSQLQuery<QBooleanField>,
		private isQueryParameter: boolean = false
	) {
		super(null, null, null, null, JSONClauseObjectType.FIELD_FUNCTION);
	}

	getInstance(): QBooleanFunction {
		return this.copyFunctions(new QBooleanFunction(this.value));
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
