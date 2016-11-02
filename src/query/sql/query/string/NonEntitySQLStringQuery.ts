import {
	JSONEntityRelation, JSONRelationType, QRelation, JSONRelation,
	JSONJoinRelation
} from "../../../../core/entity/Relation";
import {JoinTreeNode} from "../../../../core/entity/JoinTreeNode";
import {PHJsonMappedQSLQuery} from "../ph/PHMappedSQLQuery";
import {SQLStringQuery} from "../../SQLStringQuery";
import {PHJsonNonEntitySqlQuery} from "../ph/PHNonEntitySQLQuery";
import {JSONClauseField, JSONClauseObjectType} from "../../../../core/field/Appliable";
import {PHJsonFieldQSLQuery} from "../ph/PHFieldSQLQuery";
import {FieldSQLStringQuery} from "./FieldSQLStringQuery";
/**
 * Created by Papa on 10/28/2016.
 */


export abstract class NonEntitySQLStringQuery<PHJQ extends PHJsonNonEntitySqlQuery> extends SQLStringQuery<PHJQ> {


	/**
	 * Used in remote execution to parse the result set and to validate a join.
	 */
	buildJoinTree(): void {
		let joinNodeMap: {[alias: string]: JoinTreeNode} = {};
		this.joinTree = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap);
		this.getSELECTFragment(null, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, false, []);
	}

	addQEntityMapByAlias( sourceMap ) {
		for (let alias in sourceMap) {
			this.qEntityMapByAlias[alias] = sourceMap[alias];
		}
	}

	buildFromJoinTree(
		joinRelations: (JSONRelation | PHJsonMappedQSLQuery)[],
		joinNodeMap: {[alias: string]: JoinTreeNode}
	): JoinTreeNode {
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
		joinNodeMap[alias] = jsonTree;

		for (let i = 1; i < joinRelations.length; i++) {
			let joinRelation = joinRelations[i];
			if (!joinRelation.joinType) {
				throw `Table ${i + 1} in FROM clause is missing joinType`;
			}
			switch (joinRelation.relationType) {
				case JSONRelationType.ENTITY_ROOT:
				case JSONRelationType.SUB_QUERY_ROOT:
					throw `All tables after the first must be joined`;
				case JSONRelationType.ENTITY_SCHEMA_RELATION:
					if (!(<JSONEntityRelation>joinRelation).relationPropertyName) {
						throw `Table ${i + 1} in FROM clause is missing relationPropertyName`;
					}
				default:
					if (!(<JSONJoinRelation>joinRelation).joinWhereClause) {
						throw `Table ${i + 1} in FROM clause is missing joinWhereClause`;
					}
					break;
			}
			let parentAlias = QRelation.getParentAlias(joinRelation);
			if (!joinNodeMap[parentAlias]) {
				throw `Missing parent entity for alias ${parentAlias}, on table ${i + 1} in FROM clause. NOTE: sub-queries in FROM clause cannot reference parent FROM tables.`;
			}
			let leftNode = joinNodeMap[parentAlias];
			let rightNode = new JoinTreeNode(joinRelation, [], leftNode);
			leftNode.addChildNode(rightNode);

			alias = QRelation.getAlias(joinRelation);
			this.validator.validateReadFromEntity(joinRelation);
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
				if(this.isPrimitive(aValue)) {
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
}