import {IEntity, QEntity, IQEntity} from "../../core/entity/Entity";
import {EntityRelationRecord, JSONEntityRelation, JSONRelation} from "../../core/entity/Relation";
import {
	JSONBaseOperation, OperationCategory, JSONRawValueOperation,
	JSONValueOperation
} from "../../core/operation/Operation";
import {PHQuery, PHRawQuery} from "../PHQuery";
import {JSONFieldInOrderBy} from "../../core/field/FieldInOrderBy";
import {JSONClauseObject, Appliable} from "../../core/field/Appliable";
import {isAppliable} from "../../core/utils/EntityUtils";
import {JSONLogicalOperation} from "../../core/operation/LogicalOperation";
import {QField} from "../../core/field/Field";
import {StandAloneFunction} from "../../core/field/Functions";
import {PHRawFieldSQLQuery, PHFieldSQLQuery} from "./query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 8/12/2016.
 */

export interface PHRawSQLQuery extends PHRawQuery {
	from?: any[];
	orderBy?: JSONFieldInOrderBy[]
	select: any;
	where?: JSONBaseOperation;
}

export interface PHJsonCommonSQLQuery {
	from?: JSONRelation[];
	orderBy?: JSONFieldInOrderBy[];
	rootEntityPrefix: string;
	select: any;
	where?: JSONBaseOperation;
}

export interface PHJsonGroupedSQLQuery {
	groupBy?: JSONClauseObject[];
	having?: JSONBaseOperation[];
}

export interface PHJsonFlatSQLQuery extends PHJsonCommonSQLQuery, PHJsonGroupedSQLQuery {
	groupBy: JSONClauseObject[];
	having: JSONBaseOperation[];
	select: JSONClauseObject[];
}

export interface PHJsonObjectSQLQuery<IE extends IEntity> extends PHJsonCommonSQLQuery {
	select: IE;
}

export interface PHSQLQuery extends PHQuery {
	toSQL(): PHJsonCommonSQLQuery;
}

export abstract class PHAbstractSQLQuery {

	static whereClauseToJSON( whereClause: JSONBaseOperation ): JSONBaseOperation {
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
				let functionOperation:Appliable<any, any, any> = <Appliable<any, any, any>><any>operation;
				jsonOperation = functionOperation.toJSON();
				break;
			case OperationCategory.BOOLEAN:
			case OperationCategory.DATE:
			case OperationCategory.NUMBER:
			case OperationCategory.STRING:
				let valueOperation:JSONRawValueOperation<any> = <JSONRawValueOperation<any>>operation;
				let jsonValueOperation:JSONValueOperation = <JSONValueOperation>operation;
				jsonValueOperation.lValue = valueOperation.lValue.toJSON();
				let rValue = valueOperation.rValue;
				if(rValue instanceof Array) {
					jsonValueOperation.rValue = rValue.map((anRValue) => {
						return this.convertRValue(anRValue);
					})
				} else {
					jsonValueOperation.rValue = this.convertRValue(rValue);
				}
				break;
		}

		return jsonOperation;
	}

	private static convertRValue(rValue):any {
		switch(typeof rValue) {
			case "boolean":
			case "number":
			case "string":
				return rValue;
			default:
				if(rValue instanceof Date) {
					return rValue;
				} else if(rValue instanceof QField) {
					return rValue.toJSON();
				} // Must be a Field Query
				else {
					let rawFieldQuery:PHRawFieldSQLQuery<any> = rValue;
					let phFieldQuery = new PHFieldSQLQuery(rawFieldQuery);
					return phFieldQuery.toJSON();
				}
		}
	}
}

export function getPHSQLQuery<PHSQ extends PHSQLQuery, PHRSQ extends PHRawSQLQuery>(
	phRawQuery: PHRSQ,
	qEntity: QEntity<any>,
	qEntityMap: {[entityName: string]: QEntity<any>},
	entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
	entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
): PHSQ {
	let selectClause = phRawQuery.select;
	if (isAppliable(selectClause) || selectClause instanceof Array) {
		return <any>new PHFlatSQLQuery(<PHRawNonEntitySQLQuery><any>phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
	} else {
		return <any>new PHObjectSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
	}
}

export const QUERY_MARKER_FIELD = '.isQuery';

function getCommonJsonQuery(
	phRawQuery: PHRawSQLQuery,
	isFlatQuery: boolean
): PHJsonCommonSQLQuery {
	let phJoin: JSONEntityRelation[] = [];
	let rootEntityName = null;
	if (phRawQuery.from && phRawQuery.from.length) {
		rootEntityName = phRawQuery.from[0].rootEntityPrefix;
		phJoin = phRawQuery.from.map(( iEntity: IQEntity ) => {
			return iEntity.getEntityRelationJson();
		});
	}
	let selectClause = this.convertSelects(this.phRawQuery.select, isFlatQuery);

	let commonJsonQuery = {
		rootEntityPrefix: rootEntityName,
		select: selectClause,
		from: phJoin,
		where: this.phRawQuery.where,
		orderBy: this.phRawQuery.orderBy
	};
	commonJsonQuery[QUERY_MARKER_FIELD] = true;

	return commonJsonQuery;
}

function convertSelects(
	selectClause: any,
	isFlatQuery: boolean
) {
	if (!(selectClause instanceof Object)) {
		return selectClause;
	}
	for (let property in selectClause) {
		let value = selectClause[property];
		if (value instanceof PHObjectSQLQuery) {
			if (isFlatQuery) {
				throw `Object sub-select statements not allowed in Flat SQL select statements`;
			}
			selectClause[property] = value.toSQL();
		} else if (isAppliable(value)) {
			// Flat sub-queries are allowed in as sub-selectes in Object queries for a given field
			selectClause[property] = selectClause.toJSON();
		} else if (value instanceof Array) {
			throw `Arrays are not allowed in select statements`;
		} else if (value instanceof Object && !(value instanceof Date)) {
			selectClause[property] = convertSelects(value, isFlatQuery);
		}
	}
	return selectClause;

}


