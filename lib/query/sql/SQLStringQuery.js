"use strict";
var PHSQLQuery_1 = require("./PHSQLQuery");
var BooleanField_1 = require("../../core/field/BooleanField");
var DateField_1 = require("../../core/field/DateField");
var NumberField_1 = require("../../core/field/NumberField");
var StringField_1 = require("../../core/field/StringField");
var SQLAdaptor_1 = require("./adaptor/SQLAdaptor");
var FieldMap_1 = require("./FieldMap");
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
var SQLStringQuery = (function () {
    function SQLStringQuery(phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        this.phJsonQuery = phJsonQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.dialect = dialect;
        this.columnAliasMap = {};
        this.defaultsMap = {};
        this.fieldMap = new FieldMap_1.FieldMap();
        this.joinAliasMap = {};
        this.currentFieldIndex = 0;
        this.sqlAdaptor = SQLAdaptor_1.getSQLAdaptor(dialect);
    }
    SQLStringQuery.prototype.getFieldMap = function () {
        return this.fieldMap;
    };
    SQLStringQuery.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var entityName = this.qEntity.__entityName__;
        var joinQEntityMap = {};
        var fromFragment = this.getFromFragment(joinQEntityMap, this.joinAliasMap, embedParameters, parameters);
        var selectFragment = this.getSelectFragment(entityName, null, this.phJsonQuery.select, this.joinAliasMap, this.columnAliasMap, this.defaultsMap, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap, embedParameters, parameters);
        return "SELECT\n" + selectFragment + "\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment;
    };
    SQLStringQuery.prototype.addField = function (entityName, tableName, propertyName, columnName) {
        this.fieldMap.ensure(entityName, tableName).ensure(propertyName, columnName);
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
    SQLStringQuery.prototype.getEntityPropertyColumnName = function (qEntity, propertyName, tableAlias) {
        var entityName = qEntity.__entityName__;
        var entityMetadata = qEntity.__entityConstructor__;
        var columnMap = entityMetadata.columnMap;
        var columnName = this.getPropertyColumnName(entityName, propertyName, tableAlias, columnMap);
        this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);
        return columnName;
    };
    SQLStringQuery.prototype.getPropertyColumnName = function (entityName, propertyName, tableAlias, columnMap) {
        var columnName;
        if (columnMap && columnMap[propertyName]) {
            columnName = columnMap[propertyName].name;
            if (!columnName) {
                throw "Found @Column but not @Column.name for '" + entityName + "." + propertyName + "' (alias '" + tableAlias + "') in the SELECT clause.";
            }
        }
        else {
            this.warn("Did not find @Column for '" + entityName + "." + propertyName + "' (alias '" + tableAlias + "') in the SELECT clause. Using property name");
            columnName = propertyName;
        }
        return columnName;
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
    SQLStringQuery.prototype.getTableName = function (qEntity) {
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
    SQLStringQuery.prototype.getFromFragment = function (joinQEntityMap, joinAliasMap, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var joinRelations = this.phJsonQuery.from;
        if (joinRelations.length < 1) {
            throw "Expecting at least one table in FROM clause";
        }
        var firstRelation = joinRelations[0];
        var fromFragment = 'FROM\t';
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
    SQLStringQuery.prototype.getWHEREFragment = function (operation, nestingIndex, joinQEntityMap, embedParameters, parameters) {
        var _this = this;
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var whereFragment = '';
        var nestingPrefix = '';
        for (var i = 0; i < nestingIndex; i++) {
            nestingPrefix += '\t';
        }
        var foundProperty;
        for (var property in operation) {
            if (foundProperty) {
                throw "More than one property found in a WHERE Clause operation " + foundProperty + ", " + property + ", ...";
            }
            foundProperty = property;
            var operator = void 0;
            switch (property) {
                case '$and':
                    operator = 'AND';
                case '$or':
                    operator = 'OR';
                    var childOperations = operation[property];
                    if (!(childOperations instanceof Array)) {
                        throw "Expecting an array of child operations as a value for operator " + operator + ", in the WHERE Clause.";
                    }
                    whereFragment = childOperations.map(function (childOperation) {
                        _this.getWHEREFragment(childOperation, nestingIndex + 1, joinQEntityMap);
                    }).join("\n" + nestingPrefix + operator + " ");
                    whereFragment = "( " + whereFragment + " )";
                    break;
                case '$not':
                    operator = 'NOT';
                    whereFragment = operator + " " + this.getWHEREFragment(operation[property], nestingIndex + 1, joinQEntityMap);
                    break;
                default:
                    var aliasColumnPair = property.split('.');
                    if (aliasColumnPair.length != 2) {
                        throw "Expecting 'alias.column' instead of " + property;
                    }
                    var alias = aliasColumnPair[0];
                    var qEntity = joinQEntityMap[alias];
                    if (!qEntity) {
                        throw "Unknown alias '" + alias + "' in WHERE clause";
                    }
                    var entityMetadata = qEntity.__entityConstructor__;
                    var propertyName = aliasColumnPair[1];
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        throw "Found @ManyToOne property '" + alias + "." + propertyName + "' -  cannot be used in a WHERE clause.";
                    }
                    else if (entityMetadata.oneToManyMap[propertyName]) {
                        throw "Found @ManyToOne property '" + alias + "." + propertyName + "' -  cannot be used in a WHERE clause.";
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
        }
        return whereFragment;
    };
    SQLStringQuery.prototype.getComparibleOperatorAndValueFragment = function (fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters, parameters, conversionFunction) {
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
    SQLStringQuery.prototype.getCommonOperatorAndValueFragment = function (fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters, parameters, conversionFunction) {
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
    SQLStringQuery.prototype.booleanTypeCheck = function (valueToCheck) {
        return typeof valueToCheck === 'boolean';
    };
    SQLStringQuery.prototype.dateTypeCheck = function (valueToCheck) {
        // TODO: see if there is a more appropriate way to check serialized Dates
        if (typeof valueToCheck === 'number') {
            valueToCheck = new Date(valueToCheck);
        }
        return valueToCheck instanceof Date;
    };
    SQLStringQuery.prototype.numberTypeCheck = function (valueToCheck) {
        return typeof valueToCheck === 'number';
    };
    SQLStringQuery.prototype.stringTypeCheck = function (valueToCheck) {
        return typeof valueToCheck === 'string';
    };
    SQLStringQuery.prototype.throwValueOnOperationError = function (valueType, operation, alias, propertyName) {
        throw "Expecting a string value for $eq (=) operation on '" + alias + "." + propertyName + "' used in the WHERE clause.";
    };
    SQLStringQuery.prototype.sanitizeStringValue = function (value, embedParameters) {
        // FIXME: sanitize the string to prevent SQL Injection attacks.
        if (embedParameters) {
            value = "'" + value + "'";
        }
        return value;
    };
    SQLStringQuery.prototype.warn = function (warning) {
        console.log(warning);
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
}());
exports.SQLStringQuery = SQLStringQuery;
//# sourceMappingURL=SQLStringQuery.js.map