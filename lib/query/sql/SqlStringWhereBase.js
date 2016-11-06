"use strict";
var SQLAdaptor_1 = require("./adaptor/SQLAdaptor");
var BooleanField_1 = require("../../core/field/BooleanField");
var DateField_1 = require("../../core/field/DateField");
var NumberField_1 = require("../../core/field/NumberField");
var StringField_1 = require("../../core/field/StringField");
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
    ClauseType[ClauseType["FUNCTION_CLALL"] = 3] = "FUNCTION_CLALL";
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
        this.embedParameters = false;
        this.parameters = [];
        this.sqlAdaptor = SQLAdaptor_1.getSQLAdaptor(this, dialect);
        this.validator = Validator_1.getValidator(this.qEntityMapByName);
    }
    SQLStringWhereBase.prototype.getWHEREFragment = function (operation, nestingPrefix) {
        var whereFragment = '';
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
                var aliasColumnPair = property.split('.');
                if (aliasColumnPair.length != 2) {
                    throw "Expecting 'alias.column' instead of " + property;
                }
                var alias = aliasColumnPair[0];
                var qEntity = this.qEntityMapByAlias[alias];
                var entityMetadata = qEntity.__entityConstructor__;
                var propertyName = aliasColumnPair[1];
                if (entityMetadata.manyToOneMap[propertyName]) {
                    throw "Found @ManyToOne property '" + alias + "." + propertyName + "' -  cannot be used in a WHERE clause.";
                }
                else if (entityMetadata.oneToManyMap[propertyName]) {
                    throw "Found @OneToMany property '" + alias + "." + propertyName + "' -  cannot be used in a WHERE clause.";
                }
                else if (entityMetadata.transient[propertyName]) {
                    throw "Found @Transient property '" + alias + "." + propertyName + "' -  cannot be used in a WHERE clause.";
                }
                var field = qEntity.__entityFieldMap__[propertyName];
                if (!field) {
                    throw "Did not find field '" + alias + "." + propertyName + "' used in the WHERE clause.";
                }
                var columnName = this.getEntityPropertyColumnName(qEntity, propertyName, alias);
                whereFragment = alias + "." + columnName + " ";
                var fieldOperation = void 0;
                for (var operationProperty in valueOperation) {
                    if (fieldOperation) {
                        throw "More than one operation (" + fieldOperation + ", " + operationProperty + ", ...) is defined on field '" + alias + "." + propertyName + "' used in the WHERE clause.";
                    }
                    fieldOperation = operationProperty;
                }
                var operatorAndValueFragment = void 0;
                var value = valueOperation[fieldOperation];
                if (field instanceof BooleanField_1.QBooleanField) {
                    operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'boolean', embedParameters, parameters);
                    if (!operatorAndValueFragment) {
                        throw "Unexpected operation '" + fieldOperation + "' on field '" + alias + "." + propertyName + "' in the WHERE clause.";
                    }
                }
                else if (field instanceof DateField_1.QDateField) {
                    operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'Date', embedParameters, parameters, this.sqlAdaptor.dateToDbQuery);
                }
                else if (field instanceof NumberField_1.QNumberField) {
                    operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'number', embedParameters, parameters);
                }
                else if (field instanceof StringField_1.QStringField) {
                    operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'string', embedParameters, parameters, this.sanitizeStringValue);
                    if (!operatorAndValueFragment) {
                        switch (fieldOperation) {
                            case '$like':
                                if (typeof value != 'string') {
                                    this.throwValueOnOperationError('string', '$like (LIKE)', alias, propertyName);
                                }
                                value = this.sanitizeStringValue(value, embedParameters);
                                if (!embedParameters) {
                                    parameters.push(value);
                                    value = '?';
                                }
                                operatorAndValueFragment = "LIKE " + value;
                                break;
                            default:
                                throw "Unexpected operation '" + fieldOperation + "' on field '" + alias + "." + propertyName + "' in the WHERE clause.";
                        }
                    }
                }
                else {
                    throw "Unexpected type '" + field.constructor.name + "' of field '" + alias + "." + propertyName + "' for operation '" + fieldOperation + "' in the WHERE clause.";
                }
                whereFragment += operatorAndValueFragment;
                break;
            case Operation_1.OperationCategory.FUNCTION:
                // exists function and maybe others
                break;
        }
        return whereFragment;
    };
    SQLStringWhereBase.prototype.getLogicalWhereFragment = function (operation, nestingPrefix) {
        var _this = this;
        var operator;
        switch (operation.operation) {
            case '$and':
                operator = 'AND';
                break;
            case '$or':
                operator = 'OR';
                break;
            case '$not':
                operator = 'NOT';
                return operator + " (" + this.getWHEREFragment(operation.value, nestingPrefix) + ")";
            default:
                throw "Unknown logical operator: " + operation.operation;
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
    SQLStringWhereBase.prototype.getComparibleOperatorAndValueFragment = function (fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters, parameters, conversionFunction) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters, parameters, conversionFunction);
        if (operatorAndValueFragment) {
            return operatorAndValueFragment;
        }
        var opString;
        switch (fieldOperation) {
            case '$gt':
                opString = '$gt (>)';
                break;
            case '$gte':
                opString = '$gte (>=)';
                break;
            case '$lt':
                opString = '$lt (<)';
                break;
            case '$lte':
                opString = '$gt (<=)';
                break;
            default:
                throw "Unexpected operation '" + fieldOperation + "' on field '" + alias + "." + propertyName + "' in the WHERE clause.";
        }
        if (!typeCheckFunction(value)) {
            this.throwValueOnOperationError(typeName, opString, alias, propertyName);
        }
        if (conversionFunction) {
            value = conversionFunction(value, embedParameters);
        }
        if (!embedParameters) {
            parameters.push(value);
            value = '?';
        }
        switch (fieldOperation) {
            case '$gt':
                return "> " + value;
            case '$gte':
                return ">= " + value;
            case '$lt':
                return "< " + value;
            case '$lte':
                return "<= " + value;
            default:
                throw "Unexpected operation '" + fieldOperation + "' on field '" + alias + "." + propertyName + "' in the WHERE clause.";
        }
    };
    SQLStringWhereBase.prototype.getCommonOperatorAndValueFragment = function (fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters, parameters, conversionFunction) {
        var _this = this;
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var sqlOperator;
        switch (fieldOperation) {
            case '$eq':
                sqlOperator = '=';
                if (!typeCheckFunction(value)) {
                    this.throwValueOnOperationError(typeName, '$eq (=)', alias, propertyName);
                }
                if (conversionFunction) {
                    value = conversionFunction(value, embedParameters);
                }
                break;
            case '$exists':
                if (value === true) {
                    sqlOperator = 'IS NOT NULL';
                }
                else if (value === false) {
                    sqlOperator = 'IS NULL';
                }
                else {
                    throw "Invalid $exists value, expecting 'true' (IS NOT NULL), or 'false' (IS NULL)";
                }
                break;
            case '$in':
                sqlOperator = 'IN';
                if (!(value instanceof Array)) {
                    this.throwValueOnOperationError(typeName + "[]", '$in (IN)', alias, propertyName);
                }
                value = value.map(function (aValue) {
                    if (!typeCheckFunction(aValue)) {
                        _this.throwValueOnOperationError(typeName + "[]", '$eq (=)', alias, propertyName);
                        if (conversionFunction) {
                            return conversionFunction(aValue, embedParameters);
                        }
                        else {
                            return aValue;
                        }
                    }
                }).join(', ');
                break;
            case '$ne':
                sqlOperator = '!=';
                if (!typeCheckFunction(value)) {
                    this.throwValueOnOperationError(typeName, '$ne (!=)', alias, propertyName);
                }
                if (conversionFunction) {
                    value = conversionFunction(value, embedParameters);
                }
                break;
            case '$nin':
                sqlOperator = 'NOT IN';
                if (!(value instanceof Array)) {
                    this.throwValueOnOperationError(typeName + "[]", '$in (IN)', alias, propertyName);
                }
                value = value.map(function (aValue) {
                    if (!typeCheckFunction(aValue)) {
                        _this.throwValueOnOperationError(typeName + "[]", '$eq (=)', alias, propertyName);
                        if (conversionFunction) {
                            return conversionFunction(aValue, embedParameters);
                        }
                        else {
                            return aValue;
                        }
                    }
                }).join(', ');
                break;
            default:
                return undefined;
        }
        if (!embedParameters) {
            parameters.push(value);
            value = '?';
        }
        return sqlOperator + " " + value;
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
    SQLStringWhereBase.prototype.throwValueOnOperationError = function (valueType, operation, alias, propertyName) {
        throw "Expecting a string value for $eq (=) operation on '" + alias + "." + propertyName + "' used in the WHERE clause.";
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
        return this.getFieldValue(rawValue, ClauseType.FUNCTION_CLALL);
    };
    SQLStringWhereBase.prototype.getFieldValue = function (clauseField, clauseType, defaultCallback) {
        if (defaultCallback === void 0) { defaultCallback = null; }
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
                    aValue = this.getFieldValue(aValue, ClauseType.FUNCTION_CLALL, defaultCallback);
                }
                this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(clauseField, aValue, this.qEntityMapByAlias, this.embedParameters, this.parameters);
                break;
            case Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION:
                throw "Distinct function cannot be nested.";
            case Appliable_1.JSONClauseObjectType.EXISTS_FUNCTION:
                if (clauseType !== ClauseType.WHERE_CLAUSE) {
                    throw "Exists function only as a top function in a WHERE clause.";
                }
                var mappedSqlQuery = new MappedSQLStringQuery_1.MappedSQLStringQuery(clauseField.value, this.qEntityMapByName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, this.dialect);
                return "EXISTS(" + mappedSqlQuery.toSQL() + ")";
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
                if (clauseType !== ClauseType.MAPPED_SELECT_CLAUSE) {
                    "Nested objects only allowed in the mapped SELECT clause.";
                }
                return defaultCallback();
        }
    };
    SQLStringWhereBase.prototype.isPrimitive = function (value) {
        if (value === null || value === undefined || value === '' || value === NaN) {
            throw "Invalid query value: " + value;
        }
        switch (typeof value) {
            case "boolean":
            case "number":
            case "string":
                return true;
        }
        if (value instanceof Date) {
            return true;
        }
        return false;
    };
    SQLStringWhereBase.prototype.parsePrimitive = function (primitiveValue) {
        if (this.embedParameters) {
            this.parameters.push(primitiveValue);
            return this.sqlAdaptor.getParameterSymbol();
        }
        switch (typeof primitiveValue) {
            case "boolean":
            case "number":
            case "string":
                return '' + primitiveValue;
        }
        if (primitiveValue instanceof Date) {
            return this.sqlAdaptor.dateToDbQuery(primitiveValue);
        }
        throw "Cannot parse a non-primitive value";
    };
    SQLStringWhereBase.prototype.getSimpleColumnFragment = function (value, columnName) {
        return value.tableAlias + "." + columnName;
    };
    SQLStringWhereBase.prototype.getComplexColumnFragment = function (value, columnName) {
        var selectSqlFragment = value.tableAlias + "." + columnName;
        selectSqlFragment = this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(value, selectSqlFragment, this.qEntityMapByAlias, this.embedParameters, this.parameters);
        return selectSqlFragment;
    };
    SQLStringWhereBase.prototype.getEntityManyToOneColumnName = function (qEntity, propertyName, tableAlias) {
        var entityName = qEntity.__entityName__;
        var entityMetadata = qEntity.__entityConstructor__;
        var columnName = MetadataUtils_1.MetadataUtils.getJoinColumnName(propertyName, entityMetadata, tableAlias);
        this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);
        return columnName;
    };
    return SQLStringWhereBase;
}());
exports.SQLStringWhereBase = SQLStringWhereBase;
//# sourceMappingURL=SQLStringWhereBase.js.map