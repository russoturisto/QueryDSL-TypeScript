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
var Joins_1 = require("../../../../core/entity/Joins");
var Entity_1 = require("../../../../core/entity/Entity");
var BooleanField_1 = require("../../../../core/field/BooleanField");
var DateField_1 = require("../../../../core/field/DateField");
var NumberField_1 = require("../../../../core/field/NumberField");
var StringField_1 = require("../../../../core/field/StringField");
var MappedSQLStringQuery_1 = require("./MappedSQLStringQuery");
/**
 * Created by Papa on 10/28/2016.
 */
var NonEntitySQLStringQuery = (function (_super) {
    __extends(NonEntitySQLStringQuery, _super);
    function NonEntitySQLStringQuery() {
        _super.apply(this, arguments);
    }
    /**
     * Used in remote execution to parse the result set and to validate a join.
     */
    NonEntitySQLStringQuery.prototype.buildJoinTree = function () {
        var joinNodeMap = {};
        this.joinTrees = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap);
        this.getSELECTFragment(null, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults);
    };
    NonEntitySQLStringQuery.prototype.addQEntityMapByAlias = function (sourceMap) {
        for (var alias in sourceMap) {
            this.qEntityMapByAlias[alias] = sourceMap[alias];
        }
    };
    NonEntitySQLStringQuery.prototype.buildFromJoinTree = function (joinRelations, joinNodeMap) {
        var jsonTrees = [];
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
        jsonTrees.push(jsonTree);
        joinNodeMap[alias] = jsonTree;
        for (var i = 1; i < joinRelations.length; i++) {
            var rightEntity = void 0;
            var joinRelation = joinRelations[i];
            if (!joinRelation.joinType) {
                throw "Table " + (i + 1) + " in FROM clause is missing joinType";
            }
            this.validator.validateReadFromEntity(joinRelation);
            alias = Relation_1.QRelation.getAlias(joinRelation);
            switch (joinRelation.relationType) {
                case Relation_1.JSONRelationType.SUB_QUERY_ROOT:
                    var view = this.addFieldsToView(joinRelation, alias);
                    this.qEntityMapByAlias[alias] = view;
                    continue;
                case Relation_1.JSONRelationType.ENTITY_ROOT:
                    // Non-Joined table
                    var nonJoinedEntity = Relation_1.QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
                    this.qEntityMapByAlias[alias] = nonJoinedEntity;
                    var anotherTree = new JoinTreeNode_1.JoinTreeNode(joinRelation, [], null);
                    if (joinNodeMap[alias]) {
                        throw "Alias '" + alias + "' used more than once in the FROM clause.";
                    }
                    jsonTrees.push(anotherTree);
                    joinNodeMap[alias] = anotherTree;
                    continue;
                case Relation_1.JSONRelationType.ENTITY_SCHEMA_RELATION:
                    if (!joinRelation.relationPropertyName) {
                        throw "Table " + (i + 1) + " in FROM clause is missing relationPropertyName";
                    }
                    rightEntity = Relation_1.QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
                    break;
                case Relation_1.JSONRelationType.SUB_QUERY_JOIN_ON:
                    if (!joinRelation.joinWhereClause) {
                        this.warn("View " + (i + 1) + " in FROM clause is missing joinWhereClause");
                    }
                    rightEntity = this.addFieldsToView(joinRelation, alias);
                    break;
                case Relation_1.JSONRelationType.ENTITY_JOIN_ON:
                    if (!joinRelation.joinWhereClause) {
                        this.warn("Table " + (i + 1) + " in FROM clause is missing joinWhereClause");
                    }
                    rightEntity = Relation_1.QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
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
            this.validator.validateReadFromEntity(joinRelation);
            this.qEntityMapByAlias[alias] = rightEntity;
            if (!rightEntity) {
                throw "Could not find entity " + joinRelation.entityName + " for table " + (i + 1) + " in FROM clause";
            }
            if (joinNodeMap[alias]) {
                throw "Alias '" + alias + "' used more than once in the FROM clause.";
            }
            joinNodeMap[alias] = rightNode;
        }
        return jsonTrees;
    };
    NonEntitySQLStringQuery.prototype.addFieldsToView = function (viewJoinRelation, viewAlias) {
        var view = new Entity_1.QView(viewJoinRelation.fromClausePosition, null);
        this.addFieldsToViewForSelect(view, viewAlias, viewJoinRelation.subQuery.select, 'f');
        return view;
    };
    /**
     * Just build the shell fields for the external API of the view, don't do anything else.
     * @param view
     * @param select
     * @param fieldPrefix
     */
    NonEntitySQLStringQuery.prototype.addFieldsToViewForSelect = function (view, viewAlias, select, fieldPrefix, forFieldQueryAlias) {
        if (forFieldQueryAlias === void 0) { forFieldQueryAlias = null; }
        var fieldIndex = 0;
        var hasDistinctClause = false;
        for (var fieldName in select) {
            var alias = "" + fieldPrefix + ++fieldIndex;
            var fieldJson = select[fieldName];
            // If its a nested select
            if (!fieldJson.type) {
                this.addFieldsToViewForSelect(view, viewAlias, fieldJson, alias + "_");
            }
            else {
                var aliasToSet = forFieldQueryAlias ? forFieldQueryAlias : alias;
                hasDistinctClause = hasDistinctClause && this.addFieldToViewForSelect(view, viewAlias, fieldPrefix, fieldJson, aliasToSet, forFieldQueryAlias);
            }
        }
        if (fieldIndex > 1) {
            if (hasDistinctClause) {
                throw "DISTINCT clause must be the only property at its level";
            }
            if (forFieldQueryAlias) {
                throw "Field queries can have only one field in SELECT clause";
            }
        }
    };
    NonEntitySQLStringQuery.prototype.addFieldToViewForSelect = function (view, viewAlias, fieldPrefix, fieldJson, alias, forFieldQueryAlias) {
        if (forFieldQueryAlias === void 0) { forFieldQueryAlias = null; }
        var hasDistinctClause = false;
        switch (fieldJson.type) {
            case Appliable_1.JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION:
                view[alias] = new BooleanField_1.QBooleanField(view, Entity_1.QView, viewAlias, alias);
                break;
            case Appliable_1.JSONClauseObjectType.DATE_FIELD_FUNCTION:
                view[alias] = new DateField_1.QDateField(view, Entity_1.QView, viewAlias, alias);
                break;
            case Appliable_1.JSONClauseObjectType.EXISTS_FUNCTION:
                throw "Exists function cannot be used in SELECT clause.";
            case Appliable_1.JSONClauseObjectType.FIELD:
                var field = this.qEntityMapByName[fieldJson.entityName].__entityFieldMap__[fieldJson.propertyName];
                view[alias] = field.getInstance(view);
                break;
            case Appliable_1.JSONClauseObjectType.FIELD_QUERY:
                var fieldQuery = fieldJson;
                this.addFieldToViewForSelect(view, viewAlias, fieldPrefix, fieldQuery.select, alias, alias);
                break;
            case Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION:
                this.addFieldsToViewForSelect(view, viewAlias, fieldJson.value, fieldPrefix, forFieldQueryAlias);
                hasDistinctClause = true;
                break;
            case Appliable_1.JSONClauseObjectType.MANY_TO_ONE_RELATION:
                var relation = this.qEntityMapByName[fieldJson.entityName].__entityRelationMap__[fieldJson.propertyName];
                view[alias] = relation.getInstance(view);
                break;
            case Appliable_1.JSONClauseObjectType.NUMBER_FIELD_FUNCTION:
                view[alias] = new NumberField_1.QNumberField(view, Entity_1.QView, viewAlias, alias);
                break;
            case Appliable_1.JSONClauseObjectType.STRING_FIELD_FUNCTION:
                view[alias] = new StringField_1.QStringField(view, Entity_1.QView, viewAlias, alias);
                break;
            default:
                throw "Missing type property on JSONClauseField";
        }
        return hasDistinctClause;
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
            switch (currentRelation.relationType) {
                case Relation_1.JSONRelationType.ENTITY_ROOT:
                    fromFragment += tableName + " " + currentAlias;
                    break;
                case Relation_1.JSONRelationType.SUB_QUERY_ROOT:
                    var viewRelation = currentRelation;
                    var subQuery = new MappedSQLStringQuery_1.MappedSQLStringQuery(viewRelation.subQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
                    fromFragment += "(" + subQuery.toSQL() + ") " + currentAlias;
                    break;
                default:
                    throw "Top level FROM entries must be Entity or Sub-Query root";
            }
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
            var errorPrefix = 'Error building FROM: ';
            var joinOnClause = void 0;
            switch (currentRelation.relationType) {
                case Relation_1.JSONRelationType.ENTITY_JOIN_ON:
                    var joinRelation = currentRelation;
                    joinOnClause = this.getWHEREFragment(joinRelation.joinWhereClause, '\t');
                    fromFragment += joinTypeString + " " + tableName + " " + currentAlias + " ON\n" + joinOnClause;
                    break;
                case Relation_1.JSONRelationType.ENTITY_SCHEMA_RELATION:
                    fromFragment += this.getEntitySchemaRelationFromJoin(leftEntity, rightEntity, currentRelation, parentRelation, currentAlias, parentAlias, tableName, joinTypeString, errorPrefix);
                    break;
                case Relation_1.JSONRelationType.SUB_QUERY_JOIN_ON:
                    var viewJoinRelation = currentRelation;
                    var mappedSqlQuery = new MappedSQLStringQuery_1.MappedSQLStringQuery(viewJoinRelation.subQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
                    fromFragment += joinTypeString + " (" + mappedSqlQuery.toSQL() + ") ON\n" + joinOnClause;
                    break;
                default:
                    throw "Nested FROM entries must be Entity JOIN ON or Schema Relation, or Sub-Query JOIN ON";
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