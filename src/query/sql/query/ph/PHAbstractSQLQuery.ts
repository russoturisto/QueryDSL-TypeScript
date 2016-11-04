import {PHMappedSQLQuery, PHRawMappedSQLQuery, PHJsonMappedQSLQuery} from "./PHMappedSQLQuery";
import {
	FieldInOrderBy, JSONFieldInOrderBy, IFieldInOrderBy,
	JSONFieldInGroupBy
} from "../../../../core/field/FieldInOrderBy";
import {IQOperableField, QOperableField} from "../../../../core/field/OperableField";
import {PHFieldSQLQuery, PHRawFieldSQLQuery} from "./PHFieldSQLQuery";
import {
	JSONValueOperation, JSONRawValueOperation, OperationCategory,
	JSONBaseOperation
} from "../../../../core/operation/Operation";
import {JSONLogicalOperation} from "../../../../core/operation/LogicalOperation";
import {IFrom, QEntity, QView} from "../../../../core/entity/Entity";
import {JSONRelation} from "../../../../core/entity/Relation";
import {PHRawNonEntitySQLQuery, PHJsonNonEntitySqlQuery} from "./PHNonEntitySQLQuery";
import {QExistsFunction} from "../../../../core/field/Functions";
import {FieldColumnAliases} from "../../../../core/entity/Aliases";
/**
 * Created by Papa on 10/27/2016.
 */

export abstract class PHAbstractSQLQuery {

	protected isEntityQuery: boolean = false;

	protected columnAliases: FieldColumnAliases = new FieldColumnAliases();

	protected getNonEntitySqlQuery(
		rawQuery: PHRawNonEntitySQLQuery,
		jsonQuery: PHJsonNonEntitySqlQuery
	): PHJsonNonEntitySqlQuery {
		let from = this.fromClauseToJSON(rawQuery.from);

		jsonQuery.from = from;
		jsonQuery.where = PHAbstractSQLQuery.whereClauseToJSON(rawQuery.where);
		jsonQuery.groupBy = this.groupByClauseToJSON(rawQuery.groupBy);
		jsonQuery.having = PHAbstractSQLQuery.whereClauseToJSON(rawQuery.having);
		jsonQuery.orderBy = this.orderByClauseToJSON(rawQuery.orderBy);
		jsonQuery.limit = rawQuery.limit;
		jsonQuery.offset = rawQuery.offset;

		return jsonQuery;
	}

	protected fromClauseToJSON(
		fromClause: (IFrom | PHRawMappedSQLQuery<any>)[]
	): (JSONRelation | PHJsonMappedQSLQuery)[] {
		return fromClause.map(( fromEntity ) => {
			if (!(fromEntity instanceof QEntity)) {
				throw `FROM clause can contain only Views or Entities.`;
			}
			if (this.isEntityQuery) {
				if (fromEntity instanceof QView) {

					throw `Entity FROM clauses can contain only Entities.`;
				}
			}
			return fromEntity.getRelationJson();
		});
	}

	static whereClauseToJSON( whereClause: JSONBaseOperation ): JSONBaseOperation {
		if (!whereClause) {
			return null;
		}
		let operation: JSONBaseOperation = whereClause;
		let jsonOperation: JSONBaseOperation = {
			category: operation.category,
			operation: operation.operation
		};
		switch (operation.category) {
			case OperationCategory.LOGICAL:
				let logicalOperation = <JSONLogicalOperation>operation;
				let jsonLogicalOperation = <JSONLogicalOperation>jsonOperation;
				switch (operation.operation) {
					case '$not':
						jsonLogicalOperation.value = this.whereClauseToJSON(<JSONBaseOperation>logicalOperation.value);
						break;
					case '$and':
					case '$or':
						jsonLogicalOperation.value = (<JSONBaseOperation[]>logicalOperation.value).map(( value ) =>
							this.whereClauseToJSON(value)
						);
						break;
					default:
						throw `Unsupported logical operation '${operation.operation}'`;
				}
				break;
			case OperationCategory.FUNCTION:
				let functionOperation: QExistsFunction<any> = <QExistsFunction<any>>operation;
				let query = functionOperation.getQuery();
				let jsonQuery = new PHMappedSQLQuery(query).toJSON();
				jsonOperation = functionOperation.toJSON(jsonQuery);
				break;
			case OperationCategory.BOOLEAN:
			case OperationCategory.DATE:
			case OperationCategory.NUMBER:
			case OperationCategory.STRING:
				let valueOperation: JSONRawValueOperation<any, any> = <JSONRawValueOperation<any, any>>operation;
				// All Non logical or exists operations are value operations (eq, isNull, like, etc.)
				let jsonValueOperation: JSONValueOperation = <JSONValueOperation>jsonOperation;
				jsonValueOperation.lValue = this.convertLRValue(valueOperation.lValue);
				let rValue = valueOperation.rValue;
				if (rValue instanceof Array) {
					jsonValueOperation.rValue = rValue.map(( anRValue ) => {
						return this.convertLRValue(anRValue);
					})
				} else {
					jsonValueOperation.rValue = this.convertLRValue(rValue);
				}
				break;
		}

		return jsonOperation;
	}

	private static convertLRValue( rValue ): any {
		switch (typeof rValue) {
			case "boolean":
			case "number":
			case "string":
				return rValue;
			default:
				if (rValue instanceof Date) {
					return rValue;
				} else if (rValue instanceof QOperableField) {
					return rValue.toJSON();
				} // Must be a Field Query
				else {
					let rawFieldQuery: PHRawFieldSQLQuery<any> = rValue;
					let phFieldQuery = new PHFieldSQLQuery(rawFieldQuery);
					return phFieldQuery.toJSON();
				}
		}
	}

	protected groupByClauseToJSON( groupBy: IQOperableField<any, any, any, any>[] ): JSONFieldInGroupBy[] {
		if (!groupBy || !groupBy.length) {
			return null;
		}
		return groupBy.map(( field ) => {
			if (!this.columnAliases.hasField(field)) {
				throw `Field used in group by clause is not present in select clause`;
			}
			return {
				fieldAlias: this.columnAliases.getExistingAlias(field)
			};
		});
	}

	protected orderByClauseToJSON( orderBy: IFieldInOrderBy<any>[] ): JSONFieldInOrderBy[] {
		if (!orderBy || !orderBy.length) {
			return null;
		}
		return orderBy.map(( field ) => {
			return (<FieldInOrderBy<any>><any>field).toJSON(this.columnAliases);
		});
	}

}
