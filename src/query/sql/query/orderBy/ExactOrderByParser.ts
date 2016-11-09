import {INonEntityOrderByParser} from "./IEntityOrderByParser";
import {JSONFieldInOrderBy, SortOrder} from "../../../../core/field/FieldInOrderBy";
import {IValidator} from "../../../../validation/Validator";
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Will order the results exactly as specified in the Order By clause
 */
export class ExactOrderByParser implements INonEntityOrderByParser {

	constructor(private validator:IValidator) {
	}

	getOrderByFragment(
		rootSelectClauseFragment: any,
		orderBy: JSONFieldInOrderBy[]
	): string {
		return orderBy.map(
			( orderByField ) => {
				this.validator.validateAliasedFieldAccess(orderByField.fieldAlias);
				switch (orderByField.sortOrder) {
					case SortOrder.ASCENDING:
						return `${orderByField.fieldAlias} ASC`;
					case SortOrder.DESCENDING:
						return `${orderByField.fieldAlias} DESC`;
				}
			}).join(', ');
	}

}