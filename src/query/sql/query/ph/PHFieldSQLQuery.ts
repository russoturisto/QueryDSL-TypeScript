import {PHRawNonEntitySQLQuery, PHNonEntitySQLQuery, SELECT_ERROR_MESSAGE} from "./PHNonEntitySQLQuery";
import {PHJsonCommonNonEntitySQLQuery, PHSQLQuery, PHJsonGroupedSQLQuery} from "../../PHSQLQuery";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
import {QField, IQField} from "../../../../core/field/Field";
import {IQDistinctFunction} from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonFieldQSLQuery extends PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery {
	select: JSONClauseField;
	type: JSONClauseObjectType;
}

export interface PHRawFieldSQLQuery<IQF extends IQField<any, IQF>>
extends PHRawNonEntitySQLQuery {
	select: IQF | IQDistinctFunction;
}

export class PHFieldSQLQuery<IQF extends IQField<any, IQF>> extends PHNonEntitySQLQuery implements PHSQLQuery {

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
			throw SELECT_ERROR_MESSAGE;
		}
		return (<QField<any, any>><any>this.phRawQuery.select).toJSON();
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

