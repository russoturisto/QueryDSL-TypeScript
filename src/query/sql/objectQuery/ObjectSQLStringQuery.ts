/**
 * Created by Papa on 10/16/2016.
 */
import {QRelation, RelationRecord} from "../../../core/entity/Relation";
import {EntityDefaults, SQLStringQuery, SQLDataType, QueryResultType, SQLDialect} from "../SQLStringQuery";
import {IEntity, IQEntity} from "../../../core/entity/Entity";
import {EntityMetadata} from "../../../core/entity/EntityMetadata";
import {getObjectQueryParser, BridgedQueryConfiguration, IQueryParser} from "./resultParser/IQueryParser";
import {QBooleanField} from "../../../core/field/BooleanField";
import {QDateField} from "../../../core/field/DateField";
import {QNumberField} from "../../../core/field/NumberField";
import {QStringField} from "../../../core/field/StringField";
import {EntityUtils} from "../../../core/utils/EntityUtils";
import {JSONFieldInOrderBy} from "../../../core/field/FieldInOrderBy";
import {PHJsonSQLQuery} from "../PHSQLQuery";
import {JoinTreeNode} from "../../../core/entity/JoinTreeNode";
/**
 * Represents SQL String query with object tree Select clause.
 */
export class ObjectSQLStringQuery<IE extends IEntity> extends SQLStringQuery<IE> {

	private queryParser: IQueryParser;

	constructor(
		phJsonQuery: PHJsonSQLQuery<IE>,
		qEntity: IQEntity,
		qEntityMapByName: {[entityName: string]: IQEntity},
		entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		dialect: SQLDialect,
		queryResultType: QueryResultType,
		protected bridgedQueryConfiguration?: BridgedQueryConfiguration
	) {
		super(phJsonQuery, qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType);
		if (bridgedQueryConfiguration && this.bridgedQueryConfiguration.strict !== undefined) {
			throw `"strict" configuration is not yet implemented for QueryResultType.BRIDGED`;
		}
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

	protected getOrderByFragment(
		orderBy?: JSONFieldInOrderBy[]
	): string {
		return this.orderByParser.getOrderByFragment(this.joinTree, this.qEntityMapByAlias);
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
		this.queryParser = getObjectQueryParser(this.queryResultType, this.bridgedQueryConfiguration, this.rootQEntity, this.qEntityMapByName);
		let parsedResults: any[] = [];
		if (!results || !results.length) {
			return parsedResults;
		}
		parsedResults = [];
		let lastResult;
		results.forEach(( result ) => {
			let entityAlias = QRelation.getAlias(this.joinTree.jsonRelation);
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

				let columnAlias = this.columnAliases.getAlias(entityAlias, propertyName);
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
						let relationGenericQEntity = this.qEntityMapByName[relation.entityName];
						let relationEntityMetadata: EntityMetadata = <EntityMetadata><any>relationGenericQEntity.__entityConstructor__;
						let columnAlias = this.columnAliases.getAlias(entityAlias, propertyName);
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
					let childJoinNode = currentJoinNode.getChildNode(childEntityName, propertyName);
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