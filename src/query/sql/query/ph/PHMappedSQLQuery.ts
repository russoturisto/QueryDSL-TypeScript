import {PHRawNonEntitySQLQuery, PHNonEntitySQLQuery, SELECT_ERROR_MESSAGE} from "./PHNonEntitySQLQuery";
import {PHSQLQuery, PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery} from "../../PHSQLQuery";
import {JSONJoinRelation} from "../../../../core/entity/Relation";
import {QField} from "../../../../core/field/Field";
import {QOneToManyRelation} from "../../../../core/entity/OneToManyRelation";
import {IQDistinctFunction} from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonMappedQSLQuery extends PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery, JSONJoinRelation {
}

export interface PHRawMappedSQLQuery<IE> extends PHRawNonEntitySQLQuery {
	select: IE | IQDistinctFunction;
}

export class PHMappedSQLQuery<IE> extends PHNonEntitySQLQuery implements PHSQLQuery {

	constructor(
		public phRawQuery: PHRawMappedSQLQuery<IE>
	) {
		super();
	}

	nonDistinctSelectClauseToJSON( rawSelect: any ): any {
		let select = {};

		for (let property in rawSelect) {
			let value = this.phRawQuery.select[property];
			if (value instanceof QField) {
				select[property] = value.toJSON();
			} else if (value instanceof QOneToManyRelation) {
				throw `@OneToMany relations can only be used in Entity Queries`;
			} // Must be a primitive
			else {
				throw SELECT_ERROR_MESSAGE;
			}
		}

		return select;
	}

	toJSON(): PHJsonMappedQSLQuery {

		let select = this.selectClauseToJSON(this.phRawQuery.select);

		let jsonRelation: JSONJoinRelation = <JSONJoinRelation><any>this.phRawQuery;
		let jsonMappedQuery: PHJsonMappedQSLQuery = {
			currentChildIndex: jsonRelation.currentChildIndex,
			fromClausePosition: jsonRelation.fromClausePosition,
			joinType: jsonRelation.joinType,
			relationType: jsonRelation.relationType,
			rootEntityPrefix: jsonRelation.rootEntityPrefix,
			select: select,
		};

		return <PHJsonMappedQSLQuery>this.getNonEntitySqlQuery(this.phRawQuery, jsonMappedQuery);
	}

}
