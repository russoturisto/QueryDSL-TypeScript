import {PHSQLQuery, PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery} from "../../PHSQLQuery";
import {JSONClauseField} from "../../../../core/field/Appliable";
import {PHRawNonEntitySQLQuery, PHNonEntitySQLQuery, SELECT_ERROR_MESSAGE} from "./PHNonEntitySQLQuery";
import {IQField, QField} from "../../../../core/field/Field";
/**
 * Created by Papa on 10/23/2016.
 */

export interface PHJsonFlatQSLQuery extends PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery {
	select: JSONClauseField[];
}

export interface PHRawFlatSQLQuery<IQF extends IQField<any, IQF>>
extends PHRawNonEntitySQLQuery {
	select: IQF[];
}

export class PHFlatSQLQuery extends PHNonEntitySQLQuery implements PHSQLQuery {

	constructor(
		public phRawQuery: PHRawFlatSQLQuery<any>,
	) {
		super();
	}

	nonDistinctSelectClauseToJSON( rawSelect: any[] ): any {
		if (!(rawSelect instanceof Array)) {
			throw `Flat Queries an array of fields in SELECT clause.`;
		}
		return rawSelect.map(( selectField ) => {
			if (!(selectField instanceof QField)) {
				throw SELECT_ERROR_MESSAGE;
			}
			return selectField.toJSON();
		});
	}

	toJSON(): PHJsonFlatQSLQuery {

		let select = this.selectClauseToJSON(this.phRawQuery.select);

		let jsonFieldQuery: PHJsonFlatQSLQuery = {
			select: select
		};

		return <PHJsonFlatQSLQuery>this.getNonEntitySqlQuery(this.phRawQuery, jsonFieldQuery);
	}

}