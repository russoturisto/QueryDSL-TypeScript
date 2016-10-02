import {IEntity, IQEntity} from "../../core/entity/Entity";
import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {PHJsonSQLUpdate} from "./PHSQLUpdate";
import {SQLDialect} from "./SQLStringQuery";
import {RelationRecord} from "../../core/entity/Relation";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {SQLStringNoJoinQuery} from "./SQLStringNoJoinQuery";
/**
 * Created by Papa on 10/2/2016.
 */

export class SQLStringUpdate<IE extends IEntity> extends SQLStringNoJoinQuery<IE> {

	constructor(
		public phJsonUpdate: PHJsonSQLUpdate<IE>,
		qEntity: IQEntity,
		qEntityMap: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
	}

	toSQL(
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		if (!this.phJsonUpdate.update) {
			throw `Expecting exactly one table in FROM clause`;
		}
		let entityName = this.qEntity.__entityName__;
		let joinQEntityMap: {[alias: string]: IQEntity} = {};
		let updateFragment = this.getTableFragment(this.phJsonUpdate.update);
		let setFragment = this.getSetFragment(entityName, this.phJsonUpdate.set, embedParameters, parameters);
		let whereFragment = this.getWHEREFragment(this.phJsonUpdate.where, 0, joinQEntityMap, embedParameters, parameters);

		return `update
${updateFragment}
SET
${setFragment}
WHERE
${whereFragment}`;
	}

	protected getSetFragment(
		entityName: string,
		setClauseFragment: IE,
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {

		let qEntity = this.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = this.entitiesRelationPropertyMap[entityName];

		let tableAlias = joinAliasMap[entityName];
		if (!tableAlias) {
			throw `Alias for entity ${entityName} is not defined in the From clause.`;
		}

		let retrieveAllOwnFields: boolean = false;
		let numProperties = 0;
		for (let propertyName in selectClauseFragment) {
			if (propertyName === '*') {
				retrieveAllOwnFields = true;
				delete selectClauseFragment['*'];
			}
			numProperties++;
		}
		//  For {} select causes or if __allOwnFields__ is present, retrieve the entire object
		if (numProperties === 0 || retrieveAllOwnFields) {
			selectClauseFragment = {};
			for (let propertyName in entityPropertyTypeMap) {
				selectClauseFragment[propertyName] = null;
				// let columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
			}
			/*			for (let propertyName in entityRelationMap) {
			 selectClauseFragment[propertyName] = {};
			 if (entityMetadata.manyToOneMap[propertyName]) {
			 let columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
			 }
			 }*/
		}

		for (let propertyName in selectClauseFragment) {
			let value = selectClauseFragment[propertyName];
			// Skip undefined values
			if (value === undefined) {
				continue;
			} else if (value !== null) {
				entityDefaultsMap[propertyName] = value;
			}
			if (entityPropertyTypeMap[propertyName]) {
				let columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
				let columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, columnAliasMap, selectFragment);
				selectFragment += columnSelect;
			} else if (entityRelationMap[propertyName]) {
				let defaultsChildMap = {};
				entityDefaultsMap[propertyName] = defaultsChildMap;
				let subSelectClauseFragment = selectClauseFragment[propertyName];
				if (subSelectClauseFragment == null) {
					if (entityMetadata.manyToOneMap[propertyName]) {
						let columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
						let columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, columnAliasMap, selectFragment);
						selectFragment += columnSelect;
						continue;
					} else {
						// Do not retrieve @OneToMay set to null
						continue;
					}
				}
				selectFragment = this.getSelectFragment(entityRelationMap[propertyName].entityName,
					selectFragment, selectClauseFragment[propertyName], joinAliasMap, columnAliasMap, defaultsChildMap);
			} else {
				throw `Unexpected property '${propertyName}' on entity '${entityName}' (alias '${tableAlias}') in SELECT clause.`;
			}
		}

		return selectFragment;
	}

}
