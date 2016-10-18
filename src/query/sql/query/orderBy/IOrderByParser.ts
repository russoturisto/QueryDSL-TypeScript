import {QueryResultType} from "../../SQLStringQuery";
import {ExactOrderByParser} from "./ExactOrderByParser";
import {ForcedOrderByParser} from "./ForcedOrderByParser";
import {JSONFieldInOrderBy, SortOrder} from "../../../../core/field/FieldInOrderBy";
import {IQEntity} from "../../../../core/entity/Entity";
import {RelationRecord} from "../../../../core/entity/Relation";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {MetadataUtils} from "../../../../core/entity/metadata/MetadataUtils";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/16/2016.
 */

export interface IOrderByParser {

	getOrderByFragment(
		joinTree: JoinTreeNode,
		qEntityMapByAlias: {[alias: string]: IQEntity}
	): string;

}

export abstract class AbstractOrderByParser {

	constructor(
		protected rootQEntity: IQEntity,
		protected rootSelectClauseFragment: any,
		protected qEntityMapByName: {[alias: string]: IQEntity},
		protected entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		protected entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		protected orderBy?: JSONFieldInOrderBy[]
	) {
	}

	protected getCommonOrderByFragment(
		qEntityMapByAlias: {[alias: string]: IQEntity},
		orderByFields: JSONFieldInOrderBy[]
	): string {
		return orderByFields.map(( orderByField ) => {
			let qEntity = qEntityMapByAlias[orderByField.alias];
			let propertyName = orderByField.propertyName;
			let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

			let columnName;
			if (orderByField.isManyToOneReference) {
				columnName = MetadataUtils.getJoinColumnName(propertyName, entityMetadata, orderByField.alias);
			} else {
				columnName = MetadataUtils.getPropertyColumnName(propertyName, entityMetadata, orderByField.alias);
			}

			let orderFieldClause = `${orderByField.alias}.${columnName} `;
			switch (orderByField.sortOrder) {
				case SortOrder.ASCENDING:
					return `${orderFieldClause} ASC`;
				case SortOrder.DESCENDING:
					return `${orderFieldClause} DESC`;
			}
		}).join(', ');
	}

}

export function getOrderByParser(
	queryResultType: QueryResultType,
	rootQEntity: IQEntity,
	selectClauseFragment: any,
	qEntityMapByName: {[entityName: string]: IQEntity},
	entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
	entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
	orderBy?: JSONFieldInOrderBy[]
): IOrderByParser {
	switch (queryResultType) {
		case QueryResultType.BRIDGED:
		case QueryResultType.HIERARCHICAL:
			return new ForcedOrderByParser(rootQEntity, selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy);
		case QueryResultType.PLAIN:
		case QueryResultType.FLAT:
		case QueryResultType.FLATTENED:
			return new ExactOrderByParser(rootQEntity, selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy);
		case QueryResultType.RAW:
			throw `Query parsing not supported for raw queries`;
	}
}
