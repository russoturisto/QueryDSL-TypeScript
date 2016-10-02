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
		let fromFragment = this.getFromFragment(joinQEntityMap, this.joinAliasMap, this.phJsonQuery.from, embedParameters, parameters);
		let selectFragment = this.getSelectFragment(entityName, null, this.phJsonQuery.select, this.joinAliasMap, this.columnAliasMap, this.defaultsMap, embedParameters, parameters);
		let whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap, embedParameters, parameters);

		return `SELECT
${selectFragment}
FROM
${fromFragment}
WHERE
${whereFragment}`;
	}

	protected getSelectFragment(
		entityName: string,
		selectFragment: string,
		selectClauseFragment: any,
		joinAliasMap: {[entityName: string]: string},
		columnAliasMap: {[aliasPropertyCombo: string]: string},
		entityDefaultsMap: {[property: string]: any},
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

		return results.map(( result ) => {
			return this.parseQueryResult(this.qEntity.__entityName__, this.phJsonQuery.select, result, [0], this.defaultsMap);
		});

	}

	protected parseQueryResult(
		entityName: string,
		selectClauseFragment: any,
		resultRow: any,
		nextFieldIndex: number[],
		entityDefaultsMap: {[property: string]: any}
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
						childDefaultsMap
					);
					resultObject[propertyName] = childResultObject;
				}
			}
			nextFieldIndex[0]++;
		}

		return resultObject;
	}
}