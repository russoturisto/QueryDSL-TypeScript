import {
	PHRawNonEntitySQLQuery, PHDistinguishableSQLQuery, NON_ENTITY_SELECT_ERROR_MESSAGE,
	PHJsonNonEntitySqlQuery
} from "./PHNonEntitySQLQuery";
import {PHSQLQuery} from "../../PHSQLQuery";
import {JSONJoinRelation} from "../../../../core/entity/Relation";
import {QField} from "../../../../core/field/Field";
import {QOneToManyRelation} from "../../../../core/entity/OneToManyRelation";
import {IQDistinctFunction} from "../../../../core/field/Functions";
import {EntityAliases} from "../../../../core/entity/Aliases";
/**
 * Created by Papa on 10/24/2016.
 */

export interface PHJsonMappedQSLQuery extends PHJsonNonEntitySqlQuery {
}

/**
 * Marker interface for entities in the select clause of a PHRawMappedSQLQuery,
 * as returned by a view or join functions.
 */
export interface IMappedEntity {

}

export interface PHRawMappedSQLQuery<IME extends IMappedEntity> extends PHRawNonEntitySQLQuery {
	select: IME | IQDistinctFunction<IME>;
}

export const FIELD_IN_SELECT_CLAUSE_ERROR_MESSAGE = `Entity SELECT clauses can only contain fields assigned: null | undefined | boolean | Date | number | string | Relation SELECT`;

/**
 * A query whose select object is a collection of properties.
 */
export abstract class PHMappableSQLQuery
extends PHDistinguishableSQLQuery {

	protected nonDistinctSelectClauseToJSON( rawSelect: any ): any {
		let select = {};

		for (let property in rawSelect) {
			let value = rawSelect[property];
			if (value instanceof QField) {
				if (this.isEntityQuery) {
					throw FIELD_IN_SELECT_CLAUSE_ERROR_MESSAGE;
				}
				// The same value may appear in the select clause more than once.
				// In that case the last one will set the alias for all of them.
				// Because the alias only matters for GROUP BY and ORDER BY
				// that is OK.
				select[property] = value.toJSON(this.columnAliases, true);
			} else if (value instanceof QOneToManyRelation) {
				throw `@OneToMany relation objects can cannot be used in SELECT clauses`;
			} // Must be a primitive
			else {
				if (!this.isEntityQuery) {
					throw NON_ENTITY_SELECT_ERROR_MESSAGE;
				}
				// Must be an entity query here
				switch(typeof value) {
					case "boolean":
					case "number":
					case "string":
					case "undefined":
						continue;
					case "object":
						if(value instanceof Date) {
							continue;
						} else if (value === null) {
							continue;
						} else {
							this.nonDistinctSelectClauseToJSON(value);
						}
				}
			}
		}

		return select;
	}
}

export class PHMappedSQLQuery<IME extends IMappedEntity>
extends PHMappableSQLQuery implements PHSQLQuery {

	constructor(
		public phRawQuery: PHRawMappedSQLQuery<IME>,
	  entityAliases:EntityAliases
	) {
		super(entityAliases);
	}

	toJSON(): PHJsonMappedQSLQuery {
		let select = this.selectClauseToJSON(this.phRawQuery.select);
		let jsonMappedQuery: PHJsonMappedQSLQuery = {
			select: select
		};

		return <PHJsonMappedQSLQuery>this.getNonEntitySqlQuery(this.phRawQuery, jsonMappedQuery);
	}

}
