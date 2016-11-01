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
/**
 * Created by Papa on 10/2/2016.
 */
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
    SQLStringWhereBase.prototype.getWHEREFragment = function (operation, nestingPrefix, joinNodeMap, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var whereFragment = '';
        nestingPrefix = nestingPrefix + "  ";
        switch (operation.category) {
            case Operation_1.OperationCategory.LOGICAL:
                return this.getLogicalWhereFragment(operation, nestingPrefix, joinNodeMap, embedParameters, parameters);
            case Operation_1.OperationCategory.BOOLEAN:
                var aliasColumnPair = property.split('.');
                if (aliasColumnPair.length != 2) {
                    throw "Expecting 'alias.column' instead of " + property;
                }
                var alias = aliasColumnPair[0];
                var joinNode = joinNodeMap[alias];
                if (!joinNode) {
                    throw "Unknown alias '" + alias + "' in WHERE clause";
                }
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
                var valueOperation = operation[property];
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
        }
        return whereFragment;
    };
    SQLStringWhereBase.prototype.getLogicalWhereFragment = function (operation, nestingPrefix, joinNodeMap, embedParameters, parameters) {
        var _this = this;
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
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
                return operator + " (" + this.getWHEREFragment(operation.value, nestingPrefix, joinNodeMap, embedParameters, parameters) + ")";
            default:
                throw "Unknown logical operator: " + operation.operator;
        }
        var childOperations = operation.value;
        if (!(childOperations instanceof Array)) {
            throw "Expecting an array of child operations as a value for operator " + operator + ", in the WHERE Clause.";
        }
        var whereFragment = childOperations.map(function (childOperation) {
            _this.getWHEREFragment(childOperation, nestingPrefix, joinNodeMap, embedParameters, parameters);
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
    return SQLStringWhereBase;
}());
exports.SQLStringWhereBase = SQLStringWhereBase;
//# sourceMappingURL=SQLStringWhereBase.js.map