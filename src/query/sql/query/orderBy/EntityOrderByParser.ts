import {JSONFieldInOrderBy, SortOrder, JSONEntityFieldInOrderBy} from "../../../../core/field/FieldInOrderBy";
import {IEntityOrderByParser, AbstractEntityOrderByParser} from "./IEntityOrderByParser";
import {IQEntity} from "../../../../core/entity/Entity";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {QRelation} from "../../../../core/entity/Relation";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/16/2016.
 */

/**
 * Will hierarchically order the results of the query using breadth-first processing. Within a given entity will take
 * into account the sort order specified in the Order By clause.
 */
export class EntityOrderByParser extends AbstractEntityOrderByParser implements IEntityOrderByParser {

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
		joinTree: JoinTreeNode,
		qEntityMapByAlias: {[alias: string]: IQEntity}
	): string {
		let orderByFragments: string[];
		let orderBy: JSONEntityFieldInOrderBy[] = [];
		if (this.orderBy) {
			orderBy = this.orderBy.slice();
		}

		let selectFragmentQueue = [];
		let currentSelectFragment = this.rootSelectClauseFragment;
		selectFragmentQueue.push(currentSelectFragment);
		let joinNodeQueue = [];
		let currentJoinNode = joinTree;
		joinNodeQueue.push(currentJoinNode);

		while (
		(currentSelectFragment = selectFragmentQueue.shift())
		&& (currentJoinNode = joinNodeQueue.shift())) {

			let tableAlias = QRelation.getAlias(currentJoinNode.jsonRelation);
			let qEntity = qEntityMapByAlias[tableAlias];
			let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
			let entityName = qEntity.__entityName__;
			let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
			let entityRelationMap = this.entitiesRelationPropertyMap[entityName];

			let currentEntityOrderBy = [];
			let parentNodeFound: boolean;

			orderBy = orderBy.filter(( orderByField ) => {
				if (parentNodeFound) {
					return true;
				}
				if (this.isForParentNode(currentJoinNode, orderByField)) {
					throw `Found out of order entry in Order By [${orderByField.entityName}.${orderByField.propertyName}].  Entries must be ordered hierarchically, in breadth-first order.`;
				}
				if (orderByField.entityName !== entityName) {
					return true;
				}
				this.validator.validateReadProperty(orderByField.entityName, orderByField.propertyName);
				orderByField.fieldAlias = `${tableAlias}.${orderByField.propertyName}`;
				currentEntityOrderBy.push(orderByField);
				return false;
			});

			let propertyNamesToSortBy: string[] = [];
			let manyToOneRelationNamesToSortBy: string[] = [];
			let idColumnToSortBy: string = null;
			for (let propertyName in this.rootSelectClauseFragment) {
				if (entityPropertyTypeMap[propertyName]) {
					propertyNamesToSortBy.push(propertyName);
					// Tentatively add column to the list of columns to sort by
					if (entityMetadata.idProperty === propertyName) {
						idColumnToSortBy = propertyName;
					}
				} else if (entityRelationMap[propertyName]) {
					let subSelectClauseFragment = this.rootSelectClauseFragment[propertyName];
					if (subSelectClauseFragment === null) {
						// Tentatively add many-to-one key column to the list of columns to sort by
						if (entityMetadata.manyToOneMap[propertyName]) {
							manyToOneRelationNamesToSortBy.push(propertyName);
						}
					} else if (subSelectClauseFragment) {
						selectFragmentQueue.push(subSelectClauseFragment);
						let childEntityName = entityRelationMap[propertyName].entityName;
						let childJoinNode = currentJoinNode.getEntityRelationChildNode(childEntityName, propertyName);
						joinNodeQueue.push(childJoinNode);
					}
				}
			}
			let entityOrderByFragments = this.buildOrderByFragmentForEntity(tableAlias, propertyNamesToSortBy, manyToOneRelationNamesToSortBy, idColumnToSortBy, currentEntityOrderBy, qEntityMapByAlias);
			orderByFragments = orderByFragments.concat(entityOrderByFragments);
		}
		if (orderBy.length) {
			throw `Found entries in Order By for tables not found in select clause.  Entries must be ordered hierarchically, in breadth-first order.`;
		}

		return orderByFragments.join(', ');
	}

	buildOrderByFragmentForEntity(
		tableAlias: string,
		propertyNamesToSortBy: string[],
		manyToOneRelationNamesToSortBy: string[],
		idColumnToSortBy: string,
		currentEntityOrderBy: JSONEntityFieldInOrderBy[],
		qEntityMapByAlias: {[alias: string]: IQEntity}
	) {
		let finalOrderByColumnsFragments: JSONFieldInOrderBy[] = [];
		let inputOrderByPropertyNameSet: {[propertyName: string]: boolean } = {};
		currentEntityOrderBy.forEach(( orderByField ) => {
			finalOrderByColumnsFragments.push(orderByField);
			inputOrderByPropertyNameSet[orderByField.propertyName] = true;
		});
		if (idColumnToSortBy) {
			if (!inputOrderByPropertyNameSet[idColumnToSortBy]) {
				finalOrderByColumnsFragments.push({
					fieldAlias: `${tableAlias}.${idColumnToSortBy}`,
					sortOrder: SortOrder.ASCENDING
				});
			}
		} else {
			propertyNamesToSortBy.forEach(( propertyName ) => {
				if (!inputOrderByPropertyNameSet[propertyName]) {
					finalOrderByColumnsFragments.push({
						fieldAlias: `${tableAlias}.${propertyName}`,
						sortOrder: SortOrder.ASCENDING
					});
				}
			});
			manyToOneRelationNamesToSortBy.forEach(( manyToOneRelationName ) => {
				if (!inputOrderByPropertyNameSet[manyToOneRelationName]) {
					finalOrderByColumnsFragments.push({
						fieldAlias: `${tableAlias}.${manyToOneRelationName}`,
						sortOrder: SortOrder.ASCENDING
					});
				}
			});
		}
		return this.getCommonOrderByFragment(qEntityMapByAlias, finalOrderByColumnsFragments);
	}

	isForParentNode(
		joinTreeNode: JoinTreeNode,
		orderByField: JSONEntityFieldInOrderBy
	): boolean {
		do {
			joinTreeNode = joinTreeNode.parentNode;
			if (!joinTreeNode) {
				return false;
			}
			if (orderByField.entityName === joinTreeNode.jsonRelation.entityName) {
				return true;
			}
		} while (joinTreeNode.parentNode);

		return false;
	}

}