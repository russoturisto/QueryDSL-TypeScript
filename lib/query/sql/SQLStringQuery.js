"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHSQLQuery_1 = require("./PHSQLQuery");
var BooleanField_1 = require("../../core/field/BooleanField");
var DateField_1 = require("../../core/field/DateField");
var NumberField_1 = require("../../core/field/NumberField");
var StringField_1 = require("../../core/field/StringField");
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
var QueryLinker_1 = require("./QueryLinker");
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
var SQLStringQuery = (function (_super) {
    __extends(SQLStringQuery, _super);
    function SQLStringQuery(phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, performLinking) {
        if (performLinking === void 0) { performLinking = true; }
        _super.call(this, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
        this.phJsonQuery = phJsonQuery;
        this.columnAliasMap = {};
        this.defaultsMap = {};
        this.currentFieldIndex = 0;
        this.queryLinker = new QueryLinker_1.QueryLinker(performLinking, qEntityMap);
    }
    SQLStringQuery.prototype.getFieldMap = function () {
        return this.fieldMap;
    };
    SQLStringQuery.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var entityName = this.qEntity.__entityName__;
        var joinQEntityMap = {};
        var fromFragment = this.getFROMFragment(joinQEntityMap, this.joinAliasMap, this.phJsonQuery.from, embedParameters, parameters);
        var selectEntitySet = {};
        var selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinAliasMap, this.columnAliasMap, this.defaultsMap, selectEntitySet, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap, embedParameters, parameters);
        return "SELECT\n" + selectFragment + "\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment;
    };
    SQLStringQuery.prototype.getFROMFragment = function (joinQEntityMap, joinAliasMap, joinRelations, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        if (joinRelations.length < 1) {
            throw "Expecting at least one table in FROM clause";
        }
        var firstRelation = joinRelations[0];
        var fromFragment = '\t';
        if (firstRelation.relationPropertyName || firstRelation.joinType || firstRelation.parentEntityAlias) {
            throw "First table in FROM clause cannot be joined";
        }
        var firstEntity = this.qEntityMap[firstRelation.entityName];
        if (firstEntity != this.qEntity) {
            throw "Unexpected first table in FROM clause: " + firstRelation.entityName + ", expecting: " + this.qEntity.__entityName__;
        }
        var tableName = this.getTableName(firstEntity);
        if (!firstRelation.alias) {
            throw "Missing an alias for the first table in the FROM clause.";
        }
        fromFragment += tableName + " " + firstRelation.alias;
        joinQEntityMap[firstRelation.alias] = firstEntity;
        joinAliasMap[firstEntity.__entityName__] = firstRelation.alias;
        for (var i = 1; i < joinRelations.length; i++) {
            var joinRelation = joinRelations[i];
            if (!joinRelation.relationPropertyName) {
                throw "Table " + (i + 1) + " in FROM clause is missing relationPropertyName";
            }
            if (!joinRelation.joinType) {
                throw "Table " + (i + 1) + " in FROM clause is missing joinType";
            }
            if (!joinRelation.parentEntityAlias) {
                throw "Table " + (i + 1) + " in FROM clause is missing parentEntityAlias";
            }
            if (!joinQEntityMap[joinRelation.parentEntityAlias]) {
                throw "Missing parent entity for alias " + joinRelation.parentEntityAlias + ", on table " + (i + 1) + " in FROM clause";
            }
            var leftEntity = joinQEntityMap[joinRelation.parentEntityAlias];
            if (!joinRelation.alias) {
                throw "Missing an alias for the first table in the FROM clause.";
            }
            var rightEntity = this.qEntityMap[joinRelation.entityName];
            if (!rightEntity) {
                throw "Could not find entity " + joinRelation.entityName + " for table " + (i + 1) + " in FROM clause";
            }
            if (joinQEntityMap[joinRelation.alias]) {
                throw "Multiple instances of same entity currently not supported in FROM clause";
            }
            joinQEntityMap[joinRelation.alias] = rightEntity;
            joinAliasMap[rightEntity.__entityName__] = joinRelation.alias;
            var tableName_1 = this.getTableName(rightEntity);
            var joinTypeString = void 0;
            /*
             switch (joinRelation.joinType) {
             case SQLJoinType.INNER_JOIN:
             joinTypeString = 'INNER JOIN';
             break;
             case SQLJoinType.LEFT_JOIN:
             joinTypeString = 'LEFT JOIN';
             break;
             default:
             throw `Unsupported join type: ${joinRelation.joinType}`;
             }
             */
            // FIXME: figure out why the switch statement above quit working
            if (joinRelation.joinType === PHSQLQuery_1.JoinType.INNER_JOIN) {
                joinTypeString = 'INNER JOIN';
            }
            else if (joinRelation.joinType === PHSQLQuery_1.JoinType.LEFT_JOIN) {
                joinTypeString = 'LEFT JOIN';
            }
            else {
                throw "Unsupported join type: " + joinRelation.joinType;
            }
            var rightEntityJoinColumn = void 0, leftColumn = void 0;
            var leftEntityMetadata = leftEntity.__entityConstructor__;
            var rightEntityMetadata = rightEntity.__entityConstructor__;
            if (rightEntityMetadata.manyToOneMap[joinRelation.relationPropertyName]) {
                rightEntityJoinColumn = this.getEntityManyToOneColumnName(rightEntity, joinRelation.relationPropertyName, joinRelation.parentEntityAlias);
                if (!leftEntityMetadata.idProperty) {
                    throw "Could not find @Id for right entity of join to table " + (i + 1) + " in FROM clause";
                }
                leftColumn = this.getEntityPropertyColumnName(leftEntity, leftEntityMetadata.idProperty, joinRelation.alias);
            }
            else if (rightEntityMetadata.oneToManyMap[joinRelation.relationPropertyName]) {
                var rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[joinRelation.relationPropertyName];
                var mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
                if (!mappedByLeftEntityProperty) {
                    throw "Could not find @OneToMany.mappedBy for relation " + joinRelation.relationPropertyName + " of table " + (i + 1) + " in FROM clause.";
                }
                leftColumn = this.getEntityManyToOneColumnName(leftEntity, mappedByLeftEntityProperty, joinRelation.alias);
                if (!rightEntityMetadata.idProperty) {
                    throw "Could not find @Id for right entity of join to table " + (i + 1) + " in FROM clause";
                }
                rightEntityJoinColumn = this.getEntityPropertyColumnName(rightEntity, rightEntityMetadata.idProperty, joinRelation.parentEntityAlias);
            }
            else {
                throw "Relation for table " + (i + i) + " (" + tableName_1 + ") in FROM clause is not listed as @ManyToOne or @OneToMany";
            }
            fromFragment += "\t" + joinTypeString + " " + tableName_1 + " " + joinRelation.alias;
            // TODO: add support for custom JOIN ON clauses
            fromFragment += "\t\tON " + joinRelation.parentEntityAlias + "." + rightEntityJoinColumn + " = " + joinRelation.alias + "." + leftColumn;
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
    SQLStringQuery.prototype.getSELECTFragment = function (entityName, selectFragment, selectClauseFragment, joinAliasMap, columnAliasMap, entityDefaultsMap, selectEntitySet, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        if (selectEntitySet[entityName]) {
            throw "Multiple instances of the same entity currently not supported in SELECT clause (but auto-populated for the sub-tree).";
        }
        selectEntitySet[entityName] = true;
        var qEntity = this.qEntityMap[entityName];
        var entityMetadata = qEntity.__entityConstructor__;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var tableAlias = joinAliasMap[entityName];
        if (!tableAlias) {
            throw "Alias for entity " + entityName + " is not defined in the From clause.";
        }
        var retrieveAllOwnFields = false;
        var numProperties = 0;
        for (var propertyName in selectClauseFragment) {
            if (propertyName === '*') {
                retrieveAllOwnFields = true;
                delete selectClauseFragment['*'];
            }
            numProperties++;
        }
        //  For {} select causes or if __allOwnFields__ is present, retrieve the entire object
        if (numProperties === 0 || retrieveAllOwnFields) {
            selectClauseFragment = {};
            for (var propertyName in entityPropertyTypeMap) {
                selectClauseFragment[propertyName] = null;
            }
        }
        for (var propertyName in selectClauseFragment) {
            var value = selectClauseFragment[propertyName];
            // Skip undefined values
            if (value === undefined) {
                continue;
            }
            else if (value !== null) {
                entityDefaultsMap[propertyName] = value;
            }
            if (entityPropertyTypeMap[propertyName]) {
                var columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
                var columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, columnAliasMap, selectFragment);
                selectFragment += columnSelect;
            }
            else if (entityRelationMap[propertyName]) {
                var defaultsChildMap = {};
                entityDefaultsMap[propertyName] = defaultsChildMap;
                var subSelectClauseFragment = selectClauseFragment[propertyName];
                if (subSelectClauseFragment == null) {
                    // For null entity reference, retrieve just the id
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
                        var columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, columnAliasMap, selectFragment);
                        selectFragment += columnSelect;
                        continue;
                    }
                    else {
                        // Do not retrieve @OneToMay set to null
                        continue;
                    }
                }
                selectFragment += this.getSELECTFragment(entityRelationMap[propertyName].entityName, selectFragment, selectClauseFragment[propertyName], joinAliasMap, columnAliasMap, defaultsChildMap, selectEntitySet, embedParameters, parameters);
            }
            else {
                throw "Unexpected property '" + propertyName + "' on entity '" + entityName + "' (alias '" + tableAlias + "') in SELECT clause.";
            }
        }
        return selectFragment;
    };
    SQLStringQuery.prototype.getColumnSelectFragment = function (propertyName, tableAlias, columnName, columnAliasMap, existingSelectFragment) {
        var columnAlias = "column_" + ++this.currentFieldIndex;
        var columnSelect = tableAlias + "." + columnName + " as " + columnAlias + "\n";
        columnAliasMap[(tableAlias + "." + propertyName)] = columnAlias;
        if (existingSelectFragment) {
            columnSelect = "\t, " + columnSelect;
        }
        else {
            columnSelect = "\t" + columnSelect;
        }
        return columnSelect;
    };
    SQLStringQuery.prototype.parseQueryResults = function (results) {
        var _this = this;
        var parsedResults = [];
        if (!results || !results.length) {
            return parsedResults;
        }
        parsedResults = results.map(function (result) {
            return _this.parseQueryResult(_this.qEntity.__entityName__, _this.phJsonQuery.select, result, [0], _this.defaultsMap);
        });
        this.queryLinker.link(parsedResults);
        return parsedResults;
    };
    SQLStringQuery.prototype.parseQueryResult = function (entityName, selectClauseFragment, resultRow, nextFieldIndex, entityDefaultsMap) {
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
        var entityAlias = this.joinAliasMap[entityName];
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
                var fieldKey = entityAlias + "." + propertyName;
                var columnAlias = this.columnAliasMap[fieldKey];
                var defaultValue = entityDefaultsMap[propertyName];
                resultObject[propertyName] = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], dataType, defaultValue);
                if (entityMetadata.idProperty == propertyName) {
                    entityId = resultObject[propertyName];
                    this.queryLinker.addEntity(qEntity, entityMetadata, resultObject, propertyName);
                }
            }
            else if (entityRelationMap[propertyName]) {
                var childSelectClauseFragment = selectClauseFragment[propertyName];
                if (childSelectClauseFragment == null) {
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var fieldKey = entityAlias + "." + propertyName;
                        var columnAlias = this.columnAliasMap[fieldKey];
                        var relatedEntityId = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], SQLDataType.NUMBER, null);
                        this.queryLinker.addManyToOneStub(qEntity, entityMetadata, resultObject, propertyName, relatedEntityId);
                    }
                    else {
                        this.queryLinker.bufferOneToManyStub(resultObject, propertyName);
                    }
                }
                else {
                    var childDefaultsMap = entityDefaultsMap[propertyName];
                    var childEntityName = entityRelationMap[propertyName].entityName;
                    var childResultObject = this.parseQueryResult(childEntityName, childSelectClauseFragment, resultRow, nextFieldIndex, childDefaultsMap);
                    resultObject[propertyName] = childResultObject;
                }
            }
            nextFieldIndex[0]++;
        }
        this.queryLinker.flushOneToManyStubBuffer(qEntity, entityMetadata, entityId);
        return resultObject;
    };
    return SQLStringQuery;
}(SQLStringWhereBase_1.SQLStringWhereBase));
exports.SQLStringQuery = SQLStringQuery;
//# sourceMappingURL=SQLStringQuery.js.map