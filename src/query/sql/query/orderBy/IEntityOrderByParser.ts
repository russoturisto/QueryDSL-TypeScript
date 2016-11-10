import {QueryResultType} from "../../SQLStringQuery";
import {EntityOrderByParser} from "./EntityOrderByParser";
import {JSONFieldInOrderBy, SortOrder, JSONEntityFieldInOrderBy} from "../../../../core/field/FieldInOrderBy";
import {IQEntity} from "../../../../core/entity/Entity";
import {EntityRelationRecord} from "../../../../core/entity/Relation";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {MetadataUtils} from "../../../../core/entity/metadata/MetadataUtils";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
import {IValidator} from "../../../../validation/Validator";
/**
 * Created by Papa on 10/16/2016.
 */

export interface IEntityOrderByParser {

	getOrderByFragment(
		joinTree: JoinTreeNode,
		qEntityMapByAlias: {[alias: string]: IQEntity}
	): string;

}

export interface INonEntityOrderByParser {

	getOrderByFragment(
		rootSelectClauseFragment: any,
		originalOrderBy: JSONFieldInOrderBy[]
	): string;

}

export abstract class AbstractEntityOrderByParser {

	constructor(
		protected rootSelectClauseFragment: any,
		protected qEntityMapByName: {[alias: string]: IQEntity},
		protected entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		protected entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		protected validator: IValidator,
		protected orderBy?: JSONEntityFieldInOrderBy[]
	) {
	}

	protected getCommonOrderByFragment(
		qEntityMapByAlias: {[alias: string]: IQEntity},
		orderByFields: JSONFieldInOrderBy[]
	): string {
		return orderByFields.map(( orderByField ) => {
			switch (orderByField.sortOrder) {
				case SortOrder.ASCENDING:
					return `${orderByField.fieldAlias} ASC`;
				case SortOrder.DESCENDING:
					return `${orderByField.fieldAlias} DESC`;
			}
		}).join(', ');
	}

}

export function getOrderByParser(
	queryResultType: QueryResultType,
	selectClauseFragment: any,
	qEntityMapByName: {[entityName: string]: IQEntity},
	entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
	entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
	validator: IValidator,
	orderBy?: JSONEntityFieldInOrderBy[]
): IEntityOrderByParser {
	switch (queryResultType) {
		case QueryResultType.ENTITY_BRIDGED:
		case QueryResultType.ENTITY_HIERARCHICAL:
			return new EntityOrderByParser(selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, validator, orderBy);
//		case QueryResultType.FLAT:
//		case QueryResultType.FIELD:
//			return new ExactOrderByParser(rootQEntity, selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy);
		case QueryResultType.RAW:
			throw `Query parsing not supported for raw queries`;
		default:
			throw `Unexpected queryResultType for an Entity ORDER BY parser: ${queryResultType}`;
	}
}
