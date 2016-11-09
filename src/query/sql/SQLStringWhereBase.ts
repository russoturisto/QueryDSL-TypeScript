import {IQEntity} from "../../core/entity/Entity";
import {ISQLAdaptor, getSQLAdaptor, SqlValueProvider} from "./adaptor/SQLAdaptor";
import {SQLDialect} from "./SQLStringQuery";
import {EntityRelationRecord} from "../../core/entity/Relation";
import {
	JSONBaseOperation, OperationCategory, JSONValueOperation,
	JSONFunctionOperation
} from "../../core/operation/Operation";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {FieldMap} from "./FieldMap";
import {MetadataUtils} from "../../core/entity/metadata/MetadataUtils";
import {JSONLogicalOperation} from "../../core/operation/LogicalOperation";
import {IValidator, getValidator} from "../../validation/Validator";
import {JSONClauseField, JSONClauseObjectType, JSONClauseObject} from "../../core/field/Appliable";
import {PHJsonFieldQSLQuery} from "./query/ph/PHFieldSQLQuery";
import {FieldSQLStringQuery} from "./query/string/FieldSQLStringQuery";
import {MappedSQLStringQuery} from "./query/string/MappedSQLStringQuery";
import {PHJsonMappedQSLQuery} from "./query/ph/PHMappedSQLQuery";
/**
 * Created by Papa on 10/2/2016.
 */

export enum ClauseType {
	MAPPED_SELECT_CLAUSE,
	NON_MAPPED_SELECT_CLAUSE,
	WHERE_CLAUSE,
	FUNCTION_CALL
}

export abstract class SQLStringWhereBase implements SqlValueProvider {

	protected fieldMap: FieldMap = new FieldMap();
	protected qEntityMapByAlias: {[entityAlias: string]: IQEntity} = {};
	protected sqlAdaptor: ISQLAdaptor;
	protected validator: IValidator;
	protected parameterReferences: string[];

	constructor(
		protected qEntityMapByName: {[entityName: string]: IQEntity},
		protected entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		protected entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		protected dialect: SQLDialect
	) {
		this.sqlAdaptor = getSQLAdaptor(this, dialect);
		this.validator = getValidator(this.qEntityMapByName);
	}

	protected getWHEREFragment(
		operation: JSONBaseOperation,
		nestingPrefix: string
	): string {
		let whereFragment = '';
		if (!operation) {
			throw `An operation is missing in WHERE or HAVING clause`;
		}
		nestingPrefix = `${nestingPrefix}\t`;

		switch (operation.category) {
			case OperationCategory.LOGICAL:
				return this.getLogicalWhereFragment(<JSONLogicalOperation>operation, nestingPrefix);
			case OperationCategory.BOOLEAN:
			case OperationCategory.DATE:
			case OperationCategory.NUMBER:
			case OperationCategory.STRING:
				let valueOperation = <JSONValueOperation>operation;
				let lValue = valueOperation.lValue;
				let rValue = valueOperation.rValue;
				let lValueSql = this.getFieldValue(valueOperation.lValue, ClauseType.WHERE_CLAUSE);
				let rValueSql = this.getFieldValue(valueOperation.rValue, ClauseType.WHERE_CLAUSE);
				let rValueWithOperator = this.applyOperator(valueOperation.operator, rValueSql);
				whereFragment += `${lValueSql}${rValueWithOperator}`;
				break;
			case OperationCategory.FUNCTION:
				let functionOperation = <JSONFunctionOperation><any>operation;
				whereFragment = this.getFieldValue(functionOperation.object, ClauseType.WHERE_CLAUSE);
				// exists function and maybe others
				break;
		}

		return whereFragment;
	}

	private getLogicalWhereFragment(
		operation: JSONLogicalOperation,
		nestingPrefix: string
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
				return ` ${operator} (${this.getWHEREFragment(<JSONBaseOperation>operation.value, nestingPrefix)})`;
			default:
				throw `Unknown logical operator: ${operation.operator}`;
		}
		let childOperations = <JSONBaseOperation[]>operation.value;
		if (!(childOperations instanceof Array)) {
			throw `Expecting an array of child operations as a value for operator ${operator}, in the WHERE Clause.`;
		}
		let whereFragment = childOperations.map(( childOperation ) => {
			this.getWHEREFragment(childOperation, nestingPrefix);
		}).join(`\n${nestingPrefix}${operator} `);

		return `( ${whereFragment} )`;
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

	getFunctionCallValue(
		rawValue: any
	): string {
		return this.getFieldValue(<JSONClauseField>rawValue, ClauseType.FUNCTION_CALL);
	}

	getFieldValue(
		clauseField: JSONClauseObject | JSONClauseField [] | PHJsonFieldQSLQuery,
		clauseType: ClauseType,
		defaultCallback: () => string = null
	): string {
		let columnName;
		if (!clauseField) {
			throw `Missing Clause Field definition`;
		}
		if (clauseField instanceof Array) {
			return clauseField
				.map(( clauseFieldMember ) => this.getFieldValue(clauseFieldMember, clauseType, defaultCallback))
				.join(', ');
		}
		if (!clauseField.objectType) {
			throw `Type is not defined in JSONClauseField`;
		}
		let aField = <JSONClauseField>clauseField;
		let aValue;
		switch (clauseField.objectType) {
			case JSONClauseObjectType.FIELD_FUNCTION:
				aValue = aField.value;
				if (this.isParameterReference(aValue)) {
					this.parameterReferences.push(aValue);
					aValue = this.sqlAdaptor.getParameterReference(this.parameterReferences, aValue);
				} else {
					aValue = this.getFieldValue(aValue, ClauseType.FUNCTION_CALL, defaultCallback);
				}
				this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(aField, aValue, this.qEntityMapByAlias);
				this.validator.addFunctionAlias(aField.fieldAlias);
				break;
			case JSONClauseObjectType.DISTINCT_FUNCTION:
				throw `Distinct function cannot be nested.`;
			case JSONClauseObjectType.EXISTS_FUNCTION:
				if (clauseType !== ClauseType.WHERE_CLAUSE) {
					throw `Exists can only be used as a top function in a WHERE clause.`;
				}
				let mappedSqlQuery = new MappedSQLStringQuery(<PHJsonMappedQSLQuery>aField.value, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
				return `EXISTS(${mappedSqlQuery.toSQL()})`;
			case <any>JSONClauseObjectType.FIELD:
				let qEntity = this.qEntityMapByAlias[aField.tableAlias];
				this.validator.validateReadQEntityProperty(aField.propertyName, qEntity, aField.fieldAlias);
				columnName = this.getEntityPropertyColumnName(qEntity, aField.propertyName, aField.tableAlias);
				this.addField(qEntity.__entityName__, this.getTableName(qEntity), aField.propertyName, columnName);
				return this.getComplexColumnFragment(aField, columnName);
			case JSONClauseObjectType.FIELD_QUERY:
				let jsonFieldSqlQuery: PHJsonFieldQSLQuery = aField.fieldSubQuery;
				let fieldSqlQuery = new FieldSQLStringQuery(jsonFieldSqlQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
				fieldSqlQuery.addQEntityMapByAlias(this.qEntityMapByAlias);
				this.validator.addSubQueryAlias(aField.fieldAlias);
				return `(${fieldSqlQuery.toSQL()})`;
			case JSONClauseObjectType.MANY_TO_ONE_RELATION:
				this.validator.validateReadQEntityManyToOneRelation(aField.propertyName, qEntity, aField.fieldAlias);
				columnName = this.getEntityManyToOneColumnName(qEntity, aField.propertyName, aField.tableAlias);
				this.addField(qEntity.__entityName__, this.getTableName(qEntity), aField.propertyName, columnName);
				return this.getComplexColumnFragment(aField, columnName);
			// must be a nested object
			default:
				if (clauseType !== ClauseType.MAPPED_SELECT_CLAUSE) {
					`Nested objects only allowed in the mapped SELECT clause.`;
				}
				return defaultCallback();
		}
	}

	protected isParameterReference( value: any ) {
		if (value === null) {
			return false;
		}
		if (value === undefined || value === '' || value === NaN) {
			throw `Invalid query value: ${value}`;
		}
		switch (typeof value) {
			case "boolean":
			case "number":
				throw `Unexpected primitive isntance, expecting parameter alias.`;
			case "string":
				return true;
		}
		if (value instanceof Date) {
			throw `Unexpected date instance, expecting parameter alias.`;
		}
		return false;
	}

	protected getSimpleColumnFragment(
		value: JSONClauseField,
		columnName: string
	): string {
		return `${value.tableAlias}.${columnName}`;
	}

	protected getComplexColumnFragment(
		value: JSONClauseField,
		columnName: string
	): string {
		let selectSqlFragment = `${value.tableAlias}.${columnName}`;
		selectSqlFragment = this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(value, selectSqlFragment, this.qEntityMapByAlias);
		return selectSqlFragment;
	}

	protected getEntityManyToOneColumnName(
		qEntity: IQEntity,
		propertyName: string,
		tableAlias: string
	): string {
		let entityName = qEntity.__entityName__;
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;

		let columnName = MetadataUtils.getJoinColumnName(propertyName, entityMetadata, tableAlias);
		this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);

		return columnName;
	}

	applyOperator(
		operator: string,
		rValue: string
	): string {
		switch (operator) {
			case "$eq":
				return ` = ${rValue}`;
			case "$gt":
				return ` > ${rValue}`;
			case "$gte":
				return ` >= ${rValue}`;
			case "$isNotNull":
				return ` IS NOT NULL`;
			case "$isNull":
				return ` IS NULL`;
			case "$in":
				return ` IN (${rValue})`;
			case "$lt":
				return ` < ${rValue}`;
			case "$lte":
				return ` <= ${rValue}`;
			case "$ne":
				return ` != ${rValue}`;
			case "$nin":
				return ` NOT IN (${rValue})`;
			case "$like":
				return ` LIKE ${rValue}`;
			default:
				throw `Unsupported operator ${operator}`;
		}
	}

}