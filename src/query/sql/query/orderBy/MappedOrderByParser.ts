/**
 * Created by Papa on 11/8/2016.
 */

import {INonEntityOrderByParser} from "./IEntityOrderByParser";
import {JSONFieldInOrderBy, SortOrder} from "../../../../core/field/FieldInOrderBy";
import {JSONClauseField} from "../../../../core/field/Appliable";
import {IValidator} from "../../../../validation/Validator";
/**
 * Will hierarchically order the results of the query using breadth-first processing.
 * Within a given sub-select object will take into account the sort order specified in the Order By clause.
 */
export class MappedOrderByParser implements INonEntityOrderByParser {

	constructor(private validator:IValidator) {
	}

	/**
	 * Using the following algorithm
	 * http://stackoverflow.com/questions/2549541/performing-breadth-first-search-recursively
	 * :
	 BinarySearchTree.prototype.breadthFirst = function() {
	  var result = '',
	  queue = [],
	  current = this.root;

	  if (!current) return null;
	  queue.push(current);

	  while (current = queue.shift()) {
			result += current.value + ' ';
			current.left && queue.push(current.left);
			current.right && queue.push(current.right);
		}
	  return result;
	 }
	 *
	 * @param joinTree
	 * @param qEntityMapByAlias
	 * @returns {string}
	 */
	getOrderByFragment(
		rootSelectClauseFragment: any,
		originalOrderBy: JSONFieldInOrderBy[]
	): string {
		let orderByFragments: string[];
		let orderBy: JSONFieldInOrderBy[] = [];
		if (originalOrderBy) {
			orderBy = originalOrderBy.slice();
		}

		let selectFragmentQueue = [];
		let currentSelectFragment = rootSelectClauseFragment;
		selectFragmentQueue.push(currentSelectFragment);

		while (currentSelectFragment = selectFragmentQueue.shift()) {

			let currentSelectFragmentFieldSet: {[alias: string]: boolean} = {};

			for (let propertyName in currentSelectFragment) {
				let field: JSONClauseField = currentSelectFragment[propertyName];
				if (!field.__appliedFunctions__) {
					selectFragmentQueue.push(field);
					continue;
				}
				currentSelectFragmentFieldSet[field.fieldAlias] = true;
			}


			let currentEntityOrderBy: JSONFieldInOrderBy[] = [];

			orderBy = orderBy.filter(( orderByField ) => {
				if (!currentSelectFragmentFieldSet[orderByField.fieldAlias]) {
					return true;
				}
				delete currentSelectFragmentFieldSet[orderByField.fieldAlias];
				currentEntityOrderBy.push(orderByField);
				return false;
			});
			for (let alias in currentSelectFragmentFieldSet) {
				currentEntityOrderBy.push({
					fieldAlias: alias,
					sortOrder: SortOrder.ASCENDING
				});
			}

			let entityOrderByFragments = this.buildOrderByFragmentForEntity(currentEntityOrderBy);
			orderByFragments = orderByFragments.concat(entityOrderByFragments);
		}
		if (orderBy.length) {
			throw `Found entries in Order By for tables not found in select clause.  Entries must be ordered hierarchically, in breadth-first order.`;
		}

		return orderByFragments.join(', ');
	}

	buildOrderByFragmentForEntity(
		orderByFields: JSONFieldInOrderBy[]
	): string[] {
		return orderByFields.map(( orderByField ) => {
			this.validator.validateAliasedFieldAccess(orderByField.fieldAlias);
			switch (orderByField.sortOrder) {
				case SortOrder.ASCENDING:
					return `${orderByField.fieldAlias} ASC`;
				case SortOrder.DESCENDING:
					return `${orderByField.fieldAlias} DESC`;
			}
		});
	}

}