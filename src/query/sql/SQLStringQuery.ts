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

export class SQLStringQuery<IE extends IEntity> {

	sqlAdaptor: ISQLAdaptor;
	defaultsMap: {[property: string]: any} = {};
	columnAliasMap: {[aliasPropertyCombo: string]: string} = {};
	joinAliasMap: {[entityName: string]: string} = {};

	private currentFieldIndex = 0;

	constructor(
		public phJsonQuery: PHJsonSQLQuery<IE>,
		public qEntity: QEntity<any>,
		public qEntityMap: {[entityName: string]: QEntity<any>},
		public entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		public entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		private dialect: SQLDialect
	) {
		this.sqlAdaptor = getSQLAdaptor(dialect);
	}

	toSQL(): string {
		let entityName = this.qEntity.__entityName__;

		let joinQEntityMap: {[alias: string]: IQEntity} = {};
		let fromFragment = this.getFromFragment(joinQEntityMap, this.joinAliasMap);
		let selectFragment = this.getSelectFragment(entityName, null, this.phJsonQuery.select, this.joinAliasMap, this.columnAliasMap, this.defaultsMap);
		let whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap);

		return `SELECT
${selectFragment}
FROM
${fromFragment}
WHERE
${whereFragment}`;
	}

	getSelectFragment(
		entityName: string,
		selectFragment: string,
		selectClauseFragment: any,
		joinAliasMap: {[entityName: string]: string},
		columnAliasMap: {[aliasPropertyCombo: string]: string},
		entityDefaultsMap: {[property: string]: any}
	): string {

		let qEntity = this.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let columnMap = entityMetadata.columnMap;
		let joinColumnMap = entityMetadata.joinColumnMap;
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = this.entitiesRelationPropertyMap[entityName];

		let tableAlias = joinAliasMap[entityName];
		if (!tableAlias) {
			throw `Alias for entity ${entityName} is not defined in the From clause.`;
		}

		let numProperties = 0;
		for (let propertyName in selectClauseFragment) {
			numProperties++;
		}
		// For {} select causes retrieve the entire object
		if (numProperties === 0) {
			selectClauseFragment = {};
			for (let propertyName in entityPropertyTypeMap) {
				selectClauseFragment[propertyName] = {};
			}
			for (let propertyName in entityRelationMap) {
				selectClauseFragment[propertyName] = {};
			}
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
				let columnSelect = this.getColumnSelectFragment(entityName, propertyName, tableAlias,
					columnMap, null, columnAliasMap, selectFragment);
				selectFragment += columnSelect;
			} else if (entityRelationMap[propertyName]) {
				let defaultsChildMap = {};
				entityDefaultsMap[propertyName] = defaultsChildMap;
				let subSelectClauseFragment = selectClauseFragment[propertyName];
				if (subSelectClauseFragment == null) {
					if (entityMetadata.manyToOneMap[propertyName]) {
						let columnSelect = this.getColumnSelectFragment(entityName, propertyName, tableAlias,
							null, joinColumnMap, columnAliasMap, selectFragment);
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

	getColumnSelectFragment(
		entityName: string,
		propertyName: string,
		tableAlias: string,
		columnMap: {[propertyName: string]: ColumnConfiguration},
		joinColumnMap: {[propertyName: string]: JoinColumnConfiguration},
		columnAliasMap: {[aliasWithProperty: string]: string},
		existingSelectFragment: string
	): string {
		let columnName;
		if (columnMap && columnMap[propertyName]) {
			columnName = columnMap[propertyName].name;
			if (!columnName) {
				throw `Found @Column but not @Column.name for '${entityName}.${propertyName}' (alias '${tableAlias}') in the SELECT clause.`;
			}
		} else if (joinColumnMap && joinColumnMap[propertyName]) {
			columnName = joinColumnMap[propertyName].name;
			if (!columnName) {
				throw `Found @JoinColumn but not @JoinColumn.name for '${entityName}.${propertyName}' (alias '${tableAlias}') in the SELECT clause.`;
			}
		} else {
			this.warn(`Did not find @Column/@JoinColumn for '${entityName}.${propertyName}' (alias '${tableAlias}') in the SELECT clause. Using property name`);
			columnName = propertyName;
		}

		let columnAlias = `column_${++this.currentFieldIndex}`;
		let columnSelect = `${tableAlias}.${columnName} as columnAlias\n`;
		columnAliasMap[`${tableAlias}.${propertyName}`] = columnAlias;
		if (existingSelectFragment) {
			columnSelect = `\t, ${columnSelect}`;
		} else {
			columnSelect = `\t${columnSelect}`;
		}

		return columnSelect;
	}

	getFromFragment(
		joinQEntityMap: {[alias: string]: IQEntity},
		joinAliasMap: {[entityName: string]: string}
	): string {
		let joinRelations: JSONRelation[] = this.phJsonQuery.from;

		if (joinRelations.length < 1) {
			throw `Expecting at least one table in FROM clause`;
		}

		let firstRelation = joinRelations[0];

		let fromFragment = 'FROM\t';

		if (firstRelation.relationPropertyName || firstRelation.joinType || firstRelation.parentEntityAlias) {
			throw `First table in FROM clause cannot be joined`;
		}

		let firstEntity = this.qEntityMap[firstRelation.entityName];
		if (firstEntity != this.qEntity) {
			throw `Unexpected first table in FROM clause: ${firstRelation.entityName}, expecting: ${this.qEntity.__entityName__}`;
		}

		let firstEntityMetadata: EntityMetadata = <EntityMetadata><any>firstEntity.__entityConstructor__;

		let tableName = firstEntity.__entityName__;
		if (firstEntityMetadata.table && firstEntityMetadata.table.name) {
			tableName = firstEntityMetadata.table.name;
		} else {
			this.warn(`Did not find @Table.name for first table in FROM clause. Using entity class name.`);
		}
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
			joinQEntityMap[joinRelation.alias] = rightEntity;
			joinAliasMap[rightEntity.__entityName__] = joinRelation.alias;

			let leftEntityMetadata: EntityMetadata = <EntityMetadata><any>leftEntity.__entityConstructor__;
			let rightEntityMetadata: EntityMetadata = <EntityMetadata><any>rightEntity.__entityConstructor__;

			let tableName = rightEntity.__entityName__;
			if (rightEntityMetadata.table && rightEntityMetadata.table.name) {
				tableName = rightEntityMetadata.table.name;
			} else {
				this.warn(`Did not find @Table.name for table ${i + 1} in FROM clause. Using entity class name.`);
			}

			let joinTypeString;
			switch (joinRelation.joinType) {
				case JoinType.INNER_JOIN:
					joinTypeString = 'INNER JOIN';
					break;
				case JoinType.LEFT_JOIN:
					joinTypeString = 'LEFT JOIN';
					break;
			}

			let rightEntityJoinColumn, leftColumn;

			if (rightEntityMetadata.manyToOneMap[joinRelation.relationPropertyName]) {
				let rightEntityJoinColumnMetadata = rightEntityMetadata.joinColumnMap[joinRelation.relationPropertyName];
				if (!rightEntityJoinColumnMetadata || !rightEntityJoinColumnMetadata.name) {
					throw `Could not find @JoinColumn for @ManyToOne relation: ${joinRelation.relationPropertyName} on Right entity in jon for table ${i + 1} in the FROM clause.`;
				}
				rightEntityJoinColumn = rightEntityJoinColumnMetadata.name;

				if (!leftEntityMetadata.idProperty) {
					throw `Could not find @Id for right entity of join to table ${i + 1} in FROM clause`;
				}
				leftColumn = leftEntityMetadata.idProperty;
				let leftEntityColumnMetadata = leftEntityMetadata.columnMap[leftColumn];
				if (leftEntityColumnMetadata) {
					if (leftEntityColumnMetadata.name) {
						leftColumn = leftEntityColumnMetadata.name;
					} else {
						throw `Found @Column but not @Column.name for @Id column of left/parent entity in join for table ${i + 1} in FROM clause`;
					}
				} else {
					this.warn(`Did not find @Column.name for @Id column of left/parent entity in join for table ${i + 1} in FROM clause. Using object property name.`);
				}
			} else if (rightEntityMetadata.oneToManyMap[joinRelation.relationPropertyName]) {
				let rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[joinRelation.relationPropertyName];
				let mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
				if (!mappedByLeftEntityProperty) {
					throw `Could not find @OneToMany.mappedBy for relation ${joinRelation.relationPropertyName} of table ${i + 1} in FROM clause.`;
				}
				leftEntityMetadata.manyToOneMap[mappedByLeftEntityProperty]
				let leftEntityJoinColumnMetadata = rightEntityMetadata.joinColumnMap[mappedByLeftEntityProperty];
				if (!leftEntityJoinColumnMetadata || !leftEntityJoinColumnMetadata.name) {
					throw `Could not find @JoinColumn for @ManyToOne relation: ${joinRelation.relationPropertyName} on Left entity in jon for table ${i + 1} in the FROM clause.`;
				}
				leftColumn = leftEntityJoinColumnMetadata.name;

				if (!rightEntityMetadata.idProperty) {
					throw `Could not find @Id for right entity of join to table ${i + 1} in FROM clause`;
				}
				rightEntityJoinColumn = leftEntityMetadata.idProperty;
				let rightEntityColumnMetadata = leftEntityMetadata.columnMap[rightEntityJoinColumn];
				if (rightEntityColumnMetadata && rightEntityColumnMetadata.name) {
					if (rightEntityColumnMetadata.name) {
						rightEntityJoinColumn = rightEntityColumnMetadata.name;
					} else {
						throw `Found @Column but not @Column.name for @Id column of Right entity in join for table ${i + 1} in FROM clause.`;
					}
				} else {
					this.warn(`Did not find @Column.name for @Id column of Right entity in join for table ${i + 1} in FROM clause. Using object property name.`);
				}
			} else {
				throw `Relation for table ${i + i} (${tableName}) in FROM clause is not listed as @ManyToOne or @OneToMany`;
			}
			fromFragment += `\t${joinTypeString} ${tableName} ${joinRelation.alias}`;
			// TODO: add support for custom JOIN ON clauses
			fromFragment += `\t\tON ${joinRelation.parentEntityAlias}.${rightEntityJoinColumn} = ${joinRelation.alias}.${leftColumn}`;
		}

		return fromFragment;
	}

	getWHEREFragment(
		operation: JSONBaseOperation,
		nestingIndex: number,
		joinQEntityMap: {[alias: string]: IQEntity}
	): string {
		let whereFragment = '';

		let nestingPrefix = '';
		for (let i = 0; i < nestingIndex; i++) {
			nestingPrefix += '\t';
		}

		let foundProperty;
		for (let property in operation) {
			if (foundProperty) {
				throw `More than one property found in a WHERE Clause operation ${foundProperty}, ${property}, ...`;
			}
			foundProperty = property;

			let operator;
			switch (property) {
				case '$and':
					operator = 'AND';
				case '$or':
					operator = 'OR';
					let childOperations = operation[property];
					if (!(childOperations instanceof Array)) {
						throw `Expecting an array of child operations as a value for operator ${operator}, in the WHERE Clause.`;
					}
					whereFragment = childOperations.map(( childOperation ) => {
						this.getWHEREFragment(childOperation, nestingIndex + 1, joinQEntityMap);
					}).join(`\n${nestingPrefix}${operator} `);
					whereFragment = `( ${whereFragment} )`;
					break;
				case '$not':
					operator = 'NOT';
					whereFragment = `${operator} ${this.getWHEREFragment(operation[property], nestingIndex + 1, joinQEntityMap)}`;
					break;
				default:
					let aliasColumnPair = property.split('.');
					if (aliasColumnPair.length != 2) {
						throw `Expecting 'alias.column' instead of ${property}`;
					}
					let alias = aliasColumnPair[0];
					let qEntity = joinQEntityMap[alias];
					if (!qEntity) {
						throw `Unknown alias '${alias}' in WHERE clause`;
					}
					let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
					let propertyName = aliasColumnPair[1];
					if (entityMetadata.manyToOneMap[propertyName]) {
						throw `Found @ManyToOne property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
					} else if (entityMetadata.oneToManyMap[propertyName]) {
						throw `Found @ManyToOne property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
					} else if (entityMetadata.transient[propertyName]) {
						throw `Found @Transient property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
					}

					let field = qEntity.__entityFieldMap__[propertyName];
					if (!field) {
						throw `Did not find field '${alias}.${propertyName}' used in the WHERE clause.`;
					}

					let columnMetadata = entityMetadata.columnMap[propertyName];
					if (columnMetadata) {
						if (!columnMetadata.name) {
							throw `Found @Column but not @Column.name for '${alias}.${propertyName}' in a WHERE clause.`;
						} else {
							whereFragment = `${alias}.${columnMetadata.name} `;
						}
					} else {
						this.warn(`Did not find @Column for '${alias}.${propertyName}' in a WHERE clause. Using object property name.`);
						whereFragment = `${alias}.${propertyName} `;
					}

					let valueOperation = operation[property];
					let fieldOperation;
					for (let operationProperty in valueOperation) {
						if (fieldOperation) {
							throw `More than open operation (${fieldOperation}, ${operationProperty}, ...) is defined on field '${alias}.${propertyName}' used in the WHERE clause.`;
						}
						fieldOperation = operationProperty;
					}

					let operatorAndValueFragment;
					let value = valueOperation[fieldOperation];
					if (field instanceof QBooleanField) {
						operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'boolean');
						if (!operatorAndValueFragment) {
							throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`
						}
					} else if (field instanceof QDateField) {
						operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'Date', this.sqlAdaptor.dateToDbQuery);
					} else if (field instanceof QNumberField) {
						operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'number');

					} else if (field instanceof QStringField) {
						operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'string', this.sanitizeStringValue);
						if (!operatorAndValueFragment) {
							switch (fieldOperation) {
								case '$like':
									if (typeof value != 'string') {
										this.throwValueOnOperationError('string', '$like (LIKE)', alias, propertyName);
									}
									operatorAndValueFragment = `LIKE ${this.sanitizeStringValue(value)}`;
									break;
								default:
									throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`;
							}
						}
					} else {
						throw `Unexpected type '${(<any>field.constructor).name}' of field '${alias}.${propertyName}' for operation '${fieldOperation}' in the WHERE clause.`;
					}

					whereFragment += operatorAndValueFragment;
					break;
			}
		}

		return whereFragment;
	}

	getComparibleOperatorAndValueFragment<T>(
		fieldOperation: string,
		value: any,
		alias: string,
		propertyName: string,
		typeCheckFunction: ( value: any )=>boolean,
		typeName: string,
		conversionFunction?: ( value: any )=>any
	): string {
		let operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, conversionFunction);
		if (operatorAndValueFragment) {
			return operatorAndValueFragment;
		}
		let opString;
		switch (fieldOperation) {
			case '$gt':
				opString = '$gt (>)';
				break;
			case '$gte':
				opString = '$gte (>=)';
				break;
			case '$lt':
				opString = '$lt (<)';
				break;
			case '$lte':
				opString = '$gt (<=)';
				break;
			default:
				throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`
		}
		if (!typeCheckFunction(value)) {
			this.throwValueOnOperationError(typeName, opString, alias, propertyName);
		}
		if (conversionFunction) {
			value = conversionFunction(value);
		}
		switch (fieldOperation) {
			case '$gt':
				return `> ${value}`;
			case '$gte':
				return `>= ${value}`;
			case '$lt':
				return `< ${value}`;
			case '$lte':
				return `<= ${value}`;
			default:
				throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`
		}
	}

	getCommonOperatorAndValueFragment<T>(
		fieldOperation: string,
		value: any,
		alias: string,
		propertyName: string,
		typeCheckFunction: ( value: any )=>boolean,
		typeName: string,
		conversionFunction?: ( value: any )=>any
	): string {
		let sqlOperator;

		switch (fieldOperation) {
			case '$eq':
				sqlOperator = '=';
				if (!typeCheckFunction(value)) {
					this.throwValueOnOperationError(typeName, '$eq (=)', alias, propertyName);
				}
				if (conversionFunction) {
					value = conversionFunction(value);
				}
				break;
			case '$exists':
				if (value === true) {
					sqlOperator = 'IS NOT NULL';
				} else if (value === false) {
					sqlOperator = 'IS NULL';
				} else {
					throw `Invalid $exists value, expecting 'true' (IS NOT NULL), or 'false' (IS NULL)`;
				}
				break;
			case '$in':
				sqlOperator = 'IN';
				if (!(value instanceof Array)) {
					this.throwValueOnOperationError(`${typeName}[]`, '$in (IN)', alias, propertyName);
				}
				value = value.map(( aValue: string )=> {
					if (!typeCheckFunction(aValue)) {
						this.throwValueOnOperationError(`${typeName}[]`, '$eq (=)', alias, propertyName);
						if (conversionFunction) {
							return conversionFunction(aValue);
						} else {
							return aValue;
						}
					}
				}).join(', ');
				break;
			case '$ne':
				sqlOperator = '!=';
				if (!typeCheckFunction(value)) {
					this.throwValueOnOperationError(typeName, '$ne (!=)', alias, propertyName);
				}
				if (conversionFunction) {
					value = conversionFunction(value);
				}
				break;
			case '$nin':
				sqlOperator = 'NOT IN';
				if (!(value instanceof Array)) {
					this.throwValueOnOperationError(`${typeName}[]`, '$in (IN)', alias, propertyName);
				}
				value = value.map(( aValue: string )=> {
					if (!typeCheckFunction(aValue)) {
						this.throwValueOnOperationError(`${typeName}[]`, '$eq (=)', alias, propertyName);
						if (conversionFunction) {
							return conversionFunction(aValue);
						} else {
							return aValue;
						}
					}
				}).join(', ');
				break;
			default:
				return undefined;
		}

		return `${sqlOperator} ${value}`;
	}

	booleanTypeCheck(
		valueToCheck: any
	): boolean {
		return typeof valueToCheck === 'boolean';
	}

	dateTypeCheck(
		valueToCheck: any
	): boolean {
		// TODO: see if there is a more appropriate way to check serialized Dates
		if (typeof valueToCheck === 'number') {
			valueToCheck = new Date(valueToCheck);
		}
		return valueToCheck instanceof Date;
	}

	numberTypeCheck(
		valueToCheck: any
	): boolean {
		return typeof valueToCheck === 'number';
	}

	stringTypeCheck(
		valueToCheck: any
	): boolean {
		return typeof valueToCheck === 'string';
	}

	throwValueOnOperationError(
		valueType: string,
		operation: string,
		alias: string,
		propertyName: string
	) {
		throw `Expecting a string value for $eq (=) operation on '${alias}.${propertyName}' used in the WHERE clause.`;
	}

	sanitizeStringValue( value: string ): string {
		// FIXME: sanitize the string to prevent SQL Injection attacks.

		return `'${value}'`;
	}


	warn(
		warning: string
	): void {
		console.log(warning);
	}

	parseQueryResults(
		entityName: string,
		selectClauseFragment: any,
		results: any[]
	): any[] {
		let parsedResults: any[] = [];

		if (!results || !results.length) {
			return parsedResults;
		}

		return results.map(( result ) => {
			return this.parseQueryResult(entityName, selectClauseFragment, result, [0], this.defaultsMap);
		});

	}

	parseQueryResult(
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