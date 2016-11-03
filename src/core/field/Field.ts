/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {QRelation} from "../entity/Relation";
import {FieldInOrderBy, SortOrder, IFieldInOrderBy} from "./FieldInOrderBy";
import {JSONSqlFunctionCall} from "./Functions";
import {Appliable, JSONClauseField, JSONClauseObjectType} from "./Appliable";
import {PHRawFieldSQLQuery, PHFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {FieldColumnAliases} from "../entity/Aliases";

export enum FieldType {
	BOOLEAN,
	DATE,
	NUMBER,
	STRING
}

export interface Orderable<IQF extends IQField<IQF>> {

	asc(): IFieldInOrderBy<IQF>;

	desc(): IFieldInOrderBy<IQF>;

}

export interface IQField<IQF extends IQField<IQF>>
extends Orderable<IQF> {

}

export abstract class QField<IQF extends IQField<IQF>>
implements IQField<IQF>, Appliable<JSONClauseField, IQF> {

	__appliedFunctions__: JSONSqlFunctionCall[] = [];
	// Sub-query as defined in SELECT clause via the field() function
	__fieldSubQuery__: PHRawFieldSQLQuery<IQF>;

	constructor(
		public q: IQEntity,
		public qConstructor: new() => IQEntity,
		public entityName: string,
		public fieldName: string,
		public fieldType: FieldType
	) {
	}

	protected getFieldKey() {
		let key = `${QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition)}.${this.fieldName}`;

		return key;
	}


	objectEquals<QF extends QField<any>>(
		otherField: QF,
		checkValue?: boolean
	): boolean {

		if (this.q.constructor !== otherField.q.constructor) {
			return false;
		}
		if (this.constructor !== otherField.constructor) {
			return false;
		}
		if (this.fieldType !== otherField.fieldType) {
			return false;
		}
		if (this.fieldName !== otherField.fieldName) {
			return false;
		}

		return true;
	}

	asc(): IFieldInOrderBy<IQF> {
		return new FieldInOrderBy<IQF>(this, SortOrder.ASCENDING);
	}

	desc(): IFieldInOrderBy<IQF> {
		return new FieldInOrderBy<IQF>(this, SortOrder.DESCENDING);
	}

	abstract getInstance(): QField<IQF>;

	protected copyFunctions<QF extends QField<IQF>>( field: QF ): QF {
		field.__appliedFunctions__ = this.__appliedFunctions__.slice();
		return field;
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): IQF {
		let appliedField = this.getInstance();
		appliedField.__appliedFunctions__.push(sqlFunctionCall);

		return <IQF><any>appliedField;
	}

	addSubQuery(
		subQuery: PHRawFieldSQLQuery<IQF>
	): IQF {
		let appliedField = this.getInstance();
		appliedField.__fieldSubQuery__ = subQuery;

		return <IQF><any>appliedField;
	}

	toJSON( columnAliases?: FieldColumnAliases ): JSONClauseField {
		let alias;
		if (columnAliases) {
			alias = columnAliases.getNextAlias(this);
		}
		let jsonField: JSONClauseField = {
			__appliedFunctions__: this.appliedFunctionsToJson(this.__appliedFunctions__),
			fieldAlias: alias,
			propertyName: this.fieldName,
			tableAlias: QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition),
			type: JSONClauseObjectType.FIELD
		};
		if (this.__fieldSubQuery__) {
			let subSelectQuery = new PHFieldSQLQuery<IQF>(this.__fieldSubQuery__).toJSON();
			jsonField.fieldSubQuery = subSelectQuery;
		}

		return jsonField;
	}

	appliedFunctionsToJson( appliedFunctions: JSONSqlFunctionCall[] ): JSONSqlFunctionCall[] {
		if (!appliedFunctions) {
			return appliedFunctions;
		}
		return appliedFunctions.map(( appliedFunction ) => {
			return this.functionCallToJson(appliedFunction);
		});
	}

	functionCallToJson( functionCall: JSONSqlFunctionCall ): JSONSqlFunctionCall {
		let parameters;
		if (functionCall.parameters) {
			parameters = functionCall.parameters.map(( parameter ) => {
				return this.valueToJSON(parameter);
			});
		}
		return {
			functionType: functionCall.functionType,
			parameters: parameters
		};
	}

	valueToJSON( value ) {
		if (!value) {
			return value;
		}
		switch (typeof value) {
			case "boolean":
			case "number":
			case "string":
			case "undefined":
				return value;
		}
		if (value instanceof QField) {
			return value.toJSON();
		}
		// must be a field sub-query
		let rawFieldQuery: PHRawFieldSQLQuery<any> = value;
		let phFieldQuery = new PHFieldSQLQuery(rawFieldQuery);
		return phFieldQuery.toJSON();
	}

	operableFunctionToJson(
		type: JSONClauseObjectType,
		value: any,
		columnAliases?: FieldColumnAliases
	): JSONClauseField {
		let alias;
		if (columnAliases) {
			alias = columnAliases.getNextAlias(this);
		}
		return {
			__appliedFunctions__: this.appliedFunctionsToJson(this.__appliedFunctions__),
			fieldAlias: alias,
			type: JSONClauseObjectType.NUMBER_FIELD_FUNCTION,
			value: this.valueToJSON(value)
		};
	}
}