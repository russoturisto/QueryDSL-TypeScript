import {IEntity, QEntity, IQEntity} from "../../core/entity/Entity";
import {RelationRecord, JSONRelation, QManyToOneRelation, IQManyToOneRelation} from "../../core/entity/Relation";
import {JSONLogicalOperation} from "../../core/operation/LogicalOperation";
import {JSONBaseOperation, JSONRawValueOperation} from "../../core/operation/Operation";
import {PHQuery, PHRawQuery} from "../PHQuery";
import {JSONFieldInOrderBy} from "../../core/field/FieldInOrderBy";
import {Orderable, QField, IQField} from "../../core/field/Field";
import {Appliable, JSONClauseObject, JSONClauseField} from "../../core/field/Appliable";
import {FunctionAppliable} from "../../core/field/Functions";
import {isAppliable} from "../../core/utils/EntityUtils";
/**
 * Created by Papa on 8/12/2016.
 */

/*

whereQuery()
fromQuery()<QEntity>
selectQuery<T>():T
 export function query<PHSQ extends PHSQLQuery, PHRSQ extends PHRawSQLQuery>(
 rawSqlQuery:PHRSQ
 ):PHSQ {
 return getPHSQLQuery(raqSqlQuery, ...);
 }
 */
export interface PHRawSQLQuery extends PHRawQuery {
	select: any;
	from?: IQEntity[];
	where?: JSONBaseOperation;
	orderBy?: JSONFieldInOrderBy[]
}

export interface PHRawEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
	select: IE;
}

export interface PHRawNonEntitySQLQuery extends PHRawSQLQuery {
	from: IQEntity[];
	groupBy?: IQField<any, any, any, any, any>[];
	having?: JSONRawValueOperation<any>[],
	limit?: number;
	offset?: number;
}

export interface PHRawFieldSQLQuery<IQF extends IQField<any, any, any, any>> extends PHRawNonEntitySQLQuery {
	select: IQF;
}

export interface PHRawMappedSQLQuery<IE> extends PHRawNonEntitySQLQuery {
	select: IE;
}

export interface PHRawFlatSQLQuery extends PHRawNonEntitySQLQuery {
	select: Appliable<any, any>[];
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


export enum JoinType {
	FULL_JOIN,
	INNER_JOIN,
	LEFT_JOIN,
	RIGHT_JOIN
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

export class PHObjectSQLQuery<IE extends IEntity> implements PHSQLQuery {

	constructor(
		public phRawQuery: PHRawEntitySQLQuery<IE>,
		public qEntity: QEntity<any>,
		public qEntityMap: {[entityName: string]: QEntity<any>},
		public entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		public entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	) {
	}

	toSQL(): PHJsonObjectSQLQuery<IE> {
		let jsonObjectSqlQuery: PHJsonObjectSQLQuery<IE> = <PHJsonObjectSQLQuery<IE>>getCommonJsonQuery(this.phRawQuery, false);

		return jsonObjectSqlQuery;
	}

}


