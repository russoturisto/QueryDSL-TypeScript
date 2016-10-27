import {PHMappedSQLQuery, PHRawMappedSQLQuery, PHJsonMappedQSLQuery} from "./PHMappedSQLQuery";
import {FieldInOrderBy, JSONFieldInOrderBy, IFieldInOrderBy} from "../../../../core/field/FieldInOrderBy";
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
import {PHRawNonEntitySQLQuery} from "./PHNonEntitySQLQuery";
import {PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery} from "../../PHSQLQuery";
import {QExistsFunction} from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/27/2016.
 */

export abstract class PHAbstractSQLQuery {

	protected getNonEntitySqlQuery(
		rawQuery: PHRawNonEntitySQLQuery,
		jsonQuery:PHJsonCommonNonEntitySQLQuery & PHJsonGroupedSQLQuery
	): PHJsonCommonNonEntitySQLQuery & PHJsonGroupedSQLQuery {
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

	private fromClauseToJSON(
		fromClause: (IFrom | PHRawMappedSQLQuery<any>)[]
	): (JSONRelation | PHJsonMappedQSLQuery)[] {
		return fromClause.map(( fromEntity ) => {
			if (fromEntity instanceof QEntity) {
				return fromEntity.getRelationJson();
			}
			// Must be a sub-query
			else {
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
			operator: operation.operator
		};
		switch (operation.category) {
			case OperationCategory.LOGICAL:
				let logicalOperation = <JSONLogicalOperation>operation;
				let jsonLogicalOperation = <JSONLogicalOperation>jsonOperation;
				switch (operation.operator) {
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
						throw `Unsupported logical operator '${operation.operator}'`;
				}
				break;
			case OperationCategory.FUNCTION:
				let functionOperation: QExistsFunction = <QExistsFunction><any>operation;
				let query = functionOperation.getQuery();
				let jsonQuery = new PHMappedSQLQuery(query).toJSON();
				jsonOperation = functionOperation.toJSON(jsonQuery);
				break;
			case OperationCategory.BOOLEAN:
			case OperationCategory.DATE:
			case OperationCategory.NUMBER:
			case OperationCategory.STRING:
				let valueOperation: JSONRawValueOperation<any> = <JSONRawValueOperation<any>>operation;
				let jsonValueOperation: JSONValueOperation = <JSONValueOperation>operation;
				jsonValueOperation.lValue = valueOperation.lValue.toJSON();
				let rValue = valueOperation.rValue;
				if (rValue instanceof Array) {
					jsonValueOperation.rValue = rValue.map(( anRValue ) => {
						return this.convertRValue(anRValue);
					})
				} else {
					jsonValueOperation.rValue = this.convertRValue(rValue);
				}
				break;
		}

		return jsonOperation;
	}

	private convertRValue( rValue ): any {
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

	protected groupByClauseToJSON( groupBy: IQOperableField<any, any, any, any, any>[] ): JSONClauseField[] {
		if (!groupBy || !groupBy.length) {
			return null;
		}
		return groupBy.map(( field ) => {
			return (<QField<any, any>><any>field).toJSON();
		});
	}

	protected orderByClauseToJSON( orderBy: IFieldInOrderBy<any, any>[] ): JSONFieldInOrderBy[] {
		if (!orderBy || !orderBy.length) {
			return null;
		}
		return orderBy.map(( field ) => {
			return (<FieldInOrderBy<any, any>><any>field).toJSON();
		});
	}

	private getSubSelectInFromClause( subSelectEntity: any ): PHJsonMappedQSLQuery {
		let rawQuery: PHRawMappedSQLQuery<any> = subSelectEntity[SUB_SELECT_QUERY];
		if (!rawQuery) {
			throw `Reference to own query is missing in sub-select entity`;
		}

		let joinRelation = <JSONJoinRelation><any>rawQuery;

		let jsonMappedQuery = new PHMappedSQLQuery(rawQuery).toJSON();


		jsonMappedQuery.relationType = JSONRelationType.SUB_QUERY;
		jsonMappedQuery.joinWhereClause = this.whereClauseToJSON(joinRelation.joinWhereClause);

		return jsonMappedQuery;
	}
}
