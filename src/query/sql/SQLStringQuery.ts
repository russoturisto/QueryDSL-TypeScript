import {
	EntityRelationRecord, JSONEntityRelation, QRelation, JSONRelationType,
	JSONRelation
} from "../../core/entity/Relation";
import {IEntity, IQEntity} from "../../core/entity/Entity";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {FieldMap} from "./FieldMap";
import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {JSONFieldInOrderBy} from "../../core/field/FieldInOrderBy";
import {IOrderByParser, getOrderByParser} from "./query/orderBy/IOrderByParser";
import {MetadataUtils} from "../../core/entity/metadata/MetadataUtils";
import {FieldColumnAliases, getNextRootEntityName} from "../../core/entity/Aliases";
import {JoinTreeNode} from "../../core/entity/JoinTreeNode";
import {PHJsonCommonSQLQuery} from "./PHSQLQuery";
import {PHJsonMappedQSLQuery} from "./query/ph/PHMappedSQLQuery";
import {JSONClauseField} from "../../core/field/Appliable";
import {JoinType} from "../../core/entity/Joins";
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

export class EntityDefaults {
	map: {[alias: string]: {[property: string]: any}} = {};

	getForAlias( alias: string ) {
		let defaultsForAlias = this.map[alias];
		if (!defaultsForAlias) {
			defaultsForAlias = {};
			this.map[alias] = defaultsForAlias;
		}
		return defaultsForAlias;
	}
}

export enum QueryResultType {
	// Ordered query result with bridging for all MtOs and OtM
	ENTITY_BRIDGED,
		// A flat array of values, returned by a on object select
		// Not supporting, requires support for order by (with field aliases) which is not currently implemented
		// ENTITY_FLATTENED,
		// Ordered query result, with objects grouped hierarchically by entity
	ENTITY_HIERARCHICAL,
		// A flat array of objects, returned by a regular join
		// Not supporting, requires support for order by (with field aliases) which is not currently implemented
		// ENTITY_PLAIN,
		// Ordered query result, with objects grouped hierarchically by mapping
	MAPPED_HIERARCHICAL,
		// A flat array of objects, returned by a mapped query
		// Not supporting, please use flat query
		// MAPPED_PLAIN,
		// Flat array query result, with no forced ordering or grouping
	FLAT,
		// A single field query result, with no forced ordering or grouping
	FIELD,
		// Raw result, returned by a SQL string query
	RAW
}

/**
 * String based SQL query.
 */
export abstract class SQLStringQuery<PHJQ extends PHJsonCommonSQLQuery> extends SQLStringWhereBase {

	protected entityDefaults: EntityDefaults = new EntityDefaults();
	protected joinTree: JoinTreeNode;
	protected orderByParser: IOrderByParser;
	protected embedParameters = false;
	protected parameters = [];

	constructor(
		protected phJsonQuery: PHJsonCommonSQLQuery,
		qEntityMapByName: {[alias: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect,
		protected queryResultType: QueryResultType
	) {
		super(qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
		this.orderByParser = getOrderByParser(queryResultType, rootQEntity, phJsonQuery.select, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, phJsonQuery.orderBy);
	}

	getFieldMap(): FieldMap {
		return this.fieldMap;
	}

	protected abstract buildFromJoinTree<JR extends JSONRelation>(
		joinRelations: JR[],
		joinNodeMap: {[alias: string]: JoinTreeNode},
		entityName?: string
	);

	toSQL(): string {
		let entityName = this.rootQEntity.__entityName__;

		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTree = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap, entityName);
		let selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults);
		let fromFragment = this.getFROMFragment(null, this.joinTree, embedParameters, parameters);
		let whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinNodeMap, embedParameters, parameters);
		let orderByFragment = this.getOrderByFragment(this.phJsonQuery.orderBy);

		return `SELECT
${selectFragment}
FROM
${fromFragment}
WHERE
${whereFragment}
ORDER BY
  ${orderByFragment}`;
	}

	protected abstract getSELECTFragment(
		entityName: string,
		selectSqlFragment: string,
		selectClauseFragment: any,
		joinTree: JoinTreeNode,
		entityDefaults: EntityDefaults
	): string;

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
		selectSqlFragment = this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(value, selectSqlFragment, this.qEntityMapByAlias, this.embedParameters, this.parameters);
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

	/**
	 * If bridging is not applied:
	 *
	 * Entities get merged if they are right next to each other in the result set.  If they are not, they are
	 * treated as separate entities - hence, your sort order matters.
	 *
	 * If bridging is applied - all entities get merged - your sort order does not matter.  Might as well disallow
	 * sort order for bridged queries (or re-sort in memory)?
	 *
	 * @param results
	 * @returns {any[]}
	 */
	protected abstract parseQueryResults(
		results: any[],
		queryResultType: QueryResultType,
		bridgedQueryConfiguration?: any
	): any[];

	protected abstract getOrderByFragment(
		orderBy?: JSONFieldInOrderBy[]
	): string;

	isPrimitive( value: any ) {
		if (value === null || value === undefined || value === '' || value === NaN) {
			throw `Invalid query value: ${value}`;
		}
		switch (typeof value) {
			case "boolean":
			case "number":
			case "string":
				return true;
		}
		if (value instanceof Date) {
			return true;
		}
		return false;
	}

	parsePrimitive(
		primitiveValue: any
	): string {
		if (this.embedParameters) {
			this.parameters.push(primitiveValue);
			return this.sqlAdaptor.getParameterSymbol();
		}
		switch (typeof primitiveValue) {
			case "boolean":
			case "number":
			case "string":
				return '' + primitiveValue;
		}
		if (primitiveValue instanceof Date) {
			return this.sqlAdaptor.dateToDbQuery(primitiveValue);
		}
		throw `Cannot parse a non-primitive value`;
	}

	protected getEntitySchemaRelationFromJoin(
		leftEntity: IQEntity,
		rightEntity: IQEntity,
		entityRelation: JSONEntityRelation,
		parentRelation: JSONRelation,
		currentAlias: string,
		parentAlias: string,
		tableName: string,
		joinTypeString: string,
		errorPrefix: string
	): string {

		let rightEntityJoinColumn, leftColumn;
		let leftEntityMetadata: EntityMetadata = <EntityMetadata><any>leftEntity.__entityConstructor__;
		let rightEntityMetadata: EntityMetadata = <EntityMetadata><any>rightEntity.__entityConstructor__;

		if (rightEntityMetadata.manyToOneMap[entityRelation.relationPropertyName]) {
			rightEntityJoinColumn = this.getEntityManyToOneColumnName(rightEntity, entityRelation.relationPropertyName, parentAlias);

			if (!leftEntityMetadata.idProperty) {
				throw `${errorPrefix} Could not find @Id for right entity of join to table  '${parentRelation.entityName}.${entityRelation.relationPropertyName}'`;
			}
			leftColumn = this.getEntityPropertyColumnName(leftEntity, leftEntityMetadata.idProperty, currentAlias);
		} else if (rightEntityMetadata.oneToManyMap[entityRelation.relationPropertyName]) {
			let rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[entityRelation.relationPropertyName];
			let mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
			if (!mappedByLeftEntityProperty) {
				throw `${errorPrefix} Could not find @OneToMany.mappedBy for relation '${parentRelation.entityName}.${entityRelation.relationPropertyName}'.`;
			}
			leftColumn = this.getEntityManyToOneColumnName(leftEntity, mappedByLeftEntityProperty, currentAlias);

			if (!rightEntityMetadata.idProperty) {
				throw `${errorPrefix} Could not find @Id for right entity of join to table '${entityRelation.entityName}' `;
			}
			rightEntityJoinColumn = this.getEntityPropertyColumnName(rightEntity, rightEntityMetadata.idProperty, parentAlias);
		} else {
			throw `${errorPrefix} Relation '${parentRelation.entityName}.${entityRelation.relationPropertyName}' for table (${tableName}) is not listed as @ManyToOne or @OneToMany`;
		}
		let fromFragment = `\t${joinTypeString} ${tableName} ${currentAlias}`;
		fromFragment += `\t\tON ${parentAlias}.${rightEntityJoinColumn} = ${currentAlias}.${leftColumn}`;

		return fromFragment;
	}

}