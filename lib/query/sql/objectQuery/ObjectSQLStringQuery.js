"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Papa on 10/16/2016.
 */
var Relation_1 = require("../../../core/entity/Relation");
var SQLStringQuery_1 = require("../SQLStringQuery");
var IObjectResultParser_1 = require("../objectQuery/resultParser/IObjectResultParser");
var BooleanField_1 = require("../../../core/field/BooleanField");
var DateField_1 = require("../../../core/field/DateField");
var NumberField_1 = require("../../../core/field/NumberField");
var StringField_1 = require("../../../core/field/StringField");
var EntityUtils_1 = require("../../../core/utils/EntityUtils");
/**
 * Represents SQL String query with object tree Select clause.
 */
var ObjectSQLStringQuery = (function (_super) {
    __extends(ObjectSQLStringQuery, _super);
    function ObjectSQLStringQuery(phJsonQuery, qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType, bridgedQueryConfiguration) {
        _super.call(this, phJsonQuery, qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType);
        this.bridgedQueryConfiguration = bridgedQueryConfiguration;
        if (bridgedQueryConfiguration && this.bridgedQueryConfiguration.strict !== undefined) {
            throw "\"strict\" configuration is not yet implemented for QueryResultType.BRIDGED";
        }
    }
    ObjectSQLStringQuery.prototype.getSELECTFragment = function (entityName, selectSqlFragment, selectClauseFragment, joinTree, entityDefaults, embedParameters, parameters) {
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
    ObjectSQLStringQuery.prototype.getOrderByFragment = function (orderBy) {
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
    ObjectSQLStringQuery.prototype.parseQueryResults = function (results) {
        var _this = this;
        this.queryParser = IObjectResultParser_1.getObjectResultParser(this.queryResultType, this.bridgedQueryConfiguration, this.rootQEntity, this.qEntityMapByName);
        var parsedResults = [];
        if (!results || !results.length) {
            return parsedResults;
        }
        parsedResults = [];
        var lastResult;
        results.forEach(function (result) {
            var entityAlias = Relation_1.QRelation.getAlias(_this.joinTree.jsonRelation);
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
    ObjectSQLStringQuery.prototype.parseQueryResult = function (entityName, selectClauseFragment, entityAlias, currentJoinNode, resultRow, nextFieldIndex) {
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
                var columnAlias = this.columnAliases.getAlias(entityAlias, propertyName);
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
                        var columnAlias = this.columnAliases.getAlias(entityAlias, propertyName);
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
                    var childJoinNode = currentJoinNode.getChildNode(childEntityName, propertyName);
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
    return ObjectSQLStringQuery;
}(SQLStringQuery_1.SQLStringQuery));
exports.ObjectSQLStringQuery = ObjectSQLStringQuery;
//# sourceMappingURL=ObjectSQLStringQuery.js.map