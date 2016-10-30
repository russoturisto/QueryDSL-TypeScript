import {
	PHRawNonEntitySQLQuery, PHDistinguishableSQLQuery, NON_ENTITY_SELECT_ERROR_MESSAGE,
	PHJsonNonEntitySqlQuery
} from "./PHNonEntitySQLQuery";
import {PHSQLQuery} from "../../PHSQLQuery";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
import {QField, IQField} from "../../../../core/field/Field";
import {IQDistinctFunction} from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonFieldQSLQuery extends PHJsonNonEntitySqlQuery {
	select: JSONClauseField;
	type: JSONClauseObjectType;
}

export interface PHRawFieldSQLQuery<IQF extends IQField<IQF>>
extends PHRawNonEntitySQLQuery {
	select: IQF | IQDistinctFunction<IQF>;
}

export class PHFieldSQLQuery<IQF extends IQField<IQF>> extends PHDistinguishableSQLQuery implements PHSQLQuery {

	// private qEntityMap: {[entityName: string]: QEntity<any>},
	//	private entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
//		private entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	constructor(
		private phRawQuery: PHRawFieldSQLQuery<IQF>
	) {
		super();
	}

	nonDistinctSelectClauseToJSON( rawSelect: any ): any {
		if (!(this.phRawQuery.select instanceof QField)) {
			throw NON_ENTITY_SELECT_ERROR_MESSAGE;
		}
		return (<QField<any>><any>this.phRawQuery.select).toJSON();
	}

	toJSON(): PHJsonFieldQSLQuery {

		let select = this.selectClauseToJSON(this.phRawQuery.select);

		let jsonFieldQuery: PHJsonFieldQSLQuery = {
			select: select,
			type: JSONClauseObjectType.FIELD_QUERY
		};

		return <PHJsonFieldQSLQuery>this.getNonEntitySqlQuery(this.phRawQuery, jsonFieldQuery);
	}

}

