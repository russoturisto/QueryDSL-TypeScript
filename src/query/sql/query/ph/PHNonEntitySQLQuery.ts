import {PHRawSQLQuery, PHJsonCommonSQLQuery} from "../../PHSQLQuery";
import {PHRawMappedSQLQuery} from "./PHMappedSQLQuery";
import {JSONBaseOperation} from "../../../../core/operation/Operation";
import {IFrom} from "../../../../core/entity/Entity";
import {IQOperableField} from "../../../../core/field/OperableField";
import {QDistinctFunction} from "../../../../core/field/Functions";
import {PHAbstractSQLQuery} from "./PHAbstractSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonCommonNonEntitySQLQuery extends PHJsonCommonSQLQuery {
	from?: JSONRelation[];
	orderBy?: JSONFieldInOrderBy[];
	limit?:number;
	offset?:number;
	select: any;
	where?: JSONBaseOperation;
}

export interface PHJsonGroupedSQLQuery {
	groupBy?: JSONClauseObject[];
	having?: JSONBaseOperation;
}

export interface PHRawNonEntitySQLQuery extends PHRawSQLQuery {
	from: (IFrom | PHRawMappedSQLQuery<any>)[];
	groupBy?: IQOperableField<any, any, any, any, any>[];
	having?: JSONBaseOperation,
	limit?: number;
	offset?: number;
}

export const SELECT_ERROR_MESSAGE = `Unsupported entity in SELECT clause, must be a(n): Entity Field | ManyToOne Relation | primitive wrapped by "bool","date","num","str" | query wrapped by "field"`;

export abstract class PHNonEntitySQLQuery extends PHAbstractSQLQuery {

	selectClauseToJSON( rawSelect:any):any {
		if(rawSelect instanceof QDistinctFunction) {
			let rawInnerSelect = rawSelect.getSelectClause();
			let innerSelect = this.nonDistinctSelectClauseToJSON(rawSelect);
			return rawSelect.toJSON(innerSelect);
		} else {
			return this.nonDistinctSelectClauseToJSON(rawSelect);
		}
	}

	protected abstract nonDistinctSelectClauseToJSON( rawSelect:any):any;

}