import {PHSQLQuery} from "../../PHSQLQuery";
import {JSONClauseField} from "../../../../core/field/Appliable";
import {
	PHRawNonEntitySQLQuery, PHDistinguishableSQLQuery, NON_ENTITY_SELECT_ERROR_MESSAGE,
	PHJsonNonEntitySqlQuery
} from "./PHNonEntitySQLQuery";
import {IQField, QField} from "../../../../core/field/Field";
import {IQDistinctFunction} from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/23/2016.
 */

export interface PHJsonFlatQSLQuery extends PHJsonNonEntitySqlQuery {
	select: JSONClauseField[];
}

export interface PHRawFlatSQLQuery<IQF extends IQField<IQF>>
extends PHRawNonEntitySQLQuery {
	select: IQF[] | IQDistinctFunction<IQF[]>;
}

export class PHFlatSQLQuery extends PHDistinguishableSQLQuery implements PHSQLQuery {

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
				throw NON_ENTITY_SELECT_ERROR_MESSAGE;
			}
			return selectField.toJSON(this.columnAliases);
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