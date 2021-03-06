/**
 * Created by Papa on 10/16/2016.
 */
import {
	QRelation, EntityRelationRecord, JSONEntityRelation, JSONRelationType
} from "../../../../core/entity/Relation";
import {EntityDefaults, SQLStringQuery, QueryResultType, SQLDialect} from "../../SQLStringQuery";
import {IEntity, IQEntity} from "../../../../core/entity/Entity";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {
	getObjectResultParser,
	BridgedQueryConfiguration,
	IEntityResultParser
} from "../result/entity/IEntityResultParser";
import {QBooleanField} from "../../../../core/field/BooleanField";
import {QDateField} from "../../../../core/field/DateField";
import {QNumberField} from "../../../../core/field/NumberField";
import {QStringField} from "../../../../core/field/StringField";
import {EntityUtils} from "../../../../core/utils/EntityUtils";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
import {PHJsonEntitySQLQuery} from "../ph/PHEntitySQLQuery";
import {JoinType} from "../../../../core/entity/Joins";
import {IEntityOrderByParser} from "../orderBy/IEntityOrderByParser";
import {EntityOrderByParser} from "../orderBy/EntityOrderByParser";
import {SQLDataType} from "../../../../core/field/Appliable";
import {AliasCache} from "../../../../core/entity/Aliases";
/**
 * Represents SQL String query with Entity tree Select clause.
 */
export class EntitySQLStringQuery<IE extends IEntity> extends SQLStringQuery<PHJsonEntitySQLQuery<IE>> {

	private queryParser: IEntityResultParser;
	protected joinTree: JoinTreeNode;
	orderByParser: IEntityOrderByParser;
	private columnAliases = new AliasCache();

	constructor(
		protected rootQEntity: IQEntity,
		phJsonQuery: PHJsonEntitySQLQuery<IE>,
		qEntityMapByName: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect,
		queryResultType: QueryResultType,
		protected bridgedQueryConfiguration?: BridgedQueryConfiguration
	) {
		super(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType);
		if (bridgedQueryConfiguration && this.bridgedQueryConfiguration.strict !== undefined) {
			throw `"strict" configuration is not yet implemented for QueryResultType.BRIDGED`;
		}
		this.orderByParser = new EntityOrderByParser(phJsonQuery.select, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, this.validator, phJsonQuery.orderBy);
	}

	toSQL(): string {
		let entityName = this.rootQEntity.__entityName__;

		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTree = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap, entityName);
		let selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults);
		let fromFragment = this.getFROMFragment(null, this.joinTree);
		let whereFragment = '';
		let jsonQuery = this.phJsonQuery;
		if (jsonQuery.where) {
			whereFragment = `
WHERE
${this.getWHEREFragment(jsonQuery.where, '')}`;
		}
		let orderByFragment = '';
		if (jsonQuery.orderBy && jsonQuery.orderBy.length) {
			orderByFragment = `
ORDER BY
${this.orderByParser.getOrderByFragment(this.joinTree, this.qEntityMapByAlias)}`;
		}

		return `SELECT
${selectFragment}
FROM
${fromFragment}${whereFragment}${orderByFragment}`;
	}

	/**
	 * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
	 * result set.
	 */
	buildJoinTree(): void {
		let entityName = this.rootQEntity.__entityName__;
		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTree = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap, entityName);
		this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, false, []);
	}

	buildFromJoinTree(
		joinRelations: JSONEntityRelation[],
		joinNodeMap: {[alias: string]: JoinTreeNode},
		entityName: string
	): JoinTreeNode {
		let jsonTree: JoinTreeNode;
		// For entity queries it is possible to have a query with no from clause, in this case
		// make the query entity the root tree node
		if (joinRelations.length < 1) {
			let onlyJsonRelation: JSONEntityRelation = {
				currentChildIndex: 0,
				entityName: entityName,
				fromClausePosition: [],
				joinType: null,
				relationPropertyName: null,
				relationType: JSONRelationType.ENTITY_ROOT,
				rootEntityPrefix: 'r_'
			};
			joinRelations.push(onlyJsonRelation);
		}

		let firstRelation = joinRelations[0];

		switch (firstRelation.relationType) {
			case JSONRelationType.ENTITY_ROOT:
				break;
			case JSONRelationType.SUB_QUERY_ROOT:
			case JSONRelationType.SUB_QUERY_JOIN_ON:
				throw `Entity queries FROM clause cannot contain sub-queries`;
			case JSONRelationType.ENTITY_JOIN_ON:
				throw `Entity queries cannot use JOIN ON`;
			default:
				throw `First table in FROM clause cannot be joined`;
		}

		if (firstRelation.relationType !== JSONRelationType.ENTITY_ROOT) {
			throw `First table in FROM clause cannot be joined`;
		}

		let alias = QRelation.getAlias(firstRelation);
		let firstEntity = QRelation.createRelatedQEntity(firstRelation, this.qEntityMapByName);
		this.qEntityMapByAlias[alias] = firstEntity;
		// In entity queries the first entity must always be the same as the query entity
		if (firstEntity != this.rootQEntity) {
			throw `Unexpected first table in FROM clause: ${firstRelation.entityName}, expecting: ${this.rootQEntity.__entityName__}`;
		}
		jsonTree = new JoinTreeNode(firstRelation, [], null);

		joinNodeMap[alias] = jsonTree;

		for (let i = 1; i < joinRelations.length; i++) {

			let joinRelation = joinRelations[i];
			switch (joinRelation.relationType) {
				case JSONRelationType.ENTITY_ROOT:
					throw `All Entity query tables after the first must be joined`;
				case JSONRelationType.SUB_QUERY_ROOT:
				case JSONRelationType.SUB_QUERY_JOIN_ON:
					throw `Entity queries FROM clause cannot contain sub-queries`;
				case JSONRelationType.ENTITY_JOIN_ON:
					throw `Entity queries cannot use JOIN ON`;
				default:
					break;
			}
			if (!joinRelation.relationPropertyName) {
				throw `Table ${i + 1} in FROM clause is missing relationPropertyName`;
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

	protected getSELECTFragment(
		entityName: string,
		selectSqlFragment: string,
		selectClauseFragment: any,
		joinTree: JoinTreeNode,
		entityDefaults: EntityDefaults,
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		let tableAlias = QRelation.getAlias(joinTree.jsonRelation);
		let qEntity = this.qEntityMapByAlias[tableAlias];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = this.entitiesRelationPropertyMap[entityName];


		let retrieveAllOwnFields: boolean = false;
		let numProperties = 0;
		for (let propertyName in selectClauseFragment) {
			if (propertyName === '*') {
				retrieveAllOwnFields = true;
				delete selectClauseFragment['*'];
			}
			numProperties++;
		}
		//  For {} select causes or if '*' is present, retrieve the entire object
		if (numProperties === 0 || retrieveAllOwnFields) {
			selectClauseFragment = {};
			for (let propertyName in entityPropertyTypeMap) {
				selectClauseFragment[propertyName] = null;
			}
		}

		let defaults = entityDefaults.getForAlias(tableAlias);
		for (let propertyName in selectClauseFragment) {
			let value = selectClauseFragment[propertyName];
			// Skip undefined values
			if (value === undefined) {
				continue;
			} else if (value !== null) {
				defaults[propertyName] = value;
			}
			if (entityPropertyTypeMap[propertyName]) {
				let columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
				let columnSelect = this.getSimpleColumnFragment(value, columnName);
				selectSqlFragment += `${columnSelect} ${this.columnAliases.getFollowingAlias()}`;
			} else if (entityRelationMap[propertyName]) {
				let subSelectClauseFragment = selectClauseFragment[propertyName];
				if (subSelectClauseFragment == null) {
					// For null entity reference, retrieve just the id
					if (entityMetadata.manyToOneMap[propertyName]) {
						let columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
						let columnSelect = this.getSimpleColumnFragment(value, columnName);
						selectSqlFragment += `${columnSelect} ${this.columnAliases.getFollowingAlias()}`;
						continue;
					} else {
						// Do not retrieve @OneToMay set to null
						continue;
					}
				}
				let childEntityName = entityRelationMap[propertyName].entityName;
				selectSqlFragment += this.getSELECTFragment(entityRelationMap[propertyName].entityName,
					selectSqlFragment, selectClauseFragment[propertyName], joinTree.getEntityRelationChildNode(childEntityName, propertyName), entityDefaults, embedParameters, parameters);
			} else {
				throw `Unexpected property '${propertyName}' on entity '${entityName}' (alias '${tableAlias}') in SELECT clause.`;
			}
		}

		return selectSqlFragment;
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
					throw `Full Joins are not allowed in Entity queries.`;
				case JoinType.INNER_JOIN:
					joinTypeString = 'INNER JOIN';
					break;
				case JoinType.LEFT_JOIN:
					joinTypeString = 'LEFT JOIN';
					break;
				case JoinType.RIGHT_JOIN:
					throw `Right Joins are not allowed in Entity queries.`;
				default:
					throw `Unsupported join type: ${currentRelation.joinType}`;
			}

			let rightEntityJoinColumn, leftColumn;
			let leftEntityMetadata: EntityMetadata = <EntityMetadata><any>leftEntity.__entityConstructor__;
			let rightEntityMetadata: EntityMetadata = <EntityMetadata><any>rightEntity.__entityConstructor__;
			let errorPrefix = 'Error building FROM: ';
			switch (currentRelation.relationType) {
				case JSONRelationType.ENTITY_SCHEMA_RELATION:
					fromFragment += this.getEntitySchemaRelationFromJoin(leftEntity, rightEntity,
						<JSONEntityRelation>currentRelation, parentRelation, currentAlias, parentAlias,
						tableName, joinTypeString, errorPrefix);
					break;
				default:
					throw `Only Entity schema relations are allowed in Entity query FROM clause.`;
			}
		}
		for (let i = 0; i < currentTree.childNodes.length; i++) {
			let childTreeNode = currentTree.childNodes[i];
			fromFragment += this.getFROMFragment(currentTree, childTreeNode, embedParameters, parameters);
		}

		return fromFragment;
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
	parseQueryResults(
		results: any[]
	): any[] {
		this.queryParser = getObjectResultParser(this.queryResultType, this.bridgedQueryConfiguration, this.rootQEntity, this.qEntityMapByName);
		let parsedResults: any[] = [];
		if (!results || !results.length) {
			return parsedResults;
		}
		parsedResults = [];
		let lastResult;
		results.forEach(( result ) => {
			let entityAlias = QRelation.getAlias(this.joinTree.jsonRelation);
			this.columnAliases.reset();
			let parsedResult = this.parseQueryResult(this.rootQEntity.__entityName__, this.phJsonQuery.select, entityAlias, this.joinTree, result, [0]);
			if (!lastResult) {
				parsedResults.push(parsedResult);
			} else if (lastResult !== parsedResult) {
				lastResult = parsedResult;
				parsedResults.push(parsedResult);
			}
			this.queryParser.flushRow();
		});

		return this.queryParser.bridge(parsedResults, this.phJsonQuery.select);
	}

	protected parseQueryResult(
		entityName: string,
		selectClauseFragment: any,
		entityAlias: string,
		currentJoinNode: JoinTreeNode,
		resultRow: any,
		nextFieldIndex: number[]
	): any {
		// Return blanks, primitives and Dates directly
		if (!resultRow || !(resultRow instanceof Object) || resultRow instanceof Date) {
			return resultRow;
		}

		let qEntity = this.qEntityMapByAlias[entityAlias];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = this.entitiesRelationPropertyMap[entityName];

		let resultObject = this.queryParser.addEntity(entityAlias, qEntity);

		let entityId;
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

				let columnAlias = this.columnAliases.getFollowingAlias();
				let defaultValue = this.entityDefaults.getForAlias(entityAlias)[propertyName];

				let propertyValue = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], dataType, defaultValue);
				this.queryParser.addProperty(entityAlias, resultObject, dataType, propertyName, propertyValue);
				if (entityMetadata.idProperty == propertyName) {
					entityId = propertyValue;
				}
			} else if (entityRelationMap[propertyName]) {
				let childSelectClauseFragment = selectClauseFragment[propertyName];
				let relation = qEntity.__entityRelationMap__[propertyName];

				if (childSelectClauseFragment === null) {
					if (entityMetadata.manyToOneMap[propertyName]) {
						let relationGenericQEntity = this.qEntityMapByName[(<any>relation).entityName];
						let relationEntityMetadata: EntityMetadata = <EntityMetadata><any>relationGenericQEntity.__entityConstructor__;
						let columnAlias = this.columnAliases.getFollowingAlias();
						let relatedEntityId = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], SQLDataType.NUMBER, null);
						if (EntityUtils.exists(relatedEntityId)) {
							this.queryParser.bufferManyToOneStub(entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationGenericQEntity, relationEntityMetadata, relatedEntityId);
						} else {
							this.queryParser.bufferBlankManyToOneStub(entityAlias, resultObject, propertyName, relationEntityMetadata);
						}
					} else {
						this.queryParser.bufferOneToManyStub(entityName, propertyName);
					}
				} else {
					let childEntityName = entityRelationMap[propertyName].entityName;
					let childJoinNode = currentJoinNode.getEntityRelationChildNode(childEntityName, propertyName);
					let childEntityAlias = QRelation.getAlias(currentJoinNode.jsonRelation);
					let relationQEntity = this.qEntityMapByAlias[childEntityAlias];
					let relationEntityMetadata: EntityMetadata = <EntityMetadata><any>relationQEntity.__entityConstructor__;

					let childResultObject = this.parseQueryResult(
						childEntityName,
						childSelectClauseFragment,
						childEntityAlias,
						childJoinNode,
						resultRow,
						nextFieldIndex
					);
					if (entityMetadata.manyToOneMap[propertyName]) {
						if (!EntityUtils.isBlank(childResultObject)) {
							this.queryParser.bufferManyToOneObject(entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject);
						} else {
							this.queryParser.bufferBlankManyToOneObject(entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata);
						}
					} else {
						if (!EntityUtils.isBlank(childResultObject)) {
							this.queryParser.bufferOneToManyCollection(entityAlias, resultObject, entityName, propertyName, relationEntityMetadata, childResultObject);
						} else {
							this.queryParser.bufferBlankOneToMany(entityAlias, resultObject, entityName, propertyName, relationEntityMetadata, childResultObject);
						}
					}
				}
			}
			nextFieldIndex[0]++;
		}

		return this.queryParser.flushEntity(
			entityAlias,
			qEntity,
			entityMetadata,
			selectClauseFragment,
			entityPropertyTypeMap,
			entityRelationMap,
			entityId,
			resultObject
		);
	}

}