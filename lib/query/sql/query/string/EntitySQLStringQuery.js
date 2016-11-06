"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Papa on 10/16/2016.
 */
var Relation_1 = require("../../../../core/entity/Relation");
var SQLStringQuery_1 = require("../../SQLStringQuery");
var IEntityResultParser_1 = require("../result/IEntityResultParser");
var BooleanField_1 = require("../../../../core/field/BooleanField");
var DateField_1 = require("../../../../core/field/DateField");
var NumberField_1 = require("../../../../core/field/NumberField");
var StringField_1 = require("../../../../core/field/StringField");
var EntityUtils_1 = require("../../../../core/utils/EntityUtils");
var JoinTreeNode_1 = require("../../../../core/entity/JoinTreeNode");
var Aliases_1 = require("../../../../core/entity/Aliases");
var Joins_1 = require("../../../../core/entity/Joins");
/**
 * Represents SQL String query with Entity tree Select clause.
 */
var EntitySQLStringQuery = (function (_super) {
    __extends(EntitySQLStringQuery, _super);
    function EntitySQLStringQuery(rootQEntity, phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType, bridgedQueryConfiguration) {
        _super.call(this, phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType);
        this.rootQEntity = rootQEntity;
        this.bridgedQueryConfiguration = bridgedQueryConfiguration;
        this.columnAliases = new Aliases_1.AliasCache('ec_');
        if (bridgedQueryConfiguration && this.bridgedQueryConfiguration.strict !== undefined) {
            throw "\"strict\" configuration is not yet implemented for QueryResultType.BRIDGED";
        }
    }
    /**
     * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
     * result set.
     */
    EntitySQLStringQuery.prototype.buildJoinTree = function () {
        var entityName = this.rootQEntity.__entityName__;
        var joinNodeMap = {};
        this.joinTree = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap, entityName);
        this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, false, []);
    };
    EntitySQLStringQuery.prototype.buildFromJoinTree = function (joinRelations, joinNodeMap, entityName) {
        var jsonTree;
        // For entity queries it is possible to have a query with no from clause, in this case
        // make the query entity the root tree node
        if (joinRelations.length < 1) {
            var onlyJsonRelation = {
                currentChildIndex: 0,
                entityName: entityName,
                fromClausePosition: [],
                joinType: null,
                relationPropertyName: null,
                relationType: Relation_1.JSONRelationType.ENTITY_ROOT,
                rootEntityPrefix: 'r_'
            };
            joinRelations.push(onlyJsonRelation);
        }
        var firstRelation = joinRelations[0];
        switch (firstRelation.relationType) {
            case Relation_1.JSONRelationType.ENTITY_ROOT:
                break;
            case Relation_1.JSONRelationType.SUB_QUERY_ROOT:
            case Relation_1.JSONRelationType.SUB_QUERY_JOIN_ON:
                throw "Entity queries FROM clause cannot contain sub-queries";
            case Relation_1.JSONRelationType.ENTITY_JOIN_ON:
                throw "Entity queries cannot use JOIN ON";
            default:
                throw "First table in FROM clause cannot be joined";
        }
        if (firstRelation.relationType !== Relation_1.JSONRelationType.ENTITY_ROOT) {
            throw "First table in FROM clause cannot be joined";
        }
        var alias = Relation_1.QRelation.getAlias(firstRelation);
        var firstEntity = Relation_1.QRelation.createRelatedQEntity(firstRelation, this.qEntityMapByName);
        this.qEntityMapByAlias[alias] = firstEntity;
        // In entity queries the first entity must always be the same as the query entity
        if (firstEntity != this.rootQEntity) {
            throw "Unexpected first table in FROM clause: " + firstRelation.entityName + ", expecting: " + this.rootQEntity.__entityName__;
        }
        jsonTree = new JoinTreeNode_1.JoinTreeNode(firstRelation, [], null);
        joinNodeMap[alias] = jsonTree;
        for (var i = 1; i < joinRelations.length; i++) {
            var joinRelation = joinRelations[i];
            switch (joinRelation.relationType) {
                case Relation_1.JSONRelationType.ENTITY_ROOT:
                    throw "All Entity query tables after the first must be joined";
                case Relation_1.JSONRelationType.SUB_QUERY_ROOT:
                case Relation_1.JSONRelationType.SUB_QUERY_JOIN_ON:
                    throw "Entity queries FROM clause cannot contain sub-queries";
                case Relation_1.JSONRelationType.ENTITY_JOIN_ON:
                    throw "Entity queries cannot use JOIN ON";
                default:
                    break;
            }
            if (!joinRelation.relationPropertyName) {
                throw "Table " + (i + 1) + " in FROM clause is missing relationPropertyName";
            }
            var parentAlias = Relation_1.QRelation.getParentAlias(joinRelation);
            if (!joinNodeMap[parentAlias]) {
                throw "Missing parent entity for alias " + parentAlias + ", on table " + (i + 1) + " in FROM clause";
            }
            var leftNode = joinNodeMap[parentAlias];
            var rightNode = new JoinTreeNode_1.JoinTreeNode(joinRelation, [], leftNode);
            leftNode.addChildNode(rightNode);
            alias = Relation_1.QRelation.getAlias(joinRelation);
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
    EntitySQLStringQuery.prototype.getSELECTFragment = function (entityName, selectSqlFragment, selectClauseFragment, joinTree, entityDefaults, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var tableAlias = Relation_1.QRelation.getAlias(joinTree.jsonRelation);
        var qEntity = this.qEntityMapByAlias[tableAlias];
        var entityMetadata = qEntity.__entityConstructor__;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var retrieveAllOwnFields = false;
        var numProperties = 0;
        for (var propertyName in selectClauseFragment) {
            if (propertyName === '*') {
                retrieveAllOwnFields = true;
                delete selectClauseFragment['*'];
            }
            numProperties++;
        }
        //  For {} select causes or if '*' is present, retrieve the entire object
        if (numProperties === 0 || retrieveAllOwnFields) {
            selectClauseFragment = {};
            for (var propertyName in entityPropertyTypeMap) {
                selectClauseFragment[propertyName] = null;
            }
        }
        var defaults = entityDefaults.getForAlias(tableAlias);
        for (var propertyName in selectClauseFragment) {
            var value = selectClauseFragment[propertyName];
            // Skip undefined values
            if (value === undefined) {
                continue;
            }
            else if (value !== null) {
                defaults[propertyName] = value;
            }
            if (entityPropertyTypeMap[propertyName]) {
                var columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
                var columnSelect = this.getSimpleColumnFragment(value, columnName);
                selectSqlFragment += columnSelect + " " + this.columnAliases.getFollowingAlias();
            }
            else if (entityRelationMap[propertyName]) {
                var subSelectClauseFragment = selectClauseFragment[propertyName];
                if (subSelectClauseFragment == null) {
                    // For null entity reference, retrieve just the id
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
                        var columnSelect = this.getSimpleColumnFragment(value, columnName);
                        selectSqlFragment += columnSelect + " " + this.columnAliases.getFollowingAlias();
                        continue;
                    }
                    else {
                        // Do not retrieve @OneToMay set to null
                        continue;
                    }
                }
                var childEntityName = entityRelationMap[propertyName].entityName;
                selectSqlFragment += this.getSELECTFragment(entityRelationMap[propertyName].entityName, selectSqlFragment, selectClauseFragment[propertyName], joinTree.getEntityRelationChildNode(childEntityName, propertyName), entityDefaults, embedParameters, parameters);
            }
            else {
                throw "Unexpected property '" + propertyName + "' on entity '" + entityName + "' (alias '" + tableAlias + "') in SELECT clause.";
            }
        }
        return selectSqlFragment;
    };
    EntitySQLStringQuery.prototype.getFROMFragment = function (parentTree, currentTree, embedParameters, parameters) {
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
                    throw "Full Joins are not allowed in Entity queries.";
                case Joins_1.JoinType.INNER_JOIN:
                    joinTypeString = 'INNER JOIN';
                    break;
                case Joins_1.JoinType.LEFT_JOIN:
                    joinTypeString = 'LEFT JOIN';
                    break;
                case Joins_1.JoinType.RIGHT_JOIN:
                    throw "Right Joins are not allowed in Entity queries.";
                default:
                    throw "Unsupported join type: " + currentRelation.joinType;
            }
            var rightEntityJoinColumn = void 0, leftColumn = void 0;
            var leftEntityMetadata = leftEntity.__entityConstructor__;
            var rightEntityMetadata = rightEntity.__entityConstructor__;
            var errorPrefix = 'Error building FROM: ';
            switch (currentRelation.relationType) {
                case Relation_1.JSONRelationType.ENTITY_SCHEMA_RELATION:
                    fromFragment += this.getEntitySchemaRelationFromJoin(leftEntity, rightEntity, currentRelation, parentRelation, currentAlias, parentAlias, tableName, joinTypeString, errorPrefix);
                    break;
                default:
                    throw "Only Entity schema relations are allowed in Entity query FROM clause.";
            }
        }
        for (var i = 0; i < currentTree.childNodes.length; i++) {
            var childTreeNode = currentTree.childNodes[i];
            fromFragment += this.getFROMFragment(currentTree, childTreeNode, embedParameters, parameters);
        }
        return fromFragment;
    };
    EntitySQLStringQuery.prototype.getOrderByFragment = function (orderBy) {
        return this.orderByParser.getOrderByFragment(this.joinTree, this.qEntityMapByAlias);
    };
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
    EntitySQLStringQuery.prototype.parseQueryResults = function (results) {
        var _this = this;
        this.queryParser = IEntityResultParser_1.getObjectResultParser(this.queryResultType, this.bridgedQueryConfiguration, this.rootQEntity, this.qEntityMapByName);
        var parsedResults = [];
        if (!results || !results.length) {
            return parsedResults;
        }
        parsedResults = [];
        var lastResult;
        results.forEach(function (result) {
            var entityAlias = Relation_1.QRelation.getAlias(_this.joinTree.jsonRelation);
            _this.columnAliases.reset();
            var parsedResult = _this.parseQueryResult(_this.rootQEntity.__entityName__, _this.phJsonQuery.select, entityAlias, _this.joinTree, result, [0]);
            if (!lastResult) {
                parsedResults.push(parsedResult);
            }
            else if (lastResult !== parsedResult) {
                lastResult = parsedResult;
                parsedResults.push(parsedResult);
            }
            _this.queryParser.flushRow();
        });
        return this.queryParser.bridge(parsedResults, this.phJsonQuery.select);
    };
    EntitySQLStringQuery.prototype.parseQueryResult = function (entityName, selectClauseFragment, entityAlias, currentJoinNode, resultRow, nextFieldIndex) {
        // Return blanks, primitives and Dates directly
        if (!resultRow || !(resultRow instanceof Object) || resultRow instanceof Date) {
            return resultRow;
        }
        var qEntity = this.qEntityMapByAlias[entityAlias];
        var entityMetadata = qEntity.__entityConstructor__;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var resultObject = this.queryParser.addEntity(entityAlias, qEntity);
        var entityId;
        for (var propertyName in selectClauseFragment) {
            if (selectClauseFragment[propertyName] === undefined) {
                continue;
            }
            if (entityPropertyTypeMap[propertyName]) {
                var field = qEntity.__entityFieldMap__[propertyName];
                var dataType = void 0;
                if (field instanceof BooleanField_1.QBooleanField) {
                    dataType = SQLStringQuery_1.SQLDataType.BOOLEAN;
                }
                else if (field instanceof DateField_1.QDateField) {
                    dataType = SQLStringQuery_1.SQLDataType.DATE;
                }
                else if (field instanceof NumberField_1.QNumberField) {
                    dataType = SQLStringQuery_1.SQLDataType.NUMBER;
                }
                else if (field instanceof StringField_1.QStringField) {
                    dataType = SQLStringQuery_1.SQLDataType.STRING;
                }
                var columnAlias = this.columnAliases.getFollowingAlias();
                var defaultValue = this.entityDefaults.getForAlias(entityAlias)[propertyName];
                var propertyValue = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], dataType, defaultValue);
                this.queryParser.addProperty(entityAlias, resultObject, dataType, propertyName, propertyValue);
                if (entityMetadata.idProperty == propertyName) {
                    entityId = propertyValue;
                }
            }
            else if (entityRelationMap[propertyName]) {
                var childSelectClauseFragment = selectClauseFragment[propertyName];
                var relation = qEntity.__entityRelationMap__[propertyName];
                if (childSelectClauseFragment === null) {
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var relationGenericQEntity = this.qEntityMapByName[relation.entityName];
                        var relationEntityMetadata = relationGenericQEntity.__entityConstructor__;
                        var columnAlias = this.columnAliases.getFollowingAlias();
                        var relatedEntityId = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], SQLStringQuery_1.SQLDataType.NUMBER, null);
                        if (EntityUtils_1.EntityUtils.exists(relatedEntityId)) {
                            this.queryParser.bufferManyToOneStub(entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationGenericQEntity, relationEntityMetadata, relatedEntityId);
                        }
                        else {
                            this.queryParser.bufferBlankManyToOneStub(entityAlias, resultObject, propertyName, relationEntityMetadata);
                        }
                    }
                    else {
                        this.queryParser.bufferOneToManyStub(entityName, propertyName);
                    }
                }
                else {
                    var childEntityName = entityRelationMap[propertyName].entityName;
                    var childJoinNode = currentJoinNode.getEntityRelationChildNode(childEntityName, propertyName);
                    var childEntityAlias = Relation_1.QRelation.getAlias(currentJoinNode.jsonRelation);
                    var relationQEntity = this.qEntityMapByAlias[childEntityAlias];
                    var relationEntityMetadata = relationQEntity.__entityConstructor__;
                    var childResultObject = this.parseQueryResult(childEntityName, childSelectClauseFragment, childEntityAlias, childJoinNode, resultRow, nextFieldIndex);
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        if (!EntityUtils_1.EntityUtils.isBlank(childResultObject)) {
                            this.queryParser.bufferManyToOneObject(entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject);
                        }
                        else {
                            this.queryParser.bufferBlankManyToOneObject(entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata);
                        }
                    }
                    else {
                        if (!EntityUtils_1.EntityUtils.isBlank(childResultObject)) {
                            this.queryParser.bufferOneToManyCollection(entityAlias, resultObject, entityName, propertyName, relationEntityMetadata, childResultObject);
                        }
                        else {
                            this.queryParser.bufferBlankOneToMany(entityAlias, resultObject, entityName, propertyName, relationEntityMetadata, childResultObject);
                        }
                    }
                }
            }
            nextFieldIndex[0]++;
        }
        return this.queryParser.flushEntity(entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
    };
    return EntitySQLStringQuery;
}(SQLStringQuery_1.SQLStringQuery));
exports.EntitySQLStringQuery = EntitySQLStringQuery;
//# sourceMappingURL=EntitySQLStringQuery.js.map