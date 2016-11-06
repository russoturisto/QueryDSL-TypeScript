import {
	JSONEntityRelation, JSONRelationType, QRelation, JSONRelation,
	JSONJoinRelation, JSONViewJoinRelation
} from "../../../../core/entity/Relation";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
import {PHJsonMappedQSLQuery} from "../ph/PHMappedSQLQuery";
import {SQLStringQuery} from "../../SQLStringQuery";
import {PHJsonNonEntitySqlQuery} from "../ph/PHNonEntitySQLQuery";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
import {PHJsonFieldQSLQuery} from "../ph/PHFieldSQLQuery";
import {FieldSQLStringQuery} from "./FieldSQLStringQuery";
import {FieldColumnAliases} from "../../../../core/entity/Aliases";
import {JoinType} from "../../../../core/entity/Joins";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {QView} from "../../../../core/entity/Entity";
import {QBooleanField} from "../../../../core/field/BooleanField";
import {QDateField} from "../../../../core/field/DateField";
import {QNumberField} from "../../../../core/field/NumberField";
import {QStringField} from "../../../../core/field/StringField";
import {QField} from "../../../../core/field/Field";
import {MappedSQLStringQuery} from "./MappedSQLStringQuery";
/**
 * Created by Papa on 10/28/2016.
 */


export abstract class NonEntitySQLStringQuery<PHJQ extends PHJsonNonEntitySqlQuery> extends SQLStringQuery<PHJQ> {

	protected joinTrees: JoinTreeNode[];

	/**
	 * Used in remote execution to parse the result set and to validate a join.
	 */
	buildJoinTree(): void {
		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTrees = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap);
		this.getSELECTFragment(null, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults);
	}

	addQEntityMapByAlias( sourceMap ) {
		for (let alias in sourceMap) {
			this.qEntityMapByAlias[alias] = sourceMap[alias];
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
			if (!fieldJson.type) {
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
		switch (fieldJson.type) {
			case JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION:
				view[alias] = new QBooleanField(view, <any>QView, viewAlias, alias);
				break;
			case JSONClauseObjectType.DATE_FIELD_FUNCTION:
				view[alias] = new QDateField(view, <any>QView, viewAlias, alias);
				break;
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
			case JSONClauseObjectType.NUMBER_FIELD_FUNCTION:
				view[alias] = new QNumberField(view, <any>QView, viewAlias, alias);
				break;
			case JSONClauseObjectType.STRING_FIELD_FUNCTION:
				view[alias] = new QStringField(view, <any>QView, viewAlias, alias);
				break;
			default:
				throw `Missing type property on JSONClauseField`;
		}

		return hasDistinctClause;
	}


	getFunctionCallValue(
		rawValue: any
	): string {
		return this.getFieldValue(<JSONClauseField>rawValue, false, null);
	}

	getFieldValue(
		clauseField: JSONClauseField,
		allowNestedObjects: boolean,
		defaultCallback: () => string
	): string {
		let columnName;
		if (!clauseField) {
			throw `Missing Clause Field definition`;
		}
		if (!clauseField.type) {
			throw `Type is not defined in JSONClauseField`;
		}
		let aValue;
		switch (clauseField.type) {
			case JSONClauseObjectType.DATE_FIELD_FUNCTION:
				if (!clauseField.value) {
					throw `Value not provided for a Date function`;
				}
				if (!(clauseField.value instanceof Date) && !(<PHJsonFieldQSLQuery>clauseField.value).type) {
					clauseField.value = new Date(clauseField.value);
				}
			case JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION:
			case JSONClauseObjectType.NUMBER_FIELD_FUNCTION:
			case JSONClauseObjectType.STRING_FIELD_FUNCTION:
				aValue = clauseField.value;
				if (this.isPrimitive(aValue)) {
					aValue = this.parsePrimitive(aValue);
				} else {
					aValue = this.getFieldValue(aValue, allowNestedObjects, defaultCallback);
				}
				this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(clauseField, aValue, this.qEntityMapByAlias, this.embedParameters, this.parameters);
				break;
			case JSONClauseObjectType.DISTINCT_FUNCTION:
				throw `Distinct function cannot be nested inside the SELECT clause`;
			case JSONClauseObjectType.EXISTS_FUNCTION:
				throw `Exists function cannot be used in SELECT clause`;
			case JSONClauseObjectType.FIELD:
				let qEntity = this.qEntityMapByAlias[clauseField.tableAlias];
				this.validator.validateReadQEntityProperty(clauseField.propertyName, qEntity);
				columnName = this.getEntityPropertyColumnName(qEntity, clauseField.propertyName, clauseField.tableAlias);
				return this.getComplexColumnFragment(clauseField, columnName);
			case JSONClauseObjectType.FIELD_QUERY:
				// TODO: figure out if functions can be applied to sub-queries
				let jsonFieldSqlQuery: PHJsonFieldQSLQuery = <PHJsonFieldQSLQuery><any>clauseField;
				let fieldSqlQuery = new FieldSQLStringQuery(jsonFieldSqlQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
				fieldSqlQuery.addQEntityMapByAlias(this.qEntityMapByAlias);
				return `(${fieldSqlQuery.toSQL()})`;
			case JSONClauseObjectType.MANY_TO_ONE_RELATION:
				this.validator.validateReadQEntityManyToOneRelation(clauseField.propertyName, qEntity);
				columnName = this.getEntityManyToOneColumnName(qEntity, clauseField.propertyName, clauseField.tableAlias);
				return this.getComplexColumnFragment(clauseField, columnName);
			// must be a nested object
			default:
				if (!allowNestedObjects) {
					`Nested objects only allowed in the mapped SELECT clause.`;
				}
				return defaultCallback();
		}
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
			switch (currentRelation.relationType) {
				case JSONRelationType.ENTITY_ROOT:
					fromFragment += `${tableName} ${currentAlias}`;
					break;
				case JSONRelationType.SUB_QUERY_ROOT:
					let viewRelation = <JSONViewJoinRelation>currentRelation;
					let subQuery = new MappedSQLStringQuery(viewRelation.subQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect, this.queryResultType);
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

			switch (currentRelation.relationType) {
				case JSONRelationType.ENTITY_JOIN_ON:
					 TODO: implement
					break;
				case JSONRelationType.ENTITY_SCHEMA_RELATION:
					fromFragment += this.getEntitySchemaRelationFromJoin(leftEntity, rightEntity,
						<JSONEntityRelation>currentRelation, parentRelation, currentAlias, parentAlias,
						tableName, joinTypeString, errorPrefix);
					break;
				case JSONRelationType.SUB_QUERY_JOIN_ON:
					// TODO: implement
					break;
				default:
					throw `Nested FROM entries must be Entity JOIN ON or Schema Relation, or Sub-Query JOIN ON`;

			}
		}
		for (let i = 0; i < currentTree.childNodes.length; i++) {
			let childTreeNode = currentTree.childNodes[i];
			fromFragment += this.getFROMFragment(currentTree, childTreeNode, embedParameters, parameters);
		}

		return fromFragment;
	}
}