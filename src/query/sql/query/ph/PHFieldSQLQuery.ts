import {IQField, QField} from "../../../../core/field/Field";
import {PHRawNonEntitySQLQuery} from "./PHNonEntitySQLQuery";
import {EntityRelationRecord, SUB_SELECT_QUERY, JSONJoinRelation} from "../../../../core/entity/Relation";
import {QEntity} from "../../../../core/entity/Entity";
import {PHJsonCommonSQLQuery, PHAbstractSQLQuery} from "../../PHSQLQuery";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
import {PHRawMappedSQLQuery, PHJsonMappedQSLQuery} from "./PHMappedSQLQuery";
import {QOneToManyRelation} from "../../../../core/entity/OneToManyRelation";
import {OperationCategory, JSONBaseOperation} from "../../../../core/operation/Operation";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonFieldQSLQuery extends PHJsonCommonSQLQuery {
	select: JSONClauseField;
	type:JSONClauseObjectType;
}

export interface PHRawFieldSQLQuery<IQF extends IQField<any, any, any, any, IQF>>
extends PHRawNonEntitySQLQuery {
	select: IQF;
}

export class PHFieldSQLQuery<IQF extends IQField<any, any, any, any, IQF>> {

		// private qEntityMap: {[entityName: string]: QEntity<any>},
	//	private entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
//		private entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	constructor(
		private phRawFieldSqlQuery: PHRawFieldSQLQuery<IQF>,
	) {
	}

	toJSON(): PHJsonFieldQSLQuery {
		let select = (<QField<any, any, any, any, any>><any>this.phRawFieldSqlQuery.select).toJSON();

		let from = this.phRawFieldSqlQuery.from.map(( fromEntity ) => {
			if (fromEntity instanceof QEntity) {
				return fromEntity.getRelationJson();
			}
			// Must be a sub-query
			else {
				return getSubSelectInFromClause(fromEntity);
			}
		});

		return {
			from: from,
			type: JSONClauseObjectType.FIELD_QUERY
		};
	}

}

export function getSubSelectInFromClause( subSelectEntity: any ):PHJsonMappedQSLQuery {
	let rawQuery: PHRawMappedSQLQuery<any> = subSelectEntity[SUB_SELECT_QUERY];
	if (!rawQuery) {
		throw `Reference to own query is missing in sub-select entity`;
	}

	let select = {};

	for(let property in rawQuery.select) {
		let value = rawQuery.select[property];
		if(value instanceof QField) {
			select[property] = value.toJSON();
		} else if(value instanceof QOneToManyRelation) {
			throw `@OneToMany relations can only be used in Entity Queries`;
		} // Must be a Field query
		else {
			let rawFieldQuery:PHRawFieldSQLQuery<any> = value;
			let phFieldQuery = new PHFieldSQLQuery(rawFieldQuery);
			select[property] = phFieldQuery.toJSON();
		}
	}

	let from = rawQuery.from.map(( fromEntity ) => {
		if (fromEntity instanceof QEntity) {
			return fromEntity.getRelationJson();
		}
		// Must be a sub-query
		else {
			return getSubSelectInFromClause(fromEntity);
		}
	});

	let jsonRelation:JSONJoinRelation = <JSONJoinRelation><any>rawQuery;

	let jsomMappedQuery:PHJsonMappedQSLQuery = {
		currentChildIndex: jsonRelation.currentChildIndex,
		fromClausePosition: jsonRelation.fromClausePosition,
		from: from,
		joinType: jsonRelation.joinType,
		relationType: jsonRelation.relationType,
		rootEntityPrefix: jsonRelation.rootEntityPrefix,
		select: select,
	};

	if(rawQuery.where) {
		jsomMappedQuery.where = PHAbstractSQLQuery.whereClauseToJSON(rawQuery.where);
	}

	if(rawQuery.orderBy) {
		TODO: work here next
	}

	return jsomMappedQuery;
}