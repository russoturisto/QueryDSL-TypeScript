import {
	EntityRelationRecord, JSONEntityRelation, JSONRelation
} from "../../core/entity/Relation";
import {IQEntity} from "../../core/entity/Entity";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {FieldMap} from "./FieldMap";
import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {JoinTreeNode} from "../../core/entity/JoinTreeNode";
import {PHJsonCommonSQLQuery} from "./PHSQLQuery";
/**
 * Created by Papa on 8/20/2016.
 */

export enum SQLDialect {
	SQLITE,
	ORACLE
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

	constructor(
		protected phJsonQuery: PHJQ,
		qEntityMapByName: {[alias: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect,
		protected queryResultType: QueryResultType
	) {
		super(qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
	}

	getFieldMap(): FieldMap {
		return this.fieldMap;
	}

	protected abstract buildFromJoinTree<JR extends JSONRelation>(
		joinRelations: JR[],
		joinNodeMap: {[alias: string]: JoinTreeNode},
		entityName?: string
	);

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