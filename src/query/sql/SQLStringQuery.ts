import {PHJsonCommonSQLQuery, JoinType} from "./PHSQLQuery";
import {RelationRecord, JSONRelation, QRelation} from "../../core/entity/Relation";
import {IEntity, IQEntity} from "../../core/entity/Entity";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {FieldMap} from "./FieldMap";
import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {JSONFieldInOrderBy} from "../../core/field/FieldInOrderBy";
import {IOrderByParser, getOrderByParser} from "./query/orderBy/IOrderByParser";
import {MetadataUtils} from "../../core/entity/metadata/MetadataUtils";
import {ColumnAliases} from "../../core/entity/Aliases";
import {JoinTreeNode} from "../../core/entity/JoinTreeNode";
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
	BRIDGED,
		// A flat array of values, returned by a regular join
	FLAT,
		// A flat array of values, returned by a on object select
	FLATTENED,
		// Ordered query result, with objects grouped hierarchically by entity
	HIERARCHICAL,
		// A mapped array of values, returned by a regular join
	MAPPED,
		// Plain query result, with no forced ordering or grouping
	PLAIN,
		// Raw result, returned by a SQL string query
	RAW
}

/**
 * String based SQL query.
 */
export abstract class SQLStringQuery<IE extends IEntity> extends SQLStringWhereBase<IE> {

	protected columnAliases: ColumnAliases = new ColumnAliases();
	protected entityDefaults: EntityDefaults = new EntityDefaults();
	protected joinTree: JoinTreeNode;
	protected orderByParser: IOrderByParser;

	constructor(
		protected phJsonQuery: PHJsonCommonSQLQuery<IE>,
		rootQEntity: IQEntity,
		qEntityMapByName: {[alias: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect,
		protected queryResultType: QueryResultType
	) {
		super(rootQEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
		this.orderByParser = getOrderByParser(queryResultType, rootQEntity, phJsonQuery.select, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, phJsonQuery.orderBy);
	}

	getFieldMap(): FieldMap {
		return this.fieldMap;
	}

	/**
	 * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
	 * result set.
	 */
	buildJoinTree(): void {
		let entityName = this.rootQEntity.__entityName__;
		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTree = this.buildFromJoinTree(entityName, this.phJsonQuery.from, joinNodeMap);
		this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, false, []);
	}

	toSQL(
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		let entityName = this.rootQEntity.__entityName__;

		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTree = this.buildFromJoinTree(entityName, this.phJsonQuery.from, joinNodeMap);
		let selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, embedParameters, parameters);
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

	buildFromJoinTree(
		entityName: string,
		joinRelations: JSONRelation[],
		joinNodeMap: {[alias: string]: JoinTreeNode}
	): JoinTreeNode {
		let jsonTree: JoinTreeNode;
		if (joinRelations.length < 1) {
			let onlyJsonRelation: JSONRelation = {
				fromClausePosition: [],
				entityName: entityName,
				joinType: null,
				relationPropertyName: null
			};
			joinRelations.push(onlyJsonRelation);
		}

		let firstRelation = joinRelations[0];

		if (firstRelation.relationPropertyName || firstRelation.joinType || firstRelation.fromClausePosition.length > 0) {
			throw `First table in FROM clause cannot be joined`;
		}

		let alias = QRelation.getAlias(firstRelation);
		let firstEntity = QRelation.createRelatedQEntity(firstRelation, this.qEntityMapByName);
		this.qEntityMapByAlias[alias] = firstEntity;
		if (firstEntity != this.rootQEntity) {
			throw `Unexpected first table in FROM clause: ${firstRelation.entityName}, expecting: ${this.rootQEntity.__entityName__}`;
		}
		jsonTree = new JoinTreeNode(firstRelation, [], null);

		joinNodeMap[alias] = jsonTree;

		for (let i = 1; i < joinRelations.length; i++) {
			let joinRelation = joinRelations[i];
			if (!joinRelation.relationPropertyName) {
				throw `Table ${i + 1} in FROM clause is missing relationPropertyName`;
			}
			if (!joinRelation.joinType) {
				throw `Table ${i + 1} in FROM clause is missing joinType`;
			}
			let parentAlias = QRelation.getParentAlias(joinRelation);
			if (!joinNodeMap[parentAlias]) {
				throw `Missing parent entity for alias ${parentAlias}, on table ${i + 1} in FROM clause`;
			}
			let leftNode = joinNodeMap[parentAlias];
			let rightNode = new JoinTreeNode(joinRelation, [], leftNode);
			leftNode.addChildNode(rightNode);

			alias = QRelation.getAlias(joinRelation);
			let rightEntity = QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
			this.qEntityMapByAlias[alias] = rightEntity;
			if (!rightEntity) {
				throw `Could not find entity ${joinRelation.entityName} for table ${i + 1} in FROM clause`;
			}
			if (joinNodeMap[alias]) {
				throw `Alias '${alias}' used more than once in the FROM clause.`;
			}
			joinNodeMap[alias] = rightNode;
		}

		return jsonTree;
	}

	protected abstract getSELECTFragment(
		entityName: string,
		selectSqlFragment: string,
		selectClauseFragment: any,
		joinTree: JoinTreeNode,
		entityDefaults: EntityDefaults,
		embedParameters?: boolean,
		parameters?: any[]
	): string;

	protected getColumnSelectFragment(
		propertyName: string,
		tableAlias: string,
		columnName: string,
		existingSelectFragment: string
	): string {
		let columnAlias = this.columnAliases.addAlias(tableAlias, propertyName);
		let columnSelect = `${tableAlias}.${columnName} as ${columnAlias}\n`;

		if (existingSelectFragment) {
			columnSelect = `\t, ${columnSelect}`;
		} else {
			columnSelect = `\t${columnSelect}`;
		}

		return columnSelect;
	}

	private getFROMFragment(
		parentTree: JoinTreeNode,
		currentTree: JoinTreeNode,
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		let fromFragment = '\t';
		let currentRelation = currentTree.jsonRelation;
		let currentAlias = QRelation.getAlias(currentRelation);
		let qEntity = this.qEntityMapByAlias[currentAlias];
		let tableName = this.getTableName(qEntity);

		if (!parentTree) {
			fromFragment += `${tableName} ${currentAlias}`;
		} else {
			let parentRelation = parentTree.jsonRelation;
			let parentAlias = QRelation.getAlias(parentRelation);
			let leftEntity = this.qEntityMapByAlias[parentAlias];

			let rightEntity = this.qEntityMapByAlias[currentAlias];

			let joinTypeString;
			switch (currentRelation.joinType) {
				case JoinType.FULL_JOIN:
					if (this.queryResultType !== QueryResultType.FLAT) {
						throw `Full Joins only allowed in flat queries`;
					}
					joinTypeString = 'FULL JOIN';
					break;
				case JoinType.INNER_JOIN:
					joinTypeString = 'INNER JOIN';
					break;
				case JoinType.LEFT_JOIN:
					joinTypeString = 'LEFT JOIN';
					break;
				case JoinType.RIGHT_JOIN:
					if (this.queryResultType !== QueryResultType.FLAT) {
						throw `Full Joins only allowed in flat queries`;
					}
					joinTypeString = 'RIGHT JOIN';
				default:
					throw `Unsupported join type: ${currentRelation.joinType}`;
			}
			// FIXME: figure out why the switch statement above quit working
			/*			if (joinRelation.joinType === <number>JoinType.INNER_JOIN) {
			 joinTypeString = 'INNER JOIN';
			 } else if (joinRelation.joinType === <number>JoinType.LEFT_JOIN) {
			 joinTypeString = 'LEFT JOIN';
			 } else {
			 throw `Unsupported join type: ${joinRelation.joinType}`;
			 }*/

			let rightEntityJoinColumn, leftColumn;
			let leftEntityMetadata: EntityMetadata = <EntityMetadata><any>leftEntity.__entityConstructor__;
			let rightEntityMetadata: EntityMetadata = <EntityMetadata><any>rightEntity.__entityConstructor__;
			let errorPrefix = 'Error building FROM: ';

			if (rightEntityMetadata.manyToOneMap[currentRelation.relationPropertyName]) {
				rightEntityJoinColumn = this.getEntityManyToOneColumnName(rightEntity, currentRelation.relationPropertyName, parentAlias);

				if (!leftEntityMetadata.idProperty) {
					throw `${errorPrefix} Could not find @Id for right entity of join to table  '${parentRelation.entityName}.${currentRelation.relationPropertyName}'`;
				}
				leftColumn = this.getEntityPropertyColumnName(leftEntity, leftEntityMetadata.idProperty, currentAlias);
			} else if (rightEntityMetadata.oneToManyMap[currentRelation.relationPropertyName]) {
				let rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[currentRelation.relationPropertyName];
				let mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
				if (!mappedByLeftEntityProperty) {
					throw `${errorPrefix} Could not find @OneToMany.mappedBy for relation '${parentRelation.entityName}.${currentRelation.relationPropertyName}'.`;
				}
				leftColumn = this.getEntityManyToOneColumnName(leftEntity, mappedByLeftEntityProperty, currentAlias);

				if (!rightEntityMetadata.idProperty) {
					throw `${errorPrefix} Could not find @Id for right entity of join to table '${currentRelation.entityName}' `;
				}
				rightEntityJoinColumn = this.getEntityPropertyColumnName(rightEntity, rightEntityMetadata.idProperty, parentAlias);
			} else {
				throw `${errorPrefix} Relation '${parentRelation.entityName}.${currentRelation.relationPropertyName}' for table (${tableName}) is not listed as @ManyToOne or @OneToMany`;
			}
			fromFragment += `\t${joinTypeString} ${tableName} ${currentAlias}`;
			// TODO: add support for custom JOIN ON clauses
			fromFragment += `\t\tON ${parentAlias}.${rightEntityJoinColumn} = ${currentAlias}.${leftColumn}`;
		}
		for (let i = 0; i < currentTree.childNodes.length; i++) {
			let childTreeNode = currentTree.childNodes[i];
			fromFragment += this.getFROMFragment(currentTree, childTreeNode, embedParameters, parameters);
		}

		return fromFragment;
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

}