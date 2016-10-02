"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BooleanField_1 = require("../../core/field/BooleanField");
var DateField_1 = require("../../core/field/DateField");
var NumberField_1 = require("../../core/field/NumberField");
var StringField_1 = require("../../core/field/StringField");
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
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
    function SQLStringQuery(phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
        this.phJsonQuery = phJsonQuery;
        this.columnAliasMap = {};
        this.defaultsMap = {};
        this.currentFieldIndex = 0;
    }
    SQLStringQuery.prototype.getFieldMap = function () {
        return this.fieldMap;
    };
    SQLStringQuery.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var entityName = this.qEntity.__entityName__;
        var joinQEntityMap = {};
        var fromFragment = this.getFromFragment(joinQEntityMap, this.joinAliasMap, this.phJsonQuery.from, embedParameters, parameters);
        var selectFragment = this.getSelectFragment(entityName, null, this.phJsonQuery.select, this.joinAliasMap, this.columnAliasMap, this.defaultsMap, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap, embedParameters, parameters);
        return "SELECT\n" + selectFragment + "\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment;
    };
    SQLStringQuery.prototype.getSelectFragment = function (entityName, selectFragment, selectClauseFragment, joinAliasMap, columnAliasMap, entityDefaultsMap, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
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
                selectFragment = this.getSelectFragment(entityRelationMap[propertyName].entityName, selectFragment, selectClauseFragment[propertyName], joinAliasMap, columnAliasMap, defaultsChildMap);
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
        return results.map(function (result) {
            return _this.parseQueryResult(_this.qEntity.__entityName__, _this.phJsonQuery.select, result, [0], _this.defaultsMap);
        });
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
            }
            else if (entityRelationMap[propertyName]) {
                var childSelectClauseFragment = selectClauseFragment[propertyName];
                if (childSelectClauseFragment == null) {
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var fieldKey = entityAlias + "." + propertyName;
                        var columnAlias = this.columnAliasMap[fieldKey];
                        resultObject[propertyName] = this.sqlAdaptor.getResultCellValue(resultRow, columnAlias, nextFieldIndex[0], SQLDataType.NUMBER, null);
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
        return resultObject;
    };
    return SQLStringQuery;
}(SQLStringWhereBase_1.SQLStringWhereBase));
exports.SQLStringQuery = SQLStringQuery;
//# sourceMappingURL=SQLStringQuery.js.map