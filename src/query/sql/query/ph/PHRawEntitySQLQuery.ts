import {IEntity} from "../../../../core/entity/Entity";
import {PHRawSQLQuery} from "../../PHSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHRawEntitySQLQuery<IE extends IEntity> extends PHRawSQLQuery {
	select: IE;
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