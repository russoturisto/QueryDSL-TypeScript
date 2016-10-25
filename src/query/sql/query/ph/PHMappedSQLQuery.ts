import {PHRawNonEntitySQLQuery} from "./PHNonEntitySQLQuery";
import {PHSQLQuery, PHJsonCommonSQLQuery, PHJsonGroupedSQLQuery} from "../../PHSQLQuery";
import {JSONJoinRelation, EntityRelationRecord} from "../../../../core/entity/Relation";
import {QEntity} from "../../../../core/entity/Entity";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonMappedQSLQuery extends PHJsonCommonSQLQuery, PHJsonGroupedSQLQuery, JSONJoinRelation {
}

export interface PHRawMappedSQLQuery<IE> extends PHRawNonEntitySQLQuery {
	select: IE;
}

export class PHMappedSQLQuery<IE> implements PHSQLQuery {

	constructor(
		public phRawQuery: PHRawMappedSQLQuery<IE>,
		public qEntityMap: {[entityName: string]: QEntity<any>},
		public entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		public entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	) {
	}

	toJSON(): PHJsonMappedQSLQuery {
		let jsonObjectSqlQuery: PHJsonObjectSQLQuery<IE> = <PHJsonObjectSQLQuery<IE>>getCommonJsonQuery(this.phRawQuery, false);

		return jsonObjectSqlQuery;
	}

}
