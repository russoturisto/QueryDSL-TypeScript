import {IEntity, QEntity, IQEntity} from "../../core/entity/Entity";
import {RelationRecord, JSONRelation} from "../../core/entity/Relation";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {PHQuery, PHRawQuery} from "../PHQuery";
import {JSONFieldInOrderBy} from "../../core/field/FieldInOrderBy";
import {JSONClauseObject} from "../../core/field/Appliable";
import {isAppliable} from "../../core/utils/EntityUtils";
/**
 * Created by Papa on 8/12/2016.
 */

export interface PHRawSQLQuery extends PHRawQuery {
	select: any;
	from?: IQEntity[];
	where?: JSONBaseOperation;
	orderBy?: JSONFieldInOrderBy[]
}

export interface PHJsonCommonSQLQuery {
	rootEntityPrefix: string;
	select: any;
	from?: JSONRelation[];
	where?: JSONBaseOperation;
	orderBy?: JSONFieldInOrderBy[];
}

export interface PHJsonFlatSQLQuery extends PHJsonCommonSQLQuery {
	select: JSONClauseObject[];
	groupBy: JSONClauseObject[];
	having: JSONBaseOperation[];
}

export interface PHJsonObjectSQLQuery<IE extends IEntity> extends PHJsonCommonSQLQuery {
	select: IE;
}

export interface PHSQLQuery extends PHQuery {
	toSQL(): PHJsonCommonSQLQuery;
}

export function getPHSQLQuery<PHSQ extends PHSQLQuery, PHRSQ extends PHRawSQLQuery>(
	phRawQuery: PHRSQ,
	qEntity: QEntity<any>,
	qEntityMap: {[entityName: string]: QEntity<any>},
	entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
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
	let phJoin: JSONRelation[] = [];
	let rootEntityName = null;
	if (phRawQuery.from && phRawQuery.from.length) {
		rootEntityName = phRawQuery.from[0].rootEntityPrefix;
		phJoin = phRawQuery.from.map(( iEntity: IQEntity ) => {
			return iEntity.getRelationJson();
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


