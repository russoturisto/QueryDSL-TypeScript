import {PHRawNonEntitySQLQuery} from "./PHNonEntitySQLQuery";
import {PHSQLQuery} from "../../PHSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHRawMappedSQLQuery<IE> extends PHRawNonEntitySQLQuery {
	select: IE;
}

export class PHMappedSQLQuery<IE> implements PHSQLQuery {

	constructor(
		public phRawQuery: PHRawMappedSQLQuery<IE>,
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
