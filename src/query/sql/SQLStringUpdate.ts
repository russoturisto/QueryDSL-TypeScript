import {IEntity, IQEntity} from "../../core/entity/Entity";
import {ClauseType} from "./SQLStringWhereBase";
import {PHJsonSQLUpdate} from "./PHSQLUpdate";
import {SQLDialect} from "./SQLStringQuery";
import {EntityRelationRecord, QRelation} from "../../core/entity/Relation";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {SQLStringNoJoinQuery} from "./SQLStringNoJoinQuery";
import {MetadataUtils} from "../../core/entity/metadata/MetadataUtils";
/**
 * Created by Papa on 10/2/2016.
 */

export class SQLStringUpdate extends SQLStringNoJoinQuery {

	constructor(
		public phJsonUpdate: PHJsonSQLUpdate<IEntity>,
		qEntity: IQEntity,
		qEntityMap: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
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
		let updateAlias = QRelation.getAlias(this.phJsonUpdate.update);
		let updateFragment = this.getTableFragment(this.phJsonUpdate.update);
		let setFragment = this.getSetFragment(updateAlias, entityName, this.phJsonUpdate.set);
		let whereFragment = '';
		let jsonQuery = this.phJsonUpdate;
		if (jsonQuery.where) {
			whereFragment = `
WHERE
${this.getWHEREFragment(jsonQuery.where, '')}`;
		}

		return `UPDATE
${updateFragment}
SET
${setFragment}${whereFragment}`;
	}

	protected getSetFragment(
		updateAlias: string,
		entityName: string,
		setClauseFragment: IEntity,
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {

		let qEntity = this.qEntityMapByAlias[updateAlias];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = this.entitiesRelationPropertyMap[entityName];

		let setFragments = [];
		for (let propertyName in setClauseFragment) {

			let value = setClauseFragment[propertyName];
			// Skip undefined values
			if (value === undefined) {
				continue;
			}
			this.validator.validateUpdateProperty(propertyName, qEntity.__entityName__);
			let columnName;
			if (entityPropertyTypeMap[propertyName]) {
				columnName = this.getEntityPropertyColumnName(qEntity, propertyName, null);
				let field = qEntity.__entityFieldMap__[propertyName];
				if (!field) {
					throw `Did not find field '${entityName}.${propertyName}' used in the WHERE clause.`;
				}
			} else if (entityRelationMap[propertyName]) {
				if (entityMetadata.manyToOneMap[propertyName]) {
					columnName = MetadataUtils.getJoinColumnName(propertyName, entityMetadata);
					let relation = qEntity.__entityRelationMap__[propertyName];
					if (!relation) {
						throw `Did not find field '${entityName}.${propertyName}' used in the WHERE clause.`;
					}
				} else {
					throw `Cannot use @OneToMany property '${entityName}.${propertyName}' for assignment in the SET clause.`;
				}
			} else {
				throw `Unexpected property '${propertyName}' on entity '${entityName}' in SET clause.`;
			}
			let fieldValue = this.getFieldValue(value, ClauseType.WHERE_CLAUSE);
			setFragments.push(`\t${columnName} = ${fieldValue}`);
		}

		return setFragments.join(', \n');
	}

}
