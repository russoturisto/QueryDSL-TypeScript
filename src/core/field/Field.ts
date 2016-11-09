/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {QRelation} from "../entity/Relation";
import {FieldInOrderBy, SortOrder, IFieldInOrderBy} from "./FieldInOrderBy";
import {JSONSqlFunctionCall} from "./Functions";
import {Appliable, JSONClauseField, JSONClauseObjectType, SQLDataType} from "./Appliable";
import {PHRawFieldSQLQuery, PHFieldSQLQuery, PHJsonFieldQSLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {FieldColumnAliases} from "../entity/Aliases";
import {IQFunction} from "./OperableField";

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
		public objectType: JSONClauseObjectType,
	  public dataType:SQLDataType
	) {
	}

	/**
	 protected getFieldKey() {
		let rootEntityPrefix = columnAliases.entityAliases.getExistingAlias(this.q.getRootJoinEntity());
		let key = `${QRelation.getPositionAlias(rootEntityPrefix, this.q.fromClausePosition)}.${this.fieldName}`;

		return key;
	}
	 */

	asc(): IFieldInOrderBy<IQF> {
		return new FieldInOrderBy<IQF>(this, SortOrder.ASCENDING);
	}

	desc(): IFieldInOrderBy<IQF> {
		return new FieldInOrderBy<IQF>(this, SortOrder.DESCENDING);
	}

	abstract getInstance( qEntity?: IQEntity ): QField<IQF>;

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

	toJSON(
		columnAliases: FieldColumnAliases,
		forSelectClause: boolean
	): JSONClauseField {
		let alias;
		if (forSelectClause) {
			alias = columnAliases.getNextAlias(this);
		}
		let rootEntityPrefix = columnAliases.entityAliases.getExistingAlias(this.q.getRootJoinEntity());
		let jsonField: JSONClauseField = {
			__appliedFunctions__: this.appliedFunctionsToJson(this.__appliedFunctions__, columnAliases),
			entityName: this.q.__entityName__,
			fieldAlias: alias,
			propertyName: this.fieldName,
			tableAlias: QRelation.getPositionAlias(rootEntityPrefix, this.q.fromClausePosition),
			objectType: this.objectType,
			dataType: this.dataType
		};
		if (this.__fieldSubQuery__) {
			let subSelectQuery = new PHFieldSQLQuery<IQF>(this.__fieldSubQuery__, columnAliases.entityAliases).toJSON();
			jsonField.fieldSubQuery = subSelectQuery;
		}

		return jsonField;
	}

	private appliedFunctionsToJson(
		appliedFunctions: JSONSqlFunctionCall[],
		columnAliases: FieldColumnAliases
	): JSONSqlFunctionCall[] {
		if (!appliedFunctions) {
			return appliedFunctions;
		}
		return appliedFunctions.map(( appliedFunction ) => {
			return this.functionCallToJson(appliedFunction, columnAliases);
		});
	}

	private functionCallToJson(
		functionCall: JSONSqlFunctionCall,
		columnAliases: FieldColumnAliases
	): JSONSqlFunctionCall {
		let parameters;
		if (functionCall.parameters) {
			parameters = functionCall.parameters.map(( parameter ) => {
				return this.valueToJSON(parameter, columnAliases, false);
			});
		}
		return {
			functionType: functionCall.functionType,
			parameters: parameters
		};
	}

	private valueToJSON(
		functionObject: IQFunction<any>,
		columnAliases: FieldColumnAliases,
		forSelectClause: boolean
	): string | JSONClauseField | PHJsonFieldQSLQuery {
		if (!functionObject) {
			throw `Function object must be provided to valueToJSON function.`;
		}
		let value = functionObject.value;
		switch (typeof value) {
			case "boolean":
			case "number":
			case "string":
				return columnAliases.entityAliases.getParams().getNextAlias(functionObject);
			case "undefined":
				throw `Undefined is not allowed as a query parameter`;
		}
		if (value instanceof Date) {
			return columnAliases.entityAliases.getParams().getNextAlias(functionObject)
		}
		if (value instanceof QField) {
			return value.toJSON(columnAliases, forSelectClause);
		}
		// must be a field sub-query
		let rawFieldQuery: PHRawFieldSQLQuery<any> = value;
		let phFieldQuery = new PHFieldSQLQuery(rawFieldQuery, columnAliases.entityAliases);
		return phFieldQuery.toJSON();
	}

	operableFunctionToJson(
		functionObject: IQFunction<any>,
		columnAliases: FieldColumnAliases,
		forSelectClause: boolean
	): JSONClauseField {
		let alias;
		if (forSelectClause) {
			alias = columnAliases.getNextAlias(this);
		}
		return {
			__appliedFunctions__: this.appliedFunctionsToJson(this.__appliedFunctions__, columnAliases),
			fieldAlias: alias,
			objectType: this.objectType,
			dataType: this.dataType,
			value: this.valueToJSON(functionObject, columnAliases, false)
		};
	}
}