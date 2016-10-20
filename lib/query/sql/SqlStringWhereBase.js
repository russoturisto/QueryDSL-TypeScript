"use strict";
var _this = this;
var SQLAdaptor_1 = require("./adaptor/SQLAdaptor");
var BooleanField_1 = require("../../core/field/BooleanField");
var DateField_1 = require("../../core/field/DateField");
var NumberField_1 = require("../../core/field/NumberField");
var StringField_1 = require("../../core/field/StringField");
var Operation_1 = require("../../core/operation/Operation");
var FieldMap_1 = require("./FieldMap");
var MetadataUtils_1 = require("../../core/entity/metadata/MetadataUtils");
/**
 * Created by Papa on 10/2/2016.
 */
var SQLStringWhereBase = (function () {
    function SQLStringWhereBase(rootQEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        this.rootQEntity = rootQEntity;
        this.qEntityMapByName = qEntityMapByName;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.dialect = dialect;
        this.fieldMap = new FieldMap_1.FieldMap();
        this.qEntityMapByAlias = {};
        this.sqlAdaptor = SQLAdaptor_1.getSQLAdaptor(dialect);
    }
    SQLStringWhereBase.prototype.getWHEREFragment = function (operation, nestingIndex, joinNodeMap, embedParameters, parameters) {
        var _this = this;
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var whereFragment = '';
        var nestingPrefix = '';
        for (var i = 0; i < nestingIndex; i++) {
            nestingPrefix += '\t';
        }
        var operator;
        switch (operation.category) {
            case Operation_1.OperationCategory.LOGICAL:
                switch (operation.operator) {
                    case '$and':
                        operator = 'AND';
                    case '$or':
                        operator = 'OR';
                }
                var childOperations = operation[property];
                if (!(childOperations instanceof Array)) {
                    throw "Expecting an array of child operations as a value for operator " + operator + ", in the WHERE Clause.";
                }
                whereFragment = childOperations.map(function (childOperation) {
                    _this.getWHEREFragment(childOperation, nestingIndex + 1, joinNodeMap, embedParameters, parameters);
                }).join("\n" + nestingPrefix + operator + " ");
                whereFragment = "( " + whereFragment + " )";
                break;
            case '$not':
                operator = 'NOT';
                whereFragment = operator + " " + this.getWHEREFragment(operation[property], nestingIndex + 1, joinNodeMap, embedParameters, parameters);
                break;
            default:
        }
        B;
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
        var fieldOperation;
        for (var operationProperty in valueOperation) {
            if (fieldOperation) {
                throw "More than one operation (" + fieldOperation + ", " + operationProperty + ", ...) is defined on field '" + alias + "." + propertyName + "' used in the WHERE clause.";
            }
            fieldOperation = operationProperty;
        }
        var operatorAndValueFragment;
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
    };
    return SQLStringWhereBase;
}());
exports.SQLStringWhereBase = SQLStringWhereBase;
return whereFragment;
getComparibleOperatorAndValueFragment(fieldOperation, string, value, any, alias, string, propertyName, string, typeCheckFunction, function (value) { return boolean; }, typeName, string, embedParameters, boolean = true, parameters, any[] = null, conversionFunction ?  : function (value, embedParameters) {
    return any;
});
string;
{
    var operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters, parameters, conversionFunction);
    if (operatorAndValueFragment) {
        return operatorAndValueFragment;
    }
    var opString = void 0;
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
}
getCommonOperatorAndValueFragment(fieldOperation, string, value, any, alias, string, propertyName, string, typeCheckFunction, function (value) { return boolean; }, typeName, string, embedParameters, boolean = true, parameters, any[] = null, conversionFunction ?  : function (value, embedParameters) {
    return any;
});
string;
{
    var sqlOperator = void 0;
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
}
getEntityPropertyColumnName(qEntity, IQEntity, propertyName, string, tableAlias, string);
string;
{
    var entityName = qEntity.__entityName__;
    var entityMetadata = qEntity.__entityConstructor__;
    var columnName = MetadataUtils_1.MetadataUtils.getPropertyColumnName(propertyName, entityMetadata, tableAlias);
    this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);
    return columnName;
}
getTableName(qEntity, IQEntity);
string;
{
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
}
throwValueOnOperationError(valueType, string, operation, string, alias, string, propertyName, string);
{
    throw "Expecting a string value for $eq (=) operation on '" + alias + "." + propertyName + "' used in the WHERE clause.";
}
sanitizeStringValue(value, string, embedParameters, boolean);
string;
{
    // FIXME: sanitize the string to prevent SQL Injection attacks.
    if (embedParameters) {
        value = "'" + value + "'";
    }
    return value;
}
booleanTypeCheck(valueToCheck, any);
boolean;
{
    return typeof valueToCheck === 'boolean';
}
dateTypeCheck(valueToCheck, any);
boolean;
{
    // TODO: see if there is a more appropriate way to check serialized Dates
    if (typeof valueToCheck === 'number') {
        valueToCheck = new Date(valueToCheck);
    }
    return valueToCheck instanceof Date;
}
numberTypeCheck(valueToCheck, any);
boolean;
{
    return typeof valueToCheck === 'number';
}
stringTypeCheck(valueToCheck, any);
boolean;
{
    return typeof valueToCheck === 'string';
}
addField(entityName, string, tableName, string, propertyName, string, columnName, string);
void {
    this: .fieldMap.ensure(entityName, tableName).ensure(propertyName, columnName)
};
warn(warning, string);
void {
    console: .log(warning)
};
//# sourceMappingURL=SQLStringWhereBase.js.map