"use strict";
var SQLAdaptor_1 = require("./adaptor/SQLAdaptor");
var Operation_1 = require("../../core/operation/Operation");
var FieldMap_1 = require("./FieldMap");
var MetadataUtils_1 = require("../../core/entity/metadata/MetadataUtils");
var Validator_1 = require("../../validation/Validator");
var Appliable_1 = require("../../core/field/Appliable");
var FieldSQLStringQuery_1 = require("./query/string/FieldSQLStringQuery");
var MappedSQLStringQuery_1 = require("./query/string/MappedSQLStringQuery");
/**
 * Created by Papa on 10/2/2016.
 */
(function (ClauseType) {
    ClauseType[ClauseType["MAPPED_SELECT_CLAUSE"] = 0] = "MAPPED_SELECT_CLAUSE";
    ClauseType[ClauseType["NON_MAPPED_SELECT_CLAUSE"] = 1] = "NON_MAPPED_SELECT_CLAUSE";
    ClauseType[ClauseType["WHERE_CLAUSE"] = 2] = "WHERE_CLAUSE";
    ClauseType[ClauseType["FUNCTION_CALL"] = 3] = "FUNCTION_CALL";
})(exports.ClauseType || (exports.ClauseType = {}));
var ClauseType = exports.ClauseType;
var SQLStringWhereBase = (function () {
    function SQLStringWhereBase(qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        this.qEntityMapByName = qEntityMapByName;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.dialect = dialect;
        this.fieldMap = new FieldMap_1.FieldMap();
        this.qEntityMapByAlias = {};
        this.sqlAdaptor = SQLAdaptor_1.getSQLAdaptor(this, dialect);
        this.validator = Validator_1.getValidator(this.qEntityMapByName);
    }
    SQLStringWhereBase.prototype.getWHEREFragment = function (operation, nestingPrefix) {
        var whereFragment = '';
        if (!operation) {
            throw "An operation is missing in WHERE or HAVING clause";
        }
        nestingPrefix = nestingPrefix + "\t";
        switch (operation.category) {
            case Operation_1.OperationCategory.LOGICAL:
                return this.getLogicalWhereFragment(operation, nestingPrefix);
            case Operation_1.OperationCategory.BOOLEAN:
            case Operation_1.OperationCategory.DATE:
            case Operation_1.OperationCategory.NUMBER:
            case Operation_1.OperationCategory.STRING:
                var valueOperation = operation;
                var lValue = valueOperation.lValue;
                var rValue = valueOperation.rValue;
                var lValueSql = this.getFieldValue(valueOperation.lValue, ClauseType.WHERE_CLAUSE);
                var rValueSql = this.getFieldValue(valueOperation.rValue, ClauseType.WHERE_CLAUSE);
                var rValueWithOperator = this.applyOperator(valueOperation.operator, rValueSql);
                whereFragment += "" + lValueSql + rValueWithOperator;
                break;
            case Operation_1.OperationCategory.FUNCTION:
                var functionOperation = operation;
                whereFragment = this.getFieldValue(functionOperation.object, ClauseType.WHERE_CLAUSE);
                // exists function and maybe others
                break;
        }
        return whereFragment;
    };
    SQLStringWhereBase.prototype.getLogicalWhereFragment = function (operation, nestingPrefix) {
        var _this = this;
        var operator;
        switch (operation.operator) {
            case '$and':
                operator = 'AND';
                break;
            case '$or':
                operator = 'OR';
                break;
            case '$not':
                operator = 'NOT';
                return " " + operator + " (" + this.getWHEREFragment(operation.value, nestingPrefix) + ")";
            default:
                throw "Unknown logical operator: " + operation.operator;
        }
        var childOperations = operation.value;
        if (!(childOperations instanceof Array)) {
            throw "Expecting an array of child operations as a value for operator " + operator + ", in the WHERE Clause.";
        }
        var whereFragment = childOperations.map(function (childOperation) {
            _this.getWHEREFragment(childOperation, nestingPrefix);
        }).join("\n" + nestingPrefix + operator + " ");
        return "( " + whereFragment + " )";
    };
    SQLStringWhereBase.prototype.getEntityPropertyColumnName = function (qEntity, propertyName, tableAlias) {
        var entityName = qEntity.__entityName__;
        var entityMetadata = qEntity.__entityConstructor__;
        var columnName = MetadataUtils_1.MetadataUtils.getPropertyColumnName(propertyName, entityMetadata, tableAlias);
        this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);
        return columnName;
    };
    SQLStringWhereBase.prototype.getTableName = function (qEntity) {
        var tableName = qEntity.__entityName__;
        var entityMetadata = qEntity.__entityConstructor__;
        if (entityMetadata.table) {
            if (!entityMetadata.table.name) {
                throw "Found @Table but not @Table.name for entity: " + tableName;
            }
            else {
                tableName = entityMetadata.table.name;
            }
        }
        else {
            this.warn("Did not find @Table.name for first table in FROM clause. Using entity class name.");
        }
        return tableName;
    };
    SQLStringWhereBase.prototype.sanitizeStringValue = function (value, embedParameters) {
        // FIXME: sanitize the string to prevent SQL Injection attacks.
        if (embedParameters) {
            value = "'" + value + "'";
        }
        return value;
    };
    SQLStringWhereBase.prototype.booleanTypeCheck = function (valueToCheck) {
        return typeof valueToCheck === 'boolean';
    };
    SQLStringWhereBase.prototype.dateTypeCheck = function (valueToCheck) {
        // TODO: see if there is a more appropriate way to check serialized Dates
        if (typeof valueToCheck === 'number') {
            valueToCheck = new Date(valueToCheck);
        }
        return valueToCheck instanceof Date;
    };
    SQLStringWhereBase.prototype.numberTypeCheck = function (valueToCheck) {
        return typeof valueToCheck === 'number';
    };
    SQLStringWhereBase.prototype.stringTypeCheck = function (valueToCheck) {
        return typeof valueToCheck === 'string';
    };
    SQLStringWhereBase.prototype.addField = function (entityName, tableName, propertyName, columnName) {
        this.fieldMap.ensure(entityName, tableName).ensure(propertyName, columnName);
    };
    SQLStringWhereBase.prototype.warn = function (warning) {
        console.log(warning);
    };
    SQLStringWhereBase.prototype.getFunctionCallValue = function (rawValue) {
        return this.getFieldValue(rawValue, ClauseType.FUNCTION_CALL);
    };
    SQLStringWhereBase.prototype.getFieldValue = function (clauseField, clauseType, defaultCallback) {
        var _this = this;
        if (defaultCallback === void 0) { defaultCallback = null; }
        var columnName;
        if (!clauseField) {
            throw "Missing Clause Field definition";
        }
        if (clauseField instanceof Array) {
            return clauseField
                .map(function (clauseFieldMember) { return _this.getFieldValue(clauseFieldMember, clauseType, defaultCallback); })
                .join(', ');
        }
        if (!clauseField.objectType) {
            throw "Type is not defined in JSONClauseField";
        }
        var aField = clauseField;
        var aValue;
        switch (clauseField.objectType) {
            case Appliable_1.JSONClauseObjectType.FIELD_FUNCTION:
                aValue = aField.value;
                if (this.isParameterReference(aValue)) {
                    this.parameterReferences.push(aValue);
                    aValue = this.sqlAdaptor.getParameterReference(this.parameterReferences, aValue);
                }
                else {
                    aValue = this.getFieldValue(aValue, ClauseType.FUNCTION_CALL, defaultCallback);
                }
                this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(aField, aValue, this.qEntityMapByAlias);
                this.validator.addFunctionAlias(aField.fieldAlias);
                break;
            case Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION:
                throw "Distinct function cannot be nested.";
            case Appliable_1.JSONClauseObjectType.EXISTS_FUNCTION:
                if (clauseType !== ClauseType.WHERE_CLAUSE) {
                    throw "Exists can only be used as a top function in a WHERE clause.";
                }
                var mappedSqlQuery = new MappedSQLStringQuery_1.MappedSQLStringQuery(aField.value, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
                return "EXISTS(" + mappedSqlQuery.toSQL() + ")";
            case Appliable_1.JSONClauseObjectType.FIELD:
                var qEntity = this.qEntityMapByAlias[aField.tableAlias];
                this.validator.validateReadQEntityProperty(aField.propertyName, qEntity, aField.fieldAlias);
                columnName = this.getEntityPropertyColumnName(qEntity, aField.propertyName, aField.tableAlias);
                this.addField(qEntity.__entityName__, this.getTableName(qEntity), aField.propertyName, columnName);
                return this.getComplexColumnFragment(aField, columnName);
            case Appliable_1.JSONClauseObjectType.FIELD_QUERY:
                var jsonFieldSqlQuery = aField.fieldSubQuery;
                var fieldSqlQuery = new FieldSQLStringQuery_1.FieldSQLStringQuery(jsonFieldSqlQuery, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
                fieldSqlQuery.addQEntityMapByAlias(this.qEntityMapByAlias);
                this.validator.addSubQueryAlias(aField.fieldAlias);
                return "(" + fieldSqlQuery.toSQL() + ")";
            case Appliable_1.JSONClauseObjectType.MANY_TO_ONE_RELATION:
                this.validator.validateReadQEntityManyToOneRelation(aField.propertyName, qEntity, aField.fieldAlias);
                columnName = this.getEntityManyToOneColumnName(qEntity, aField.propertyName, aField.tableAlias);
                this.addField(qEntity.__entityName__, this.getTableName(qEntity), aField.propertyName, columnName);
                return this.getComplexColumnFragment(aField, columnName);
            // must be a nested object
            default:
                if (clauseType !== ClauseType.MAPPED_SELECT_CLAUSE) {
                    "Nested objects only allowed in the mapped SELECT clause.";
                }
                return defaultCallback();
        }
    };
    SQLStringWhereBase.prototype.isParameterReference = function (value) {
        if (value === null) {
            return false;
        }
        if (value === undefined || value === '' || value === NaN) {
            throw "Invalid query value: " + value;
        }
        switch (typeof value) {
            case "boolean":
            case "number":
                throw "Unexpected primitive isntance, expecting parameter alias.";
            case "string":
                return true;
        }
        if (value instanceof Date) {
            throw "Unexpected date instance, expecting parameter alias.";
        }
        return false;
    };
    SQLStringWhereBase.prototype.getSimpleColumnFragment = function (value, columnName) {
        return value.tableAlias + "." + columnName;
    };
    SQLStringWhereBase.prototype.getComplexColumnFragment = function (value, columnName) {
        var selectSqlFragment = value.tableAlias + "." + columnName;
        selectSqlFragment = this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(value, selectSqlFragment, this.qEntityMapByAlias);
        return selectSqlFragment;
    };
    SQLStringWhereBase.prototype.getEntityManyToOneColumnName = function (qEntity, propertyName, tableAlias) {
        var entityName = qEntity.__entityName__;
        var entityMetadata = qEntity.__entityConstructor__;
        var columnName = MetadataUtils_1.MetadataUtils.getJoinColumnName(propertyName, entityMetadata, tableAlias);
        this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);
        return columnName;
    };
    SQLStringWhereBase.prototype.applyOperator = function (operator, rValue) {
        switch (operator) {
            case "$eq":
                return " = " + rValue;
            case "$gt":
                return " > " + rValue;
            case "$gte":
                return " >= " + rValue;
            case "$isNotNull":
                return " IS NOT NULL";
            case "$isNull":
                return " IS NULL";
            case "$in":
                return " IN (" + rValue + ")";
            case "$lt":
                return " < " + rValue;
            case "$lte":
                return " <= " + rValue;
            case "$ne":
                return " != " + rValue;
            case "$nin":
                return " NOT IN (" + rValue + ")";
            case "$like":
                return " LIKE " + rValue;
            default:
                throw "Unsupported operator " + operator;
        }
    };
    return SQLStringWhereBase;
}());
exports.SQLStringWhereBase = SQLStringWhereBase;
//# sourceMappingURL=SQLStringWhereBase.js.map