"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relation_1 = require("../../../../core/entity/Relation");
var JoinTreeNode_1 = require("../../../../core/entity/JoinTreeNode");
var SQLStringQuery_1 = require("../../SQLStringQuery");
var Appliable_1 = require("../../../../core/field/Appliable");
var FieldSQLStringQuery_1 = require("./FieldSQLStringQuery");
var Aliases_1 = require("../../../../core/entity/Aliases");
var Joins_1 = require("../../../../core/entity/Joins");
/**
 * Created by Papa on 10/28/2016.
 */
var NonEntitySQLStringQuery = (function (_super) {
    __extends(NonEntitySQLStringQuery, _super);
    function NonEntitySQLStringQuery() {
        _super.apply(this, arguments);
        this.columnAliases = new Aliases_1.FieldColumnAliases();
    }
    /**
     * Used in remote execution to parse the result set and to validate a join.
     */
    NonEntitySQLStringQuery.prototype.buildJoinTree = function () {
        var joinNodeMap = {};
        this.joinTree = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap);
        this.getSELECTFragment(null, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults);
    };
    NonEntitySQLStringQuery.prototype.addQEntityMapByAlias = function (sourceMap) {
        for (var alias in sourceMap) {
            this.qEntityMapByAlias[alias] = sourceMap[alias];
        }
    };
    NonEntitySQLStringQuery.prototype.buildFromJoinTree = function (joinRelations, joinNodeMap) {
        var jsonTree;
        // For entity queries it is possible to have a query with no from clause, in this case
        // make the query entity the root tree node
        if (joinRelations.length < 1) {
            throw "FROM clause must have entries for non-Entity queries";
        }
        var firstRelation = joinRelations[0];
        switch (firstRelation.relationType) {
            case Relation_1.JSONRelationType.SUB_QUERY_ROOT:
            case Relation_1.JSONRelationType.ENTITY_ROOT:
                break;
            default:
                throw "First table in FROM clause cannot be joined";
        }
        var alias = Relation_1.QRelation.getAlias(firstRelation);
        this.validator.validateReadFromEntity(firstRelation);
        var firstEntity = Relation_1.QRelation.createRelatedQEntity(firstRelation, this.qEntityMapByName);
        this.qEntityMapByAlias[alias] = firstEntity;
        jsonTree = new JoinTreeNode_1.JoinTreeNode(firstRelation, [], null);
        joinNodeMap[alias] = jsonTree;
        for (var i = 1; i < joinRelations.length; i++) {
            var joinRelation = joinRelations[i];
            if (!joinRelation.joinType) {
                throw "Table " + (i + 1) + " in FROM clause is missing joinType";
            }
            switch (joinRelation.relationType) {
                case Relation_1.JSONRelationType.ENTITY_ROOT:
                case Relation_1.JSONRelationType.SUB_QUERY_ROOT:
                    // Non-Joined table
                    alias = Relation_1.QRelation.getAlias(joinRelation);
                    this.validator.validateReadFromEntity(joinRelation);
                    var nonJoinedEntity = Relation_1.QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
                    this.qEntityMapByAlias[alias] = nonJoinedEntity;
                    var subTree = new JoinTreeNode_1.JoinTreeNode(joinRelation, [], jsonTree);
                    if (joinNodeMap[alias]) {
                        throw "Alias '" + alias + "' used more than once in the FROM clause.";
                    }
                    joinNodeMap[alias] = subTree;
                    continue;
                case Relation_1.JSONRelationType.ENTITY_SCHEMA_RELATION:
                    if (!joinRelation.relationPropertyName) {
                        throw "Table " + (i + 1) + " in FROM clause is missing relationPropertyName";
                    }
                case Relation_1.JSONRelationType.ENTITY_JOIN_ON:
                case Relation_1.JSONRelationType.SUB_QUERY_JOIN_ON:
                    if (!joinRelation.joinWhereClause) {
                        this.warn("Table " + (i + 1) + " in FROM clause is missing joinWhereClause");
                    }
                    break;
                default:
                    throw "Unknown JSONRelationType " + joinRelation.relationType;
            }
            var parentAlias = Relation_1.QRelation.getParentAlias(joinRelation);
            if (!joinNodeMap[parentAlias]) {
                throw "Missing parent entity for alias " + parentAlias + ", on table " + (i + 1) + " in FROM clause. NOTE: sub-queries in FROM clause cannot reference parent FROM tables.";
            }
            var leftNode = joinNodeMap[parentAlias];
            var rightNode = new JoinTreeNode_1.JoinTreeNode(joinRelation, [], leftNode);
            leftNode.addChildNode(rightNode);
            alias = Relation_1.QRelation.getAlias(joinRelation);
            this.validator.validateReadFromEntity(joinRelation);
            var rightEntity = Relation_1.QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
            this.qEntityMapByAlias[alias] = rightEntity;
            if (!rightEntity) {
                throw "Could not find entity " + joinRelation.entityName + " for table " + (i + 1) + " in FROM clause";
            }
            if (joinNodeMap[alias]) {
                throw "Alias '" + alias + "' used more than once in the FROM clause.";
            }
            joinNodeMap[alias] = rightNode;
        }
        return jsonTree;
    };
    NonEntitySQLStringQuery.prototype.getFunctionCallValue = function (rawValue) {
        return this.getFieldValue(rawValue, false, null);
    };
    NonEntitySQLStringQuery.prototype.getFieldValue = function (clauseField, allowNestedObjects, defaultCallback) {
        var columnName;
        if (!clauseField) {
            throw "Missing Clause Field definition";
        }
        if (!clauseField.type) {
            throw "Type is not defined in JSONClauseField";
        }
        var aValue;
        switch (clauseField.type) {
            case Appliable_1.JSONClauseObjectType.DATE_FIELD_FUNCTION:
                if (!clauseField.value) {
                    throw "Value not provided for a Date function";
                }
                if (!(clauseField.value instanceof Date) && !clauseField.value.type) {
                    clauseField.value = new Date(clauseField.value);
                }
            case Appliable_1.JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION:
            case Appliable_1.JSONClauseObjectType.NUMBER_FIELD_FUNCTION:
            case Appliable_1.JSONClauseObjectType.STRING_FIELD_FUNCTION:
                aValue = clauseField.value;
                if (this.isPrimitive(aValue)) {
                    aValue = this.parsePrimitive(aValue);
                }
                else {
                    aValue = this.getFieldValue(aValue, allowNestedObjects, defaultCallback);
                }
                this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(clauseField, aValue, this.qEntityMapByAlias, this.embedParameters, this.parameters);
                break;
            case Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION:
                throw "Distinct function cannot be nested inside the SELECT clause";
            case Appliable_1.JSONClauseObjectType.EXISTS_FUNCTION:
                throw "Exists function cannot be used in SELECT clause";
            case Appliable_1.JSONClauseObjectType.FIELD:
                var qEntity = this.qEntityMapByAlias[clauseField.tableAlias];
                this.validator.validateReadQEntityProperty(clauseField.propertyName, qEntity);
                columnName = this.getEntityPropertyColumnName(qEntity, clauseField.propertyName, clauseField.tableAlias);
                return this.getComplexColumnFragment(clauseField, columnName);
            case Appliable_1.JSONClauseObjectType.FIELD_QUERY:
                // TODO: figure out if functions can be applied to sub-queries
                var jsonFieldSqlQuery = clauseField;
                var fieldSqlQuery = new FieldSQLStringQuery_1.FieldSQLStringQuery(jsonFieldSqlQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
                fieldSqlQuery.addQEntityMapByAlias(this.qEntityMapByAlias);
                return "(" + fieldSqlQuery.toSQL() + ")";
            case Appliable_1.JSONClauseObjectType.MANY_TO_ONE_RELATION:
                this.validator.validateReadQEntityManyToOneRelation(clauseField.propertyName, qEntity);
                columnName = this.getEntityManyToOneColumnName(qEntity, clauseField.propertyName, clauseField.tableAlias);
                return this.getComplexColumnFragment(clauseField, columnName);
            // must be a nested object
            default:
                if (!allowNestedObjects) {
                    "Nested objects only allowed in the mapped SELECT clause.";
                }
                return defaultCallback();
        }
    };
    NonEntitySQLStringQuery.prototype.getFROMFragment = function (parentTree, currentTree, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var fromFragment = '\t';
        var currentRelation = currentTree.jsonRelation;
        var currentAlias = Relation_1.QRelation.getAlias(currentRelation);
        var qEntity = this.qEntityMapByAlias[currentAlias];
        var tableName = this.getTableName(qEntity);
        if (!parentTree) {
            fromFragment += tableName + " " + currentAlias;
        }
        else {
            var parentRelation = parentTree.jsonRelation;
            var parentAlias = Relation_1.QRelation.getAlias(parentRelation);
            var leftEntity = this.qEntityMapByAlias[parentAlias];
            var rightEntity = this.qEntityMapByAlias[currentAlias];
            var joinTypeString = void 0;
            switch (currentRelation.joinType) {
                case Joins_1.JoinType.FULL_JOIN:
                    joinTypeString = 'FULL JOIN';
                    break;
                case Joins_1.JoinType.INNER_JOIN:
                    joinTypeString = 'INNER JOIN';
                    break;
                case Joins_1.JoinType.LEFT_JOIN:
                    joinTypeString = 'LEFT JOIN';
                    break;
                case Joins_1.JoinType.RIGHT_JOIN:
                    joinTypeString = 'RIGHT JOIN';
                default:
                    throw "Unsupported join type: " + currentRelation.joinType;
            }
            var rightEntityJoinColumn = void 0, leftColumn = void 0;
            var leftEntityMetadata = leftEntity.__entityConstructor__;
            var rightEntityMetadata = rightEntity.__entityConstructor__;
            var errorPrefix = 'Error building FROM: ';
            switch (currentRelation.relationType) {
                case Relation_1.JSONRelationType.ENTITY_ROOT:
                    fromFragment += tableName + " " + currentAlias;
                    break;
                case Relation_1.JSONRelationType.ENTITY_JOIN_ON:
                case Relation_1.JSONRelationType.ENTITY_SCHEMA_RELATION:
                    fromFragment += this.getEntitySchemaRelationFromJoin(leftEntity, rightEntity, currentRelation, parentRelation, currentAlias, parentAlias, tableName, joinTypeString, errorPrefix);
                    break;
                case Relation_1.JSONRelationType.SUB_QUERY_JOIN_ON:
                case Relation_1.JSONRelationType.SUB_QUERY_ROOT:
            }
        }
        for (var i = 0; i < currentTree.childNodes.length; i++) {
            var childTreeNode = currentTree.childNodes[i];
            fromFragment += this.getFROMFragment(currentTree, childTreeNode, embedParameters, parameters);
        }
        return fromFragment;
    };
    return NonEntitySQLStringQuery;
}(SQLStringQuery_1.SQLStringQuery));
exports.NonEntitySQLStringQuery = NonEntitySQLStringQuery;
//# sourceMappingURL=NonEntitySQLStringQuery.js.map