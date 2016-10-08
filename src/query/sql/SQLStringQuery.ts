import {PHJsonSQLQuery, JoinType} from "./PHSQLQuery";
import {RelationRecord, JSONRelation} from "../../core/entity/Relation";
import {IEntity, QEntity, IQEntity} from "../../core/entity/Entity";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {QueryTreeNode, RelationType} from "../noSql/QueryTreeNode";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {QBooleanField} from "../../core/field/BooleanField";
import {QDateField} from "../../core/field/DateField";
import {QNumberField} from "../../core/field/NumberField";
import {QStringField} from "../../core/field/StringField";
import {ISQLAdaptor, getSQLAdaptor} from "./adaptor/SQLAdaptor";
import {ColumnConfiguration, JoinColumnConfiguration} from "../../core/entity/metadata/ColumnDecorators";
import {FieldMap} from "./FieldMap";
import {SQLStringWhereBase} from "./SQLStringWhereBase";
/**
 * Created by Papa on 8/20/2016.
 */

export enum SQLDialect {
	SQLITE,
	ORACLE
}

export enum SQLDataType {
	BOOLEAN,
	DATE,
	NUMBER,
	STRING
}

export class SQLStringQuery<IE extends IEntity> extends SQLStringWhereBase<IE> {

	columnAliasMap: {[aliasPropertyCombo: string]: string} = {};
	defaultsMap: {[property: string]: any} = {};

	private currentFieldIndex = 0;

	constructor(
		public phJsonQuery: PHJsonSQLQuery<IE>,
		qEntity: IQEntity,
		qEntityMap: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect
	) {
		super(qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
	}

	getFieldMap(): FieldMap {
		return this.fieldMap;
	}

	toSQL(
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		let entityName = this.qEntity.__entityName__;

		let joinQEntityMap: {[alias: string]: IQEntity} = {};
		let fromFragment = this.getFROMFragment(joinQEntityMap, this.joinAliasMap, this.phJsonQuery.from, embedParameters, parameters);
		let selectEntitySet: {[entityName: string]: boolean} = {};
		let selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinAliasMap, this.columnAliasMap, this.defaultsMap, selectEntitySet, embedParameters, parameters);
		let whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap, embedParameters, parameters);

		return `SELECT
${selectFragment}
FROM
${fromFragment}
WHERE
${whereFragment}`;
	}

	private getFROMFragment(
		joinQEntityMap: {[alias: string]: IQEntity},
		joinAliasMap: {[entityName: string]: string},
		joinRelations: JSONRelation[],
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		if (joinRelations.length < 1) {
			throw `Expecting at least one table in FROM clause`;
		}

		let firstRelation = joinRelations[0];

		let fromFragment = '\t';

		if (firstRelation.relationPropertyName || firstRelation.joinType || firstRelation.parentEntityAlias) {
			throw `First table in FROM clause cannot be joined`;
		}

		let firstEntity = this.qEntityMap[firstRelation.entityName];
		if (firstEntity != this.qEntity) {
			throw `Unexpected first table in FROM clause: ${firstRelation.entityName}, expecting: ${this.qEntity.__entityName__}`;
		}

		let tableName = this.getTableName(firstEntity);
		if (!firstRelation.alias) {
			throw `Missing an alias for the first table in the FROM clause.`;
		}
		fromFragment += `${tableName} ${firstRelation.alias}`;

		joinQEntityMap[firstRelation.alias] = firstEntity;
		joinAliasMap[firstEntity.__entityName__] = firstRelation.alias;

		for (let i = 1; i < joinRelations.length; i++) {
			let joinRelation = joinRelations[i];
			if (!joinRelation.relationPropertyName) {
				throw `Table ${i + 1} in FROM clause is missing relationPropertyName`;
			}
			if (!joinRelation.joinType) {
				throw `Table ${i + 1} in FROM clause is missing joinType`;
			}
			if (!joinRelation.parentEntityAlias) {
				throw `Table ${i + 1} in FROM clause is missing parentEntityAlias`;
			}
			if (!joinQEntityMap[joinRelation.parentEntityAlias]) {
				throw `Missing parent entity for alias ${joinRelation.parentEntityAlias}, on table ${i + 1} in FROM clause`;
			}
			let leftEntity = joinQEntityMap[joinRelation.parentEntityAlias];
			if (!joinRelation.alias) {
				throw `Missing an alias for the first table in the FROM clause.`;
			}

			let rightEntity = this.qEntityMap[joinRelation.entityName];
			if (!rightEntity) {
				throw `Could not find entity ${joinRelation.entityName} for table ${i + 1} in FROM clause`;
			}
			if (joinQEntityMap[joinRelation.alias]) {
				throw `Multiple instances of same entity currently not supported in FROM clause`;
			}
			joinQEntityMap[joinRelation.alias] = rightEntity;
			joinAliasMap[rightEntity.__entityName__] = joinRelation.alias;

			let tableName = this.getTableName(rightEntity);

			let joinTypeString;
			/*
			 switch (joinRelation.joinType) {
			 case SQLJoinType.INNER_JOIN:
			 joinTypeString = 'INNER JOIN';
			 break;
			 case SQLJoinType.LEFT_JOIN:
			 joinTypeString = 'LEFT JOIN';
			 break;
			 default:
			 throw `Unsupported join type: ${joinRelation.joinType}`;
			 }
			 */
			// FIXME: figure out why the switch statement above quit working
			if (joinRelation.joinType === <number>JoinType.INNER_JOIN) {
				joinTypeString = 'INNER JOIN';
			} else if (joinRelation.joinType === <number>JoinType.LEFT_JOIN) {
				joinTypeString = 'LEFT JOIN';
			} else {
				throw `Unsupported join type: ${joinRelation.joinType}`;
			}

			let rightEntityJoinColumn, leftColumn;
			let leftEntityMetadata: EntityMetadata = <EntityMetadata><any>leftEntity.__entityConstructor__;
			let rightEntityMetadata: EntityMetadata = <EntityMetadata><any>rightEntity.__entityConstructor__;

			if (rightEntityMetadata.manyToOneMap[joinRelation.relationPropertyName]) {
				rightEntityJoinColumn = this.getEntityManyToOneColumnName(rightEntity, joinRelation.relationPropertyName, joinRelation.parentEntityAlias);

				if (!leftEntityMetadata.idProperty) {
					throw `Could not find @Id for right entity of join to table ${i + 1} in FROM clause`;
				}
				leftColumn = this.getEntityPropertyColumnName(leftEntity, leftEntityMetadata.idProperty, joinRelation.alias);
			} else if (rightEntityMetadata.oneToManyMap[joinRelation.relationPropertyName]) {
				let rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[joinRelation.relationPropertyName];
				let mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
				if (!mappedByLeftEntityProperty) {
					throw `Could not find @OneToMany.mappedBy for relation ${joinRelation.relationPropertyName} of table ${i + 1} in FROM clause.`;
				}
				leftColumn = this.getEntityManyToOneColumnName(leftEntity, mappedByLeftEntityProperty, joinRelation.alias);

				if (!rightEntityMetadata.idProperty) {
					throw `Could not find @Id for right entity of join to table ${i + 1} in FROM clause`;
				}
				rightEntityJoinColumn = this.getEntityPropertyColumnName(rightEntity, rightEntityMetadata.idProperty, joinRelation.parentEntityAlias);
			} else {
				throw `Relation for table ${i + i} (${tableName}) in FROM clause is not listed as @ManyToOne or @OneToMany`;
			}
			fromFragment += `\t${joinTypeString} ${tableName} ${joinRelation.alias}`;
			// TODO: add support for custom JOIN ON clauses
			fromFragment += `\t\tON ${joinRelation.parentEntityAlias}.${rightEntityJoinColumn} = ${joinRelation.alias}.${leftColumn}`;
		}

		return fromFragment;
	}

	private getEntityManyToOneColumnName(
		qEntity: IQEntity,
		propertyName: string,
		tableAlias: string
	): string {
		let entityName = qEntity.__entityName__;
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let joinColumnMap = entityMetadata.joinColumnMap;

		let columnName = this.getManyToOneColumnName(entityName, propertyName, tableAlias, joinColumnMap);
		this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);

		return columnName;
	}

	protected getManyToOneColumnName(
		entityName: string,
		propertyName: string,
		tableAlias: string,
		joinColumnMap: {[propertyName: string]: JoinColumnConfiguration}
	): string {
		let columnName;
		if (joinColumnMap && joinColumnMap[propertyName]) {
			columnName = joinColumnMap[propertyName].name;
			if (!columnName) {
				throw `Found @JoinColumn but not @JoinColumn.name for '${entityName}.${propertyName}' (alias '${tableAlias}') in the SELECT clause.`;
			}
		} else {
			this.warn(`Did not find @JoinColumn for '${entityName}.${propertyName}' (alias '${tableAlias}') in the SELECT clause. Using property name`);
			columnName = propertyName;
		}

		return columnName;
	}

	protected getSELECTFragment(
		entityName: string,
		selectFragment: string,
		selectClauseFragment: any,
		joinAliasMap: {[entityName: string]: string},
		columnAliasMap: {[aliasPropertyCombo: string]: string},
		entityDefaultsMap: {[property: string]: any},
		selectEntitySet: {[entityName: string]: boolean},
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {

		if (selectEntitySet[entityName]) {
			throw `Multiple instances of the same entity currently not supported in SELECT clause (but auto-populated for the sub-tree).`;
		}
		selectEntitySet[entityName] = true;

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
				selectFragment += this.getSELECTFragment(entityRelationMap[propertyName].entityName,
					selectFragment, selectClauseFragment[propertyName], joinAliasMap, columnAliasMap, defaultsChildMap, selectEntitySet, embedParameters, parameters);
			} else {
				throw `Unexpected property '${propertyName}' on entity '${entityName}' (alias '${tableAlias}') in SELECT clause.`;
			}
		}

		return selectFragment;
	}

	protected getColumnSelectFragment(
		propertyName: string,
		tableAlias: string,
		columnName: string,
		columnAliasMap: {[aliasWithProperty: string]: string},
		existingSelectFragment: string
	): string {
		let columnAlias = `column_${++this.currentFieldIndex}`;
		let columnSelect = `${tableAlias}.${columnName} as ${columnAlias}\n`;
		columnAliasMap[`${tableAlias}.${propertyName}`] = columnAlias;
		if (existingSelectFragment) {
			columnSelect = `\t, ${columnSelect}`;
		} else {
			columnSelect = `\t${columnSelect}`;
		}

		return columnSelect;
	}

	parseQueryResults(
		results: any[]
	): any[] {
		let parsedResults: any[] = [];

		if (!results || !results.length) {
			return parsedResults;
		}
		/**
		 * Keeping track of relations:
		 *
		 * in a given JSON tree:
		 * b = [{
		 *  a: {
		 *  	b: [...]
		 *      c: [...]
		 *  },
		 * 	c: [
		 * 	 {
		 * 	   a: ...
		 * 	   b: ...
		 * 	 }
		 * 	]
		 * }, ...]
		 *
		 * relations are tracked via foreign keys
		 * hence it is possible to re-construct relationships to arrive at:
		 * b = [{
		 *  a: {
		 *  	b: b
		 *    c: [b1.c, b2.c, ...]
		 *  },
		 * 	c: [
		 * 	 {
		 * 	    a: a
		 * 	 	  b: b
		 * 	 }
		 * 	]
		 * }, ...]
		 *
		 * Reconstruction has two types:
		 *
		 *  a)  Reconstruct the Many-To-One relations by Id
		 *    for this we need a map of all entities [by Type]:[by id]:Entity
		 *  b)  Reconstruct the One-To-Many relations by Tree
		 *
		 *
		 * @type {{}}
		 */

			// Keys can only be strings or numbers
		let entityMap: {[entityName: string]: {[entityId: string]: any}} = {};
		let entityRelationMap: {[entityId: string]: {}} = {};

		return results.map(( result ) => {
			return this.parseQueryResult(this.qEntity.__entityName__, this.phJsonQuery.select, result, [0], this.defaultsMap, entityMap);
		});

	}

	protected parseQueryResult(
		entityName: string,
		selectClauseFragment: any,
		resultRow: any,
		nextFieldIndex: number[],
		entityDefaultsMap: {[property: string]: any},
		entityMap: {[entityName: string]: {[entityId: string]: any}}
	): any {
		// Return blanks, primitives and Dates directly
		if (!resultRow || !(resultRow instanceof Object) || resultRow instanceof Date) {
			return resultRow;
		}

		let qEntity = this.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let columnMap = entityMetadata.columnMap;
		let joinColumnMap = entityMetadata.joinColumnMap;
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = this.entitiesRelationPropertyMap[entityName];

		let entityAlias = this.joinAliasMap[entityName];

		let resultObject = new qEntity.__entityConstructor__();

		for (let propertyName in selectClauseFragment) {
			if (selectClauseFragment[propertyName] === undefined) {
				continue;
			}
			if (entityPropertyTypeMap[propertyName]) {
				let field = qEntity.__entityFieldMap__[propertyName];
				let dataType: SQLDataType;
				if (field instanceof QBooleanField) {
					dataType = SQLDataType.BOOLEAN;
				} else if (field instanceof QDateField) {
					dataType = SQLDataType.DATE;
				} else if (field instanceof QNumberField) {
					dataType = SQLDataType.NUMBER;
				} else if (field instanceof QStringField) {
					dataType = SQLDataType.STRING;
				}

				let fieldKey = `${entityAlias}.${propertyName}`;
				let columnAlias = this.columnAliasMap[fieldKey];
				let defaultValue = entityDefaultsMap[propertyName];

				resultObject[propertyName] = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], dataType, defaultValue);
			} else if (entityRelationMap[propertyName]) {

				let childSelectClauseFragment = selectClauseFragment[propertyName];
				if (childSelectClauseFragment == null) {
					if (entityMetadata.manyToOneMap[propertyName]) {
						let fieldKey = `${entityAlias}.${propertyName}`;
						let columnAlias = this.columnAliasMap[fieldKey];
						resultObject[propertyName] = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], SQLDataType.NUMBER, null);
					}
				} else {
					let childDefaultsMap = entityDefaultsMap[propertyName];
					let childEntityName = entityRelationMap[propertyName].entityName;

					let childResultObject = this.parseQueryResult(
						childEntityName,
						childSelectClauseFragment,
						resultRow,
						nextFieldIndex,
						childDefaultsMap,
						entityMap
					);
					resultObject[propertyName] = childResultObject;
				}
			}
			nextFieldIndex[0]++;
		}

		return resultObject;
	}
}