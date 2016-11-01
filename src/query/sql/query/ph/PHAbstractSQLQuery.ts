import {PHMappedSQLQuery, PHRawMappedSQLQuery, PHJsonMappedQSLQuery} from "./PHMappedSQLQuery";
import {
	FieldInOrderBy, JSONFieldInOrderBy, IFieldInOrderBy,
	JSONFieldInGroupBy
} from "../../../../core/field/FieldInOrderBy";
import {SUB_SELECT_QUERY} from "../../../../core/entity/Joins";
import {QField} from "../../../../core/field/Field";
import {IQOperableField, QOperableField} from "../../../../core/field/OperableField";
import {JSONClauseField, Appliable} from "../../../../core/field/Appliable";
import {PHFieldSQLQuery, PHRawFieldSQLQuery} from "./PHFieldSQLQuery";
import {
	JSONValueOperation, JSONRawValueOperation, OperationCategory,
	JSONBaseOperation
} from "../../../../core/operation/Operation";
import {JSONLogicalOperation} from "../../../../core/operation/LogicalOperation";
import {IFrom, QEntity} from "../../../../core/entity/Entity";
import {JSONRelation, JSONJoinRelation, JSONRelationType} from "../../../../core/entity/Relation";
import {PHRawNonEntitySQLQuery, PHJsonNonEntitySqlQuery} from "./PHNonEntitySQLQuery";
import {QExistsFunction} from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/27/2016.
 */

export abstract class PHAbstractSQLQuery {

	protected isEntityQuery: boolean = false;

	protected getNonEntitySqlQuery(
		rawQuery: PHRawNonEntitySQLQuery,
		jsonQuery: PHJsonNonEntitySqlQuery
	): PHJsonNonEntitySqlQuery {
		let from = this.fromClauseToJSON(rawQuery.from);

		jsonQuery.from = from;
		jsonQuery.where = this.whereClauseToJSON(rawQuery.where);
		jsonQuery.groupBy = this.groupByClauseToJSON(rawQuery.groupBy);
		jsonQuery.having = this.whereClauseToJSON(rawQuery.having);
		jsonQuery.orderBy = this.orderByClauseToJSON(rawQuery.orderBy);
		jsonQuery.limit = rawQuery.limit;
		jsonQuery.offset = rawQuery.offset;

		return jsonQuery;
	}

	protected fromClauseToJSON(
		fromClause: (IFrom | PHRawMappedSQLQuery<any>)[]
	): (JSONRelation | PHJsonMappedQSLQuery)[] {
		return fromClause.map(( fromEntity ) => {
			if (fromEntity instanceof QEntity) {
				return fromEntity.getRelationJson();
			}
			// Must be a sub-query
			else {
				if (this.isEntityQuery) {
					throw `Entity FROM clauses can only contain QEntities`;
				}
				return this.getSubSelectInFromClause(fromEntity);
			}
		});
	}

	protected whereClauseToJSON( whereClause: JSONBaseOperation ): JSONBaseOperation {
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

	private convertLRValue( rValue ): any {
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
			return {
				fieldAlias: (<QField<any>><any>field).alias
			};
		});
	}

	protected orderByClauseToJSON( orderBy: IFieldInOrderBy<any>[] ): JSONFieldInOrderBy[] {
		if (!orderBy || !orderBy.length) {
			return null;
		}
		return orderBy.map(( field ) => {
			return (<FieldInOrderBy<any>><any>field).toJSON();
		});
	}

	private getSubSelectInFromClause( subSelectEntity: any ): PHJsonMappedQSLQuery {
		let rawQuery: PHRawMappedSQLQuery<any> = subSelectEntity[SUB_SELECT_QUERY];
		if (!rawQuery) {
			throw `Reference to own query is missing in sub-select entity`;
		}

		let joinRelation = <JSONJoinRelation><any>rawQuery;

		let jsonMappedQuery = new PHMappedSQLQuery(rawQuery).toJSON();


		if (joinRelation.joinWhereClause) {
			jsonMappedQuery.relationType = JSONRelationType.SUB_QUERY_JOIN_ON;
			jsonMappedQuery.joinWhereClause = this.whereClauseToJSON(joinRelation.joinWhereClause);
		} else {
			jsonMappedQuery.relationType = JSONRelationType.SUB_QUERY_ROOT;

		}

		return jsonMappedQuery;
	}
}
