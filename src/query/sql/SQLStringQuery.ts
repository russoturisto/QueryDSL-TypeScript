import {PHJsonSQLQuery, JoinType} from "./PHSQLQuery";
import {RelationRecord, JSONRelation, QRelation, JoinTreeNode, ColumnAliases} from "../../core/entity/Relation";
import {IEntity, IQEntity, QEntity} from "../../core/entity/Entity";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {QBooleanField} from "../../core/field/BooleanField";
import {QDateField} from "../../core/field/DateField";
import {QNumberField} from "../../core/field/NumberField";
import {QStringField} from "../../core/field/StringField";
import {JoinColumnConfiguration} from "../../core/entity/metadata/ColumnDecorators";
import {FieldMap} from "./FieldMap";
import {SQLStringWhereBase} from "./SQLStringWhereBase";
import {QueryBridge, QueryBridgeConfiguration, IQueryBridge} from "./QueryBridge";
import {MappedEntityArray} from "../../core/MappedEntityArray";
import {LastObjectTracker} from "./LastObjectTracker";
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

export class SQLStringQuery<IE extends IEntity> extends SQLStringWhereBase<IE> {

	columnAliases: ColumnAliases = new ColumnAliases();
	entityDefaults: EntityDefaults = new EntityDefaults();
	private queryBridge: IQueryBridge;
	private joinTree: JoinTreeNode;

	constructor(
		public phJsonQuery: PHJsonSQLQuery<IE>,
		qEntity: IQEntity,
		qEntityMap: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect,
		performBridging: boolean = true
	) {
		super(qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
		this.queryBridge = new QueryBridge(performBridging, new QueryBridgeConfiguration(), qEntity, qEntityMap);
	}

	getFieldMap(): FieldMap {
		return this.fieldMap;
	}


	/**
	 * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
	 * result set.
	 */
	buildJoinTree(): void {
		let entityName = this.qEntity.__entityName__;
		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTree = this.buildFromJoinTree(entityName, this.phJsonQuery.from, joinNodeMap);
		this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, false, []);
	}

	toSQL(
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		let entityName = this.qEntity.__entityName__;

		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTree = this.buildFromJoinTree(entityName, this.phJsonQuery.from, joinNodeMap);
		let selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, embedParameters, parameters);
		let fromFragment = this.getFROMFragment(null, this.joinTree, embedParameters, parameters);
		let whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinNodeMap, embedParameters, parameters);

		return `SELECT
${selectFragment}
FROM
${fromFragment}
WHERE
${whereFragment}`;
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

		let firstEntity = this.qEntityMap[firstRelation.entityName];
		if (firstEntity != this.qEntity) {
			throw `Unexpected first table in FROM clause: ${firstRelation.entityName}, expecting: ${this.qEntity.__entityName__}`;
		}
		jsonTree = new JoinTreeNode(firstRelation, []);

		let alias = QRelation.getAlias(firstRelation);
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
			let rightNode = new JoinTreeNode(joinRelation, []);
			leftNode.addChildNode(rightNode);

			alias = QRelation.getAlias(joinRelation);
			let rightEntity = this.qEntityMap[joinRelation.entityName];
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
		let qEntity = this.qEntityMap[entityName];
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
		let entityRelationMap = this.entitiesRelationPropertyMap[entityName];

		let tableAlias = QRelation.getAlias(joinTree.jsonRelation);

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
			let fieldKey = `${tableAlias}.${propertyName}`;
			if (entityPropertyTypeMap[propertyName]) {
				let columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
				let columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, selectSqlFragment);
				selectSqlFragment += columnSelect;
			} else if (entityRelationMap[propertyName]) {
				let subSelectClauseFragment = selectClauseFragment[propertyName];
				if (subSelectClauseFragment == null) {
					// For null entity reference, retrieve just the id
					if (entityMetadata.manyToOneMap[propertyName]) {
						let columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
						let columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, selectSqlFragment);
						selectSqlFragment += columnSelect;
						continue;
					} else {
						// Do not retrieve @OneToMay set to null
						continue;
					}
				}
				let childEntityName = entityRelationMap[propertyName].entityName;
				selectSqlFragment += this.getSELECTFragment(entityRelationMap[propertyName].entityName,
					selectSqlFragment, selectClauseFragment[propertyName], joinTree.getChildNode(childEntityName, propertyName), entityDefaults, embedParameters, parameters);
			} else {
				throw `Unexpected property '${propertyName}' on entity '${entityName}' (alias '${tableAlias}') in SELECT clause.`;
			}
		}

		return selectSqlFragment;
	}

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
		let qEntity = this.qEntityMap[currentRelation.entityName];
		let tableName = this.getTableName(qEntity);
		let currentAlias = QRelation.getAlias(currentRelation);

		if (!parentTree) {
			fromFragment += `${tableName} ${currentAlias}`;
		} else {
			let parentRelation = parentTree.jsonRelation;
			let parentAlias = QRelation.getAlias(parentRelation);
			let leftEntity = this.qEntityMap[parentRelation.entityName];

			let rightEntity = this.qEntityMap[currentRelation.entityName];

			let joinTypeString;
			switch (currentRelation.joinType) {
				case JoinType.INNER_JOIN:
					joinTypeString = 'INNER JOIN';
					break;
				case JoinType.LEFT_JOIN:
					joinTypeString = 'LEFT JOIN';
					break;
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
		let parsedResults: any[] = [];
		if (!results || !results.length) {
			return parsedResults;
		}
		parsedResults = [];
		let lastResult;
		results.forEach(( result ) => {
			let parsedResult = this.parseQueryResult(null, null, this.qEntity.__entityName__, this.phJsonQuery.select, this.joinTree, result, [0]);
			if(!lastResult) {
				parsedResults.push(parsedResult);
			} else if(lastResult !== parsedResult) {
				lastResult = parsedResult;
				parsedResults.push(parsedResult);
			}
		});

		return this.queryBridge.bridge(parsedResults, this.phJsonQuery.select);
	}

	protected parseQueryResult(
		parentEntityName: string,
		parentPropertyName: string,
		entityName: string,
		selectClauseFragment: any,
		currentJoinNode: JoinTreeNode,
		resultRow: any,
		nextFieldIndex: number[]
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
		let entityId;

		let entityAlias = QRelation.getAlias(currentJoinNode.jsonRelation);

		let resultObject = new qEntity.__entityConstructor__();
		QRelation.markAsEntity(resultObject);

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

				let columnAlias = this.columnAliases.getAlias(entityAlias, propertyName);
				let defaultValue = this.entityDefaults.getForAlias(entityAlias)[propertyName];

				resultObject[propertyName] = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], dataType, defaultValue);
				this.queryBridge.addProperty(entityAlias, resultObject, dataType, propertyName);
				if (entityMetadata.idProperty == propertyName) {
					entityId = resultObject[propertyName];
				}
			} else if (entityRelationMap[propertyName]) {
				let childSelectClauseFragment = selectClauseFragment[propertyName];
				let relation = qEntity.__entityRelationMap__[propertyName];
				let relationQEntity = this.qEntityMap[relation.entityName];
				let relationEntityMetadata: EntityMetadata = <EntityMetadata><any>relationQEntity.__entityConstructor__;

				if (childSelectClauseFragment == null) {
					if (entityMetadata.manyToOneMap[propertyName]) {
						let columnAlias = this.columnAliases.getAlias(entityAlias, propertyName);
						let relatedEntityId = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], SQLDataType.NUMBER, null);
						let manyToOneStub = {};
						resultObject[propertyName] = manyToOneStub;
						manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
						this.queryBridge.bufferManyToOneStub(currentJoinNode, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
					} else {
						this.queryBridge.bufferOneToManyStub(resultObject, entityName, propertyName);
					}
				} else {
					let childEntityName = entityRelationMap[propertyName].entityName;
					let childJoinNode = currentJoinNode.getChildNode(childEntityName, propertyName);

					let childResultObject = this.parseQueryResult(
						entityName,
						propertyName,
						childEntityName,
						childSelectClauseFragment,
						childJoinNode,
						resultRow,
						nextFieldIndex
					);
					if (entityMetadata.manyToOneMap[propertyName]) {
						resultObject[propertyName] = childResultObject;
						this.queryBridge.bufferManyToOneStub(qEntity, entityMetadata, resultObject, propertyName, childResultObject[relationEntityMetadata.idProperty] );
					} else {

						let childResultsArray = new MappedEntityArray(relationEntityMetadata.idProperty);
						resultObject[propertyName] = childResultsArray;
						childResultsArray.put(childResultObject);
						this.queryBridge.bufferOneToManyStub(resultObject, entityName, propertyName);
					}
				}
			}
			nextFieldIndex[0]++;
		}
		return this.queryBridge.flushEntity(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
	}
}