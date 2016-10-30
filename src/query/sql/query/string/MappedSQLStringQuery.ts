/**
 * Created by Papa on 10/28/2016.
 */

import {PHJsonMappedQSLQuery} from "../ph/PHMappedSQLQuery";
import {SQLDialect, QueryResultType, EntityDefaults} from "../../SQLStringQuery";
import {IQEntity} from "../../../../core/entity/Entity";
import {EntityRelationRecord, QRelation} from "../../../../core/entity/Relation";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
import {NonEntitySQLStringQuery} from "./NonEntitySQLStringQuery";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
/**
 *
 */
export class MappedSQLStringQuery extends NonEntitySQLStringQuery<PHJsonMappedQSLQuery> {

	constructor(
		phJsonQuery: PHJsonMappedQSLQuery,
		qEntityMapByName: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect,
		queryResultType: QueryResultType
	) {
		super(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType);
	}

	protected getSELECTFragment(
		entityName: string,
		selectSqlFragment: string,
		selectClauseFragment: any,
		joinTree: JoinTreeNode,
		entityDefaults: EntityDefaults,
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		if (entityName) {
			throw `Entity references cannot be used in SELECT clause of mapped queries`;
		}
		if (entityDefaults) {
			throw `Entity defaults cannot be used in SELECT clause of mapped queries`;
		}

		{
			let distinctClause = <JSONClauseField>selectClauseFragment;
			if (distinctClause.type == JSONClauseObjectType.DISTINCT_FUNCTION) {
				let distinctSelect = this.getSELECTFragment(entityName, selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0], joinTree, entityDefaults, embedParameters, parameters);
				return `DISTINCT ${distinctSelect}`;
			}
		}

		let retrieveAllOwnFields: boolean = false;
		let numProperties = 0;
		for (let propertyName in selectClauseFragment) {
			if (propertyName === '*') {
				retrieveAllOwnFields = true;
				delete selectClauseFragment['*'];
				throw `'*' operator isn't yet implemented in mapped queries`;
			}
			numProperties++;
		}
		if (numProperties === 0) {
			throw `Mapped query must have fields in select clause`;
		}
		//  For {} select causes or if '*' is present, retrieve the entire object
		if (retrieveAllOwnFields) {
			selectClauseFragment = {};
			let tableAlias = QRelation.getAlias(joinTree.jsonRelation);
			let qEntity = this.qEntityMapByAlias[tableAlias];
			let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
			let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
			let entityRelationMap = this.entitiesRelationPropertyMap[entityName];
			for (let propertyName in entityPropertyTypeMap) {
				selectClauseFragment[propertyName] = entityPropertyTypeMap[propertyName];
			}
			throw `'*' operator isn't yet implemented in mapped queries`;
		}

		for (let propertyName in selectClauseFragment) {
			let value = <JSONClauseField>selectClauseFragment[propertyName];
			// Skip undefined values
			if (value === undefined) {
				continue;
			}
			selectSqlFragment += this.getFieldValue(value, selectSqlFragment, true,
				// Nested object processing
				()=> {
					return this.getSELECTFragment(null,
						selectSqlFragment, selectClauseFragment[propertyName], joinTree.getEntityRelationChildNode(childEntityName, propertyName), null, embedParameters, parameters);
				});

			let fieldKey = `${tableAlias}.${propertyName}`;
			if (entityPropertyTypeMap[propertyName]) {
				let columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
				let columnSelect = this.getSimpleColumnSelectFragment(propertyName, tableAlias, columnName, selectSqlFragment);
				selectSqlFragment += columnSelect;
			} else if (entityRelationMap[propertyName]) {
				let subSelectClauseFragment = selectClauseFragment[propertyName];
				if (subSelectClauseFragment == null) {
					// For null entity reference, retrieve just the id
					if (entityMetadata.manyToOneMap[propertyName]) {
						let columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
						let columnSelect = this.getSimpleColumnSelectFragment(propertyName, tableAlias, columnName, selectSqlFragment);
						selectSqlFragment += columnSelect;
						continue;
					} else {
						// Do not retrieve @OneToMay set to null
						continue;
					}
				}
				let childEntityName = entityRelationMap[propertyName].entityName;
			} else {
				throw `Unexpected property '${propertyName}' on entity '${entityName}' (alias '${tableAlias}') in SELECT clause.`;
			}
		}

		return selectSqlFragment;
	}
}