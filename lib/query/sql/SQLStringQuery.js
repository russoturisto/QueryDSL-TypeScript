"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHSQLQuery_1 = require("./PHSQLQuery");
var Relation_1 = require("../../core/entity/Relation");
var BooleanField_1 = require("../../core/field/BooleanField");
var DateField_1 = require("../../core/field/DateField");
var NumberField_1 = require("../../core/field/NumberField");
var StringField_1 = require("../../core/field/StringField");
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
var QueryBridge_1 = require("./QueryBridge");
var MappedEntityArray_1 = require("../../core/MappedEntityArray");
/**
 * Created by Papa on 8/20/2016.
 */
(function (SQLDialect) {
    SQLDialect[SQLDialect["SQLITE"] = 0] = "SQLITE";
    SQLDialect[SQLDialect["ORACLE"] = 1] = "ORACLE";
})(exports.SQLDialect || (exports.SQLDialect = {}));
var SQLDialect = exports.SQLDialect;
(function (SQLDataType) {
    SQLDataType[SQLDataType["BOOLEAN"] = 0] = "BOOLEAN";
    SQLDataType[SQLDataType["DATE"] = 1] = "DATE";
    SQLDataType[SQLDataType["NUMBER"] = 2] = "NUMBER";
    SQLDataType[SQLDataType["STRING"] = 3] = "STRING";
})(exports.SQLDataType || (exports.SQLDataType = {}));
var SQLDataType = exports.SQLDataType;
var EntityDefaults = (function () {
    function EntityDefaults() {
        this.map = {};
    }
    EntityDefaults.prototype.getForAlias = function (alias) {
        var defaultsForAlias = this.map[alias];
        if (!defaultsForAlias) {
            defaultsForAlias = {};
            this.map[alias] = defaultsForAlias;
        }
        return defaultsForAlias;
    };
    return EntityDefaults;
}());
exports.EntityDefaults = EntityDefaults;
var SQLStringQuery = (function (_super) {
    __extends(SQLStringQuery, _super);
    function SQLStringQuery(phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, performBridging) {
        if (performBridging === void 0) { performBridging = true; }
        _super.call(this, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
        this.phJsonQuery = phJsonQuery;
        this.columnAliases = new Relation_1.ColumnAliases();
        this.entityDefaults = new EntityDefaults();
        this.queryBridge = new QueryBridge_1.QueryBridge(performBridging, new QueryBridge_1.QueryBridgeConfiguration(), qEntity, qEntityMap);
    }
    SQLStringQuery.prototype.getFieldMap = function () {
        return this.fieldMap;
    };
    /**
     * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
     * result set.
     */
    SQLStringQuery.prototype.buildJoinTree = function () {
        var entityName = this.qEntity.__entityName__;
        var joinNodeMap = {};
        this.joinTree = this.buildFromJoinTree(entityName, this.phJsonQuery.from, joinNodeMap);
        this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, false, []);
    };
    SQLStringQuery.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var entityName = this.qEntity.__entityName__;
        var joinNodeMap = {};
        this.joinTree = this.buildFromJoinTree(entityName, this.phJsonQuery.from, joinNodeMap);
        var selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, embedParameters, parameters);
        var fromFragment = this.getFROMFragment(null, this.joinTree, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinNodeMap, embedParameters, parameters);
        return "SELECT\n" + selectFragment + "\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment;
    };
    SQLStringQuery.prototype.buildFromJoinTree = function (entityName, joinRelations, joinNodeMap) {
        var jsonTree;
        if (joinRelations.length < 1) {
            var onlyJsonRelation = {
                fromClausePosition: [],
                entityName: entityName,
                joinType: null,
                relationPropertyName: null
            };
            joinRelations.push(onlyJsonRelation);
        }
        var firstRelation = joinRelations[0];
        if (firstRelation.relationPropertyName || firstRelation.joinType || firstRelation.fromClausePosition.length > 0) {
            throw "First table in FROM clause cannot be joined";
        }
        var firstEntity = this.qEntityMap[firstRelation.entityName];
        if (firstEntity != this.qEntity) {
            throw "Unexpected first table in FROM clause: " + firstRelation.entityName + ", expecting: " + this.qEntity.__entityName__;
        }
        jsonTree = new Relation_1.JoinTreeNode(firstRelation, []);
        var alias = Relation_1.QRelation.getAlias(firstRelation);
        joinNodeMap[alias] = jsonTree;
        for (var i = 1; i < joinRelations.length; i++) {
            var joinRelation = joinRelations[i];
            if (!joinRelation.relationPropertyName) {
                throw "Table " + (i + 1) + " in FROM clause is missing relationPropertyName";
            }
            if (!joinRelation.joinType) {
                throw "Table " + (i + 1) + " in FROM clause is missing joinType";
            }
            var parentAlias = Relation_1.QRelation.getParentAlias(joinRelation);
            if (!joinNodeMap[parentAlias]) {
                throw "Missing parent entity for alias " + parentAlias + ", on table " + (i + 1) + " in FROM clause";
            }
            var leftNode = joinNodeMap[parentAlias];
            var rightNode = new Relation_1.JoinTreeNode(joinRelation, []);
            leftNode.addChildNode(rightNode);
            alias = Relation_1.QRelation.getAlias(joinRelation);
            var rightEntity = this.qEntityMap[joinRelation.entityName];
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
    SQLStringQuery.prototype.getSELECTFragment = function (entityName, selectSqlFragment, selectClauseFragment, joinTree, entityDefaults, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var qEntity = this.qEntityMap[entityName];
        var entityMetadata = qEntity.__entityConstructor__;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var tableAlias = Relation_1.QRelation.getAlias(joinTree.jsonRelation);
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
            var fieldKey = tableAlias + "." + propertyName;
            if (entityPropertyTypeMap[propertyName]) {
                var columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
                var columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, selectSqlFragment);
                selectSqlFragment += columnSelect;
            }
            else if (entityRelationMap[propertyName]) {
                var subSelectClauseFragment = selectClauseFragment[propertyName];
                if (subSelectClauseFragment == null) {
                    // For null entity reference, retrieve just the id
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
                        var columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, selectSqlFragment);
                        selectSqlFragment += columnSelect;
                        continue;
                    }
                    else {
                        // Do not retrieve @OneToMay set to null
                        continue;
                    }
                }
                var childEntityName = entityRelationMap[propertyName].entityName;
                selectSqlFragment += this.getSELECTFragment(entityRelationMap[propertyName].entityName, selectSqlFragment, selectClauseFragment[propertyName], joinTree.getChildNode(childEntityName, propertyName), entityDefaults, embedParameters, parameters);
            }
            else {
                throw "Unexpected property '" + propertyName + "' on entity '" + entityName + "' (alias '" + tableAlias + "') in SELECT clause.";
            }
        }
        return selectSqlFragment;
    };
    SQLStringQuery.prototype.getColumnSelectFragment = function (propertyName, tableAlias, columnName, existingSelectFragment) {
        var columnAlias = this.columnAliases.addAlias(tableAlias, propertyName);
        var columnSelect = tableAlias + "." + columnName + " as " + columnAlias + "\n";
        if (existingSelectFragment) {
            columnSelect = "\t, " + columnSelect;
        }
        else {
            columnSelect = "\t" + columnSelect;
        }
        return columnSelect;
    };
    SQLStringQuery.prototype.getFROMFragment = function (parentTree, currentTree, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var fromFragment = '\t';
        var currentRelation = currentTree.jsonRelation;
        var qEntity = this.qEntityMap[currentRelation.entityName];
        var tableName = this.getTableName(qEntity);
        var currentAlias = Relation_1.QRelation.getAlias(currentRelation);
        if (!parentTree) {
            fromFragment += tableName + " " + currentAlias;
        }
        else {
            var parentRelation = parentTree.jsonRelation;
            var parentAlias = Relation_1.QRelation.getAlias(parentRelation);
            var leftEntity = this.qEntityMap[parentRelation.entityName];
            var rightEntity = this.qEntityMap[currentRelation.entityName];
            var joinTypeString = void 0;
            switch (currentRelation.joinType) {
                case PHSQLQuery_1.JoinType.INNER_JOIN:
                    joinTypeString = 'INNER JOIN';
                    break;
                case PHSQLQuery_1.JoinType.LEFT_JOIN:
                    joinTypeString = 'LEFT JOIN';
                    break;
                default:
                    throw "Unsupported join type: " + currentRelation.joinType;
            }
            // FIXME: figure out why the switch statement above quit working
            /*			if (joinRelation.joinType === <number>JoinType.INNER_JOIN) {
             joinTypeString = 'INNER JOIN';
             } else if (joinRelation.joinType === <number>JoinType.LEFT_JOIN) {
             joinTypeString = 'LEFT JOIN';
             } else {
             throw `Unsupported join type: ${joinRelation.joinType}`;
             }*/
            var rightEntityJoinColumn = void 0, leftColumn = void 0;
            var leftEntityMetadata = leftEntity.__entityConstructor__;
            var rightEntityMetadata = rightEntity.__entityConstructor__;
            var errorPrefix = 'Error building FROM: ';
            if (rightEntityMetadata.manyToOneMap[currentRelation.relationPropertyName]) {
                rightEntityJoinColumn = this.getEntityManyToOneColumnName(rightEntity, currentRelation.relationPropertyName, parentAlias);
                if (!leftEntityMetadata.idProperty) {
                    throw errorPrefix + " Could not find @Id for right entity of join to table  '" + parentRelation.entityName + "." + currentRelation.relationPropertyName + "'";
                }
                leftColumn = this.getEntityPropertyColumnName(leftEntity, leftEntityMetadata.idProperty, currentAlias);
            }
            else if (rightEntityMetadata.oneToManyMap[currentRelation.relationPropertyName]) {
                var rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[currentRelation.relationPropertyName];
                var mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
                if (!mappedByLeftEntityProperty) {
                    throw errorPrefix + " Could not find @OneToMany.mappedBy for relation '" + parentRelation.entityName + "." + currentRelation.relationPropertyName + "'.";
                }
                leftColumn = this.getEntityManyToOneColumnName(leftEntity, mappedByLeftEntityProperty, currentAlias);
                if (!rightEntityMetadata.idProperty) {
                    throw errorPrefix + " Could not find @Id for right entity of join to table '" + currentRelation.entityName + "' ";
                }
                rightEntityJoinColumn = this.getEntityPropertyColumnName(rightEntity, rightEntityMetadata.idProperty, parentAlias);
            }
            else {
                throw errorPrefix + " Relation '" + parentRelation.entityName + "." + currentRelation.relationPropertyName + "' for table (" + tableName + ") is not listed as @ManyToOne or @OneToMany";
            }
            fromFragment += "\t" + joinTypeString + " " + tableName + " " + currentAlias;
            // TODO: add support for custom JOIN ON clauses
            fromFragment += "\t\tON " + parentAlias + "." + rightEntityJoinColumn + " = " + currentAlias + "." + leftColumn;
        }
        for (var i = 0; i < currentTree.childNodes.length; i++) {
            var childTreeNode = currentTree.childNodes[i];
            fromFragment += this.getFROMFragment(currentTree, childTreeNode, embedParameters, parameters);
        }
        return fromFragment;
    };
    SQLStringQuery.prototype.getEntityManyToOneColumnName = function (qEntity, propertyName, tableAlias) {
        var entityName = qEntity.__entityName__;
        var entityMetadata = qEntity.__entityConstructor__;
        var joinColumnMap = entityMetadata.joinColumnMap;
        var columnName = this.getManyToOneColumnName(entityName, propertyName, tableAlias, joinColumnMap);
        this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);
        return columnName;
    };
    SQLStringQuery.prototype.getManyToOneColumnName = function (entityName, propertyName, tableAlias, joinColumnMap) {
        var columnName;
        if (joinColumnMap && joinColumnMap[propertyName]) {
            columnName = joinColumnMap[propertyName].name;
            if (!columnName) {
                throw "Found @JoinColumn but not @JoinColumn.name for '" + entityName + "." + propertyName + "' (alias '" + tableAlias + "') in the SELECT clause.";
            }
        }
        else {
            this.warn("Did not find @JoinColumn for '" + entityName + "." + propertyName + "' (alias '" + tableAlias + "') in the SELECT clause. Using property name");
            columnName = propertyName;
        }
        return columnName;
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
    SQLStringQuery.prototype.parseQueryResults = function (results) {
        var _this = this;
        var parsedResults = [];
        if (!results || !results.length) {
            return parsedResults;
        }
        parsedResults = [];
        var lastResult;
        results.forEach(function (result) {
            var parsedResult = _this.parseQueryResult(null, null, _this.qEntity.__entityName__, _this.phJsonQuery.select, _this.joinTree, result, [0]);
            if (!lastResult) {
                parsedResults.push(parsedResult);
            }
            else if (lastResult !== parsedResult) {
                lastResult = parsedResult;
                parsedResults.push(parsedResult);
            }
        });
        return this.queryBridge.bridge(parsedResults, this.phJsonQuery.select);
    };
    SQLStringQuery.prototype.parseQueryResult = function (parentEntityName, parentPropertyName, entityName, selectClauseFragment, currentJoinNode, resultRow, nextFieldIndex) {
        // Return blanks, primitives and Dates directly
        if (!resultRow || !(resultRow instanceof Object) || resultRow instanceof Date) {
            return resultRow;
        }
        var qEntity = this.qEntityMap[entityName];
        var entityMetadata = qEntity.__entityConstructor__;
        var columnMap = entityMetadata.columnMap;
        var joinColumnMap = entityMetadata.joinColumnMap;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var entityId;
        var entityAlias = Relation_1.QRelation.getAlias(currentJoinNode.jsonRelation);
        var resultObject = new qEntity.__entityConstructor__();
        for (var propertyName in selectClauseFragment) {
            if (selectClauseFragment[propertyName] === undefined) {
                continue;
            }
            if (entityPropertyTypeMap[propertyName]) {
                var field = qEntity.__entityFieldMap__[propertyName];
                var dataType = void 0;
                if (field instanceof BooleanField_1.QBooleanField) {
                    dataType = SQLDataType.BOOLEAN;
                }
                else if (field instanceof DateField_1.QDateField) {
                    dataType = SQLDataType.DATE;
                }
                else if (field instanceof NumberField_1.QNumberField) {
                    dataType = SQLDataType.NUMBER;
                }
                else if (field instanceof StringField_1.QStringField) {
                    dataType = SQLDataType.STRING;
                }
                var columnAlias = this.columnAliases.getAlias(entityAlias, propertyName);
                var defaultValue = this.entityDefaults.getForAlias(entityAlias)[propertyName];
                resultObject[propertyName] = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], dataType, defaultValue);
                this.queryBridge.addProperty(entityAlias, resultObject, dataType, propertyName);
                if (entityMetadata.idProperty == propertyName) {
                    entityId = resultObject[propertyName];
                }
            }
            else if (entityRelationMap[propertyName]) {
                var childSelectClauseFragment = selectClauseFragment[propertyName];
                var relation = qEntity.__entityRelationMap__[propertyName];
                var relationQEntity = this.qEntityMap[relation.entityName];
                var relationEntityMetadata = relationQEntity.__entityConstructor__;
                if (childSelectClauseFragment == null) {
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var columnAlias = this.columnAliases.getAlias(entityAlias, propertyName);
                        var relatedEntityId = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], SQLDataType.NUMBER, null);
                        var manyToOneStub = {};
                        resultObject[propertyName] = manyToOneStub;
                        manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
                        this.queryBridge.bufferManyToOneStub(qEntity, entityMetadata, resultObject, propertyName, relatedEntityId);
                    }
                    else {
                        this.queryBridge.bufferOneToManyStub(resultObject, entityName, propertyName);
                    }
                }
                else {
                    var childEntityName = entityRelationMap[propertyName].entityName;
                    var childJoinNode = currentJoinNode.getChildNode(childEntityName, propertyName);
                    var childResultObject = this.parseQueryResult(entityName, propertyName, childEntityName, childSelectClauseFragment, childJoinNode, resultRow, nextFieldIndex);
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        resultObject[propertyName] = childResultObject;
                        this.queryBridge.bufferManyToOneStub(qEntity, entityMetadata, resultObject, propertyName, relatedEntityId);
                    }
                    else {
                        var childResultsArray = new MappedEntityArray_1.MappedEntityArray(relationEntityMetadata.idProperty);
                        resultObject[propertyName] = childResultsArray;
                        childResultsArray.put(childResultObject);
                        this.queryBridge.bufferOneToManyStub(resultObject, entityName, propertyName);
                    }
                }
            }
            nextFieldIndex[0]++;
        }
        return this.queryBridge.flushEntity(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
    };
    return SQLStringQuery;
}(SQLStringWhereBase_1.SQLStringWhereBase));
exports.SQLStringQuery = SQLStringQuery;
//# sourceMappingURL=SQLStringQuery.js.map