import {IEntity, IQEntity} from "../../core/entity/Entity";
import {ISQLAdaptor, getSQLAdaptor} from "./adaptor/SQLAdaptor";
import {SQLDialect} from "./SQLStringQuery";
import {EntityRelationRecord} from "../../core/entity/Relation";
import {QBooleanField} from "../../core/field/BooleanField";
import {QDateField} from "../../core/field/DateField";
import {QNumberField} from "../../core/field/NumberField";
import {QStringField} from "../../core/field/StringField";
import {JSONBaseOperation, OperationCategory} from "../../core/operation/Operation";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {FieldMap} from "./FieldMap";
import {MetadataUtils} from "../../core/entity/metadata/MetadataUtils";
import {JoinTreeNode} from "../../core/entity/JoinTreeNode";
import {JSONLogicalOperation} from "../../core/operation/LogicalOperation";
/**
 * Created by Papa on 10/2/2016.
 */

export abstract class SQLStringWhereBase<IE extends IEntity> {

	protected fieldMap: FieldMap = new FieldMap();
	protected sqlAdaptor: ISQLAdaptor;
	protected qEntityMapByAlias: {[entityName: string]: IQEntity} = {};

	constructor(
		protected rootQEntity: IQEntity,
		protected qEntityMapByName: {[entityName: string]: IQEntity},
		protected entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		protected entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		protected dialect: SQLDialect
	) {
		this.sqlAdaptor = getSQLAdaptor(dialect);
	}

	protected getWHEREFragment(
		operation: JSONBaseOperation,
		nestingPrefix: string,
		joinNodeMap: {[alias: string]: JoinTreeNode},
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		let whereFragment = '';
		nestingPrefix = `${nestingPrefix}  `;

		switch (operation.category) {
			case OperationCategory.LOGICAL:
				return this.getLogicalWhereFragment(<JSONLogicalOperation>operation, nestingPrefix, joinNodeMap, embedParameters, parameters);
			case OperationCategory.BOOLEAN:
				let aliasColumnPair = property.split('.');
				if (aliasColumnPair.length != 2) {
					throw `Expecting 'alias.column' instead of ${property}`;
				}
				let alias = aliasColumnPair[0];
				let joinNode = joinNodeMap[alias];
				if (!joinNode) {
					throw `Unknown alias '${alias}' in WHERE clause`;
				}
				let qEntity = this.qEntityMapByAlias[alias];
				let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
				let propertyName = aliasColumnPair[1];
				if (entityMetadata.manyToOneMap[propertyName]) {
					throw `Found @ManyToOne property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
				} else if (entityMetadata.oneToManyMap[propertyName]) {
					throw `Found @OneToMany property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
				} else if (entityMetadata.transient[propertyName]) {
					throw `Found @Transient property '${alias}.${propertyName}' -  cannot be used in a WHERE clause.`;
				}

				let field = qEntity.__entityFieldMap__[propertyName];
				if (!field) {
					throw `Did not find field '${alias}.${propertyName}' used in the WHERE clause.`;
				}

				let columnName = this.getEntityPropertyColumnName(qEntity, propertyName, alias);
				whereFragment = `${alias}.${columnName} `;

				let valueOperation = operation[property];
				let fieldOperation;
				for (let operationProperty in valueOperation) {
					if (fieldOperation) {
						throw `More than one operation (${fieldOperation}, ${operationProperty}, ...) is defined on field '${alias}.${propertyName}' used in the WHERE clause.`;
					}
					fieldOperation = operationProperty;
				}

				let operatorAndValueFragment;
				let value = valueOperation[fieldOperation];
				if (field instanceof QBooleanField) {
					operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'boolean', embedParameters, parameters);
					if (!operatorAndValueFragment) {
						throw `Unexpected operation '${fieldOperation}' on field '${alias}.${propertyName}' in the WHERE clause.`
					}
				} else if (field instanceof QDateField) {
					operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'Date', embedParameters, parameters, this.sqlAdaptor.dateToDbQuery);
				} else if (field instanceof QNumberField) {
					operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'number', embedParameters, parameters);

				} else if (field instanceof QStringField) {
					operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'string', embedParameters, parameters, this.sanitizeStringValue);
					if (!operatorAndValueFragment) {
						switch (fieldOperation) {
							case '$like':
								if (typeof value != 'string') {
									this.throwValueOnOperationError('string', '$like (LIKE)', alias, propertyName);
								}
								value = this.sanitizeStringValue(value, embedParameters);
								if (!embedParameters) {
									parameters.push(value);
									value = '?';
								}
								operatorAndValueFragment = `LIKE ${value}`;
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

		return whereFragment;
	}

	private getLogicalWhereFragment(
		operation: JSONLogicalOperation,
		nestingPrefix: string,
		joinNodeMap: {[alias: string]: JoinTreeNode},
		embedParameters: boolean = true,
		parameters: any[] = null
	) {
		let operator;
		switch (operation.operator) {
			case '$and':
				operator = 'AND';
				break;
			case '$or':
				operator = 'OR';
				break;
			case '$not':
				operator = 'NOT';
				return `${operator} (${this.getWHEREFragment(<JSONBaseOperation>operation.value, nestingPrefix, joinNodeMap, embedParameters, parameters)})`;
			default:
				throw `Unknown logical operator: ${operation.operator}`;
		}
		let childOperations = <JSONBaseOperation[]>operation.value;
		if (!(childOperations instanceof Array)) {
			throw `Expecting an array of child operations as a value for operator ${operator}, in the WHERE Clause.`;
		}
		let whereFragment = childOperations.map(( childOperation ) => {
			this.getWHEREFragment(childOperation, nestingPrefix, joinNodeMap, embedParameters, parameters);
		}).join(`\n${nestingPrefix}${operator} `);

		return `( ${whereFragment} )`;
	}

	private getComparibleOperatorAndValueFragment<T>(
		fieldOperation: string,
		value: any,
		alias: string,
		propertyName: string,
		typeCheckFunction: ( value: any )=>boolean,
		typeName: string,
		embedParameters: boolean = true,
		parameters: any[] = null,
		conversionFunction?: (
			value: any,
			embedParameters: boolean
		)=>any
	): string {
		let operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters, parameters, conversionFunction);
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
			value = conversionFunction(value, embedParameters);
		}
		if (!embedParameters) {
			parameters.push(value);
			value = '?';
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

	private getCommonOperatorAndValueFragment<T>(
		fieldOperation: string,
		value: any,
		alias: string,
		propertyName: string,
		typeCheckFunction: ( value: any )=>boolean,
		typeName: string,
		embedParameters: boolean = true,
		parameters: any[] = null,
		conversionFunction?: (
			value: any,
			embedParameters: boolean
		)=>any
	): string {
		let sqlOperator;

		switch (fieldOperation) {
			case '$eq':
				sqlOperator = '=';
				if (!typeCheckFunction(value)) {
					this.throwValueOnOperationError(typeName, '$eq (=)', alias, propertyName);
				}
				if (conversionFunction) {
					value = conversionFunction(value, embedParameters);
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
							return conversionFunction(aValue, embedParameters);
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
					value = conversionFunction(value, embedParameters);
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
							return conversionFunction(aValue, embedParameters);
						} else {
							return aValue;
						}
					}
				}).join(', ');
				break;
			default:
				return undefined;
		}

		if (!embedParameters) {
			parameters.push(value);
			value = '?';
		}

		return `${sqlOperator} ${value}`;
	}

	protected getEntityPropertyColumnName(
		qEntity: IQEntity,
		propertyName: string,
		tableAlias: string
	): string {
		let entityName = qEntity.__entityName__;
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		let columnName = MetadataUtils.getPropertyColumnName(propertyName, entityMetadata, tableAlias);
		this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);

		return columnName;
	}

	protected getTableName( qEntity: IQEntity ): string {
		let tableName = qEntity.__entityName__;
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		if (entityMetadata.table) {
			if (!entityMetadata.table.name) {
				throw `Found @Table but not @Table.name for entity: ${tableName}`;
			} else {
				tableName = entityMetadata.table.name;
			}
		} else {
			this.warn(`Did not find @Table.name for first table in FROM clause. Using entity class name.`);
		}

		return tableName;
	}

	private throwValueOnOperationError(
		valueType: string,
		operation: string,
		alias: string,
		propertyName: string
	) {
		throw `Expecting a string value for $eq (=) operation on '${alias}.${propertyName}' used in the WHERE clause.`;
	}

	protected sanitizeStringValue(
		value: string,
		embedParameters: boolean
	): string {
		// FIXME: sanitize the string to prevent SQL Injection attacks.

		if (embedParameters) {
			value = `'${value}'`;
		}
		return value;
	}

	protected booleanTypeCheck(
		valueToCheck: any
	): boolean {
		return typeof valueToCheck === 'boolean';
	}

	protected dateTypeCheck(
		valueToCheck: any
	): boolean {
		// TODO: see if there is a more appropriate way to check serialized Dates
		if (typeof valueToCheck === 'number') {
			valueToCheck = new Date(valueToCheck);
		}
		return valueToCheck instanceof Date;
	}

	protected numberTypeCheck(
		valueToCheck: any
	): boolean {
		return typeof valueToCheck === 'number';
	}

	protected stringTypeCheck(
		valueToCheck: any
	): boolean {
		return typeof valueToCheck === 'string';
	}

	protected addField(
		entityName: string,
		tableName: string,
		propertyName: string,
		columnName: string
	): void {
		this.fieldMap.ensure(entityName, tableName).ensure(propertyName, columnName);
	}

	protected warn(
		warning: string
	): void {
		console.log(warning);
	}

}