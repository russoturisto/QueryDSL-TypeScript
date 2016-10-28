import {PHRawSQLQuery, PHJsonCommonSQLQuery, PHJsonLimitedSQLQuery} from "../../PHSQLQuery";
import {IMappedEntity} from "./PHMappedSQLQuery";
import {JSONBaseOperation} from "../../../../core/operation/Operation";
import {IFrom} from "../../../../core/entity/Entity";
import {IQOperableField} from "../../../../core/field/OperableField";
import {QDistinctFunction} from "../../../../core/field/Functions";
import {PHAbstractSQLQuery} from "./PHAbstractSQLQuery";
import {JSONClauseObject} from "../../../../core/field/Appliable";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonGroupedSQLQuery {
	groupBy?: JSONClauseObject[];
	having?: JSONBaseOperation;
}

export interface PHJsonNonEntitySqlQuery extends PHJsonCommonSQLQuery, PHJsonGroupedSQLQuery, PHJsonLimitedSQLQuery {

}

export interface PHRawNonEntitySQLQuery extends PHRawSQLQuery {
	from: (IFrom | IMappedEntity)[];
	groupBy?: IQOperableField<any, any, any, any, any>[];
	having?: JSONBaseOperation,
	limit?: number;
	offset?: number;
}

export const NON_ENTITY_SELECT_ERROR_MESSAGE = `Unsupported entry in Non-Entity SELECT clause, must be a(n): Entity Field | ManyToOne Relation | primitive wrapped by "bool","date","num","str" | query wrapped by "field"`;

export abstract class PHDistinguishableSQLQuery extends PHAbstractSQLQuery {

	protected isHierarchicalEntityQuery:boolean = false;

	selectClauseToJSON( rawSelect:any):any {
		if(rawSelect instanceof QDistinctFunction) {
			if(this.isHierarchicalEntityQuery) {
				throw `Distinct cannot be used in SELECT of Hierarchical/Bridged Entity queries.`;
			}
			let rawInnerSelect = rawSelect.getSelectClause();
			let innerSelect = this.nonDistinctSelectClauseToJSON(rawSelect);
			return rawSelect.toJSON(innerSelect);
		} else {
			return this.nonDistinctSelectClauseToJSON(rawSelect);
		}
	}

	protected abstract nonDistinctSelectClauseToJSON( rawSelect:any):any;

}