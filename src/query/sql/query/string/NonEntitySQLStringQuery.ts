import {
	JSONEntityRelation, JSONRelationType, QRelation, JSONRelation,
	JSONJoinRelation, JSONViewJoinRelation
} from "../../../../core/entity/Relation";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
import {SQLStringQuery} from "../../SQLStringQuery";
import {PHJsonNonEntitySqlQuery} from "../ph/PHNonEntitySQLQuery";
import {JSONClauseField, JSONClauseObjectType, SQLDataType} from "../../../../core/field/Appliable";
import {PHJsonFieldQSLQuery} from "../ph/PHFieldSQLQuery";
import {JoinType} from "../../../../core/entity/Joins";
import {QView} from "../../../../core/entity/Entity";
import {QBooleanField} from "../../../../core/field/BooleanField";
import {QDateField} from "../../../../core/field/DateField";
import {QNumberField} from "../../../../core/field/NumberField";
import {QStringField} from "../../../../core/field/StringField";
import {QField} from "../../../../core/field/Field";
import {MappedSQLStringQuery} from "./MappedSQLStringQuery";
import {JSONFieldInOrderBy, JSONFieldInGroupBy, SortOrder} from "../../../../core/field/FieldInOrderBy";
import {INonEntityOrderByParser} from "../orderBy/IEntityOrderByParser";
import {ClauseType} from "../../SQLStringWhereBase";
/**
 * Created by Papa on 10/28/2016.
 */


export abstract class NonEntitySQLStringQuery<PHJQ extends PHJsonNonEntitySqlQuery> extends SQLStringQuery<PHJQ> {

	protected joinTrees: JoinTreeNode[];
	protected orderByParser: INonEntityOrderByParser;

	/**
	 * Used in remote execution to parse the result set and to validate a join.
	 */
	buildJoinTree(): void {
		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTrees = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap);
		this.getSELECTFragment(null, this.phJsonQuery.select);
	}

	addQEntityMapByAlias( sourceMap ) {
		for (let alias in sourceMap) {
			this.qEntityMapByAlias[alias] = sourceMap[alias];
		}
	}

	toSQL(): string {
		let jsonQuery = <PHJsonNonEntitySqlQuery>this.phJsonQuery;
		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTrees = this.buildFromJoinTree(jsonQuery.from, joinNodeMap);
		let selectFragment = this.getSELECTFragment(null, jsonQuery.select);
		let fromFragment = this.getFROMFragments(this.joinTrees);
		let whereFragment = '';
		if (jsonQuery.where) {
			whereFragment = `
WHERE
${this.getWHEREFragment(jsonQuery.where, '')}`;
		}
		let groupByFragment = '';
		if (jsonQuery.groupBy && jsonQuery.groupBy.length) {
			groupByFragment = `
GROUP BY
${this.getGroupByFragment(jsonQuery.groupBy)}`;
		}
		let havingFragment = '';
		if (jsonQuery.having) {
			havingFragment = `
HAVING
${this.getWHEREFragment(jsonQuery.having, '')}`;
		}
		let orderByFragment = '';
		if (jsonQuery.orderBy && jsonQuery.orderBy.length) {
			orderByFragment = `
ORDER BY
${this.orderByParser.getOrderByFragment(jsonQuery.select, jsonQuery.orderBy)}`;
		}
		let offsetFragment = '';
		if (jsonQuery.offset) {
			offsetFragment = this.sqlAdaptor.getOffsetFragment(jsonQuery.offset);
		}
		let limitFragment = '';
		if (jsonQuery.limit) {
			offsetFragment = this.sqlAdaptor.getLimitFragment(jsonQuery.limit);
		}

		return `SELECT
${selectFragment}
FROM
${fromFragment}${whereFragment}${groupByFragment}${havingFragment}${orderByFragment}${offsetFragment}${limitFragment}`;
	}

	protected abstract getSELECTFragment(
		selectSqlFragment: string,
		selectClauseFragment: any
	): string;

	protected getFieldSelectFragment(
		value:JSONClauseField,
	  clauseType:ClauseType,
	  nestedObjectCallBack:{():string},
		selectSqlFragment:string
	) {
		let columnSelectSqlFragment = this.getFieldValue(value, clauseType,
			// Nested object processing
			nestedObjectCallBack);
		columnSelectSqlFragment += ` as ${value.fieldAlias}\n`;
		if (selectSqlFragment) {
			return `\t, ${columnSelectSqlFragment}`;
		} else {
			return `\t${columnSelectSqlFragment}`;
		}
	}

	buildFromJoinTree(
		joinRelations: JSONRelation[],
		joinNodeMap: {[alias: string]: JoinTreeNode}
	): JoinTreeNode[] {
		let jsonTrees: JoinTreeNode[] = [];
		let jsonTree: JoinTreeNode;

		// For entity queries it is possible to have a query with no from clause, in this case
		// make the query entity the root tree node
		if (joinRelations.length < 1) {
			throw `FROM clause must have entries for non-Entity queries`;
		}

		let firstRelation = joinRelations[0];
		switch (firstRelation.relationType) {
			case JSONRelationType.SUB_QUERY_ROOT:
			case JSONRelationType.ENTITY_ROOT:
				break;
			default:
				throw `First table in FROM clause cannot be joined`;
		}

		let alias = QRelation.getAlias(firstRelation);
		this.validator.validateReadFromEntity(firstRelation);
		let firstEntity = QRelation.createRelatedQEntity(firstRelation, this.qEntityMapByName);
		this.qEntityMapByAlias[alias] = firstEntity;
		jsonTree = new JoinTreeNode(firstRelation, [], null);
		jsonTrees.push(jsonTree);
		joinNodeMap[alias] = jsonTree;

		for (let i = 1; i < joinRelations.length; i++) {
			let rightEntity;
			let joinRelation = joinRelations[i];
			if (!joinRelation.joinType) {
				throw `Table ${i + 1} in FROM clause is missing joinType`;
			}
			this.validator.validateReadFromEntity(joinRelation);
			alias = QRelation.getAlias(joinRelation);
			switch (joinRelation.relationType) {
				case JSONRelationType.SUB_QUERY_ROOT:
					let view = this.addFieldsToView(<JSONViewJoinRelation>joinRelation, alias);
					this.qEntityMapByAlias[alias] = view;
					continue;
				case JSONRelationType.ENTITY_ROOT:
					// Non-Joined table
					let nonJoinedEntity = QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
					this.qEntityMapByAlias[alias] = nonJoinedEntity;
					let anotherTree = new JoinTreeNode(joinRelation, [], null);
					if (joinNodeMap[alias]) {
						throw `Alias '${alias}' used more than once in the FROM clause.`;
					}
					jsonTrees.push(anotherTree);
					joinNodeMap[alias] = anotherTree;
					continue;
				case JSONRelationType.ENTITY_SCHEMA_RELATION:
					if (!(<JSONEntityRelation>joinRelation).relationPropertyName) {
						throw `Table ${i + 1} in FROM clause is missing relationPropertyName`;
					}
					rightEntity = QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
					break;
				case JSONRelationType.SUB_QUERY_JOIN_ON:
					if (!(<JSONJoinRelation>joinRelation).joinWhereClause) {
						this.warn(`View ${i + 1} in FROM clause is missing joinWhereClause`);
					}
					rightEntity = this.addFieldsToView(<JSONViewJoinRelation>joinRelation, alias);
					break;
				case JSONRelationType.ENTITY_JOIN_ON:
					if (!(<JSONJoinRelation>joinRelation).joinWhereClause) {
						this.warn(`Table ${i + 1} in FROM clause is missing joinWhereClause`);
					}
					rightEntity = QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
					break;
				default:
					throw `Unknown JSONRelationType ${joinRelation.relationType}`;
			}
			let parentAlias = QRelation.getParentAlias(joinRelation);
			if (!joinNodeMap[parentAlias]) {
				throw `Missing parent entity for alias ${parentAlias}, on table ${i + 1} in FROM clause. NOTE: sub-queries in FROM clause cannot reference parent FROM tables.`;
			}
			let leftNode = joinNodeMap[parentAlias];
			let rightNode = new JoinTreeNode(joinRelation, [], leftNode);
			leftNode.addChildNode(rightNode);

			this.validator.validateReadFromEntity(joinRelation);
			this.qEntityMapByAlias[alias] = rightEntity;
			if (!rightEntity) {
				throw `Could not find entity ${joinRelation.entityName} for table ${i + 1} in FROM clause`;
			}
			if (joinNodeMap[alias]) {
				throw `Alias '${alias}' used more than once in the FROM clause.`;
			}
			joinNodeMap[alias] = rightNode;
		}

		return jsonTrees;
	}

	addFieldsToView(
		viewJoinRelation: JSONViewJoinRelation,
		viewAlias: string
	) {
		let view = new QView(viewJoinRelation.fromClausePosition, null);
		this.addFieldsToViewForSelect(view, viewAlias, viewJoinRelation.subQuery.select, 'f');

		return view;
	}

	/**
	 * Just build the shell fields for the external API of the view, don't do anything else.
	 * @param view
	 * @param select
	 * @param fieldPrefix
	 */
	addFieldsToViewForSelect(
		view: QView,
		viewAlias: string,
		select: any,
		fieldPrefix: string,
		forFieldQueryAlias: string = null
	) {
		let fieldIndex = 0;
		let hasDistinctClause = false;
		for (let fieldName in select) {
			let alias = `${fieldPrefix}${++fieldIndex}`;
			let fieldJson: JSONClauseField = select[fieldName];
			// If its a nested select
			if (!fieldJson.objectType) {
				this.addFieldsToViewForSelect(view, viewAlias, fieldJson, `${alias}_`);
			} else {
				let aliasToSet = forFieldQueryAlias ? forFieldQueryAlias : alias;
				hasDistinctClause = hasDistinctClause && this.addFieldToViewForSelect(view, viewAlias, fieldPrefix, fieldJson, aliasToSet, forFieldQueryAlias);
			}
		}
		if (fieldIndex > 1) {
			if (hasDistinctClause) {
				throw `DISTINCT clause must be the only property at its level`;
			}
			if (forFieldQueryAlias) {
				throw `Field queries can have only one field in SELECT clause`;
			}
		}
	}

	addFieldToViewForSelect(
		view: QView,
		viewAlias: string,
		fieldPrefix: string,
		fieldJson: JSONClauseField,
		alias: string,
		forFieldQueryAlias: string = null
	): boolean {
		let hasDistinctClause = false;
		switch (fieldJson.objectType) {
			case JSONClauseObjectType.FIELD_FUNCTION:
				switch (fieldJson.dataType) {
					case SQLDataType.BOOLEAN:
						view[alias] = new QBooleanField(view, <any>QView, viewAlias, alias);
						break;
					case SQLDataType.DATE:
						view[alias] = new QDateField(view, <any>QView, viewAlias, alias);
						break;
					case SQLDataType.NUMBER:
						view[alias] = new QNumberField(view, <any>QView, viewAlias, alias);
						break;
					case SQLDataType.STRING:
						view[alias] = new QStringField(view, <any>QView, viewAlias, alias);
						break;
				}
			case JSONClauseObjectType.EXISTS_FUNCTION:
				throw `Exists function cannot be used in SELECT clause.`;
			case JSONClauseObjectType.FIELD:
				let field = <QField<any>><any>this.qEntityMapByName[fieldJson.entityName].__entityFieldMap__[fieldJson.propertyName];
				view[alias] = field.getInstance(view);
				break;
			case JSONClauseObjectType.FIELD_QUERY:
				let fieldQuery = <PHJsonFieldQSLQuery><any>fieldJson;
				this.addFieldToViewForSelect(view, viewAlias, fieldPrefix, fieldQuery.select, alias, alias);
				break;
			case JSONClauseObjectType.DISTINCT_FUNCTION:
				this.addFieldsToViewForSelect(view, viewAlias, fieldJson.value, fieldPrefix, forFieldQueryAlias);
				hasDistinctClause = true;
				break;
			case JSONClauseObjectType.MANY_TO_ONE_RELATION:
				let relation = <QField<any>><any>this.qEntityMapByName[fieldJson.entityName].__entityRelationMap__[fieldJson.propertyName];
				view[alias] = relation.getInstance(view);
				break;
			default:
				throw `Missing type property on JSONClauseField`;
		}

		return hasDistinctClause;
	}

	private getFROMFragments(
		joinTrees: JoinTreeNode[]
	): string {
		return joinTrees.map(
			joinTree => this.getFROMFragment(null, joinTree)).join('\n');
	}

	private getFROMFragment(
		parentTree: JoinTreeNode,
		currentTree: JoinTreeNode
	): string {
		let fromFragment = '\t';
		let currentRelation = currentTree.jsonRelation;
		let currentAlias = QRelation.getAlias(currentRelation);
		let qEntity = this.qEntityMapByAlias[currentAlias];
		let tableName = this.getTableName(qEntity);

		if (!parentTree) {
			switch (currentRelation.relationType) {
				case JSONRelationType.ENTITY_ROOT:
					fromFragment += `${tableName} ${currentAlias}`;
					break;
				case JSONRelationType.SUB_QUERY_ROOT:
					let viewRelation = <JSONViewJoinRelation>currentRelation;
					let subQuery = new MappedSQLStringQuery(viewRelation.subQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
					fromFragment += `(${subQuery.toSQL()}) ${currentAlias}`;
					break;
				default:
					throw `Top level FROM entries must be Entity or Sub-Query root`;
			}
		} else {
			let parentRelation = parentTree.jsonRelation;
			let parentAlias = QRelation.getAlias(parentRelation);
			let leftEntity = this.qEntityMapByAlias[parentAlias];

			let rightEntity = this.qEntityMapByAlias[currentAlias];

			let joinTypeString;
			switch (currentRelation.joinType) {
				case JoinType.FULL_JOIN:
					joinTypeString = 'FULL JOIN';
					break;
				case JoinType.INNER_JOIN:
					joinTypeString = 'INNER JOIN';
					break;
				case JoinType.LEFT_JOIN:
					joinTypeString = 'LEFT JOIN';
					break;
				case JoinType.RIGHT_JOIN:
					joinTypeString = 'RIGHT JOIN';
				default:
					throw `Unsupported join type: ${currentRelation.joinType}`;
			}

			let errorPrefix = 'Error building FROM: ';

			let joinOnClause;
			switch (currentRelation.relationType) {
				case JSONRelationType.ENTITY_JOIN_ON:
					let joinRelation = <JSONJoinRelation>currentRelation;
					joinOnClause = this.getWHEREFragment(joinRelation.joinWhereClause, '\t');
					fromFragment += `${joinTypeString} ${tableName} ${currentAlias} ON\n${joinOnClause}`;
					break;
				case JSONRelationType.ENTITY_SCHEMA_RELATION:
					fromFragment += this.getEntitySchemaRelationFromJoin(leftEntity, rightEntity,
						<JSONEntityRelation>currentRelation, parentRelation, currentAlias, parentAlias,
						tableName, joinTypeString, errorPrefix);
					break;
				case JSONRelationType.SUB_QUERY_JOIN_ON:
					let viewJoinRelation = <JSONViewJoinRelation>currentRelation;
					let mappedSqlQuery = new MappedSQLStringQuery(viewJoinRelation.subQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
					fromFragment += `${joinTypeString} (${mappedSqlQuery.toSQL()}) ON\n${joinOnClause}`;
					break;
				default:
					throw `Nested FROM entries must be Entity JOIN ON or Schema Relation, or Sub-Query JOIN ON`;

			}
		}
		for (let i = 0; i < currentTree.childNodes.length; i++) {
			let childTreeNode = currentTree.childNodes[i];
			fromFragment += this.getFROMFragment(currentTree, childTreeNode);
		}

		return fromFragment;
	}

	protected getGroupByFragment(
		groupBy?: JSONFieldInGroupBy[]
	): string {
		return groupBy.map(
			( groupByField ) => {
				this.validator.validateAliasedFieldAccess(groupByField.fieldAlias);
				return `${groupByField.fieldAlias}`;
			}).join(', ');
	}

	protected getOrderByFragment( orderBy: JSONFieldInOrderBy[] ): string {
		return orderBy.map(
			( orderByField ) => {
				this.validator.validateAliasedFieldAccess(orderByField.fieldAlias);
				switch (orderByField.sortOrder) {
					case SortOrder.ASCENDING:
						return `${orderByField.fieldAlias} ASC`;
					case SortOrder.DESCENDING:
						return `${orderByField.fieldAlias} DESC`;
				}
			}).join(', ');
	}

}