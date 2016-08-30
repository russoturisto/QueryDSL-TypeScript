"use strict";
var PHSQLQuery_1 = require("./PHSQLQuery");
var BooleanField_1 = require("../../core/field/BooleanField");
var DateField_1 = require("../../core/field/DateField");
var NumberField_1 = require("../../core/field/NumberField");
var StringField_1 = require("../../core/field/StringField");
var SQLAdaptor_1 = require("./adaptor/SQLAdaptor");
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
        this.defaultsMap = {};
        this.columnAliasMap = {};
        this.joinAliasMap = {};
        this.currentFieldIndex = 0;
        this.sqlAdaptor = SQLAdaptor_1.getSQLAdaptor(dialect);
    }
    SQLStringQuery.prototype.toSQL = function () {
        var entityName = this.qEntity.__entityName__;
        var joinQEntityMap = {};
        var fromFragment = this.getFromFragment(joinQEntityMap, this.joinAliasMap);
        var selectFragment = this.getSelectFragment(entityName, null, this.phJsonQuery.select, this.joinAliasMap, this.columnAliasMap, this.defaultsMap);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap);
        return "SELECT\n" + selectFragment + "\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment;
    };
    SQLStringQuery.prototype.getSelectFragment = function (entityName, existingSelectFragment, selectClauseFragment, joinAliasMap, columnAliasMap, entityDefaultsMap) {
        var qEntity = this.qEntityMap[entityName];
        var entityMetadata = qEntity.__entityConstructor__;
        var columnMap = entityMetadata.columnMap;
        var joinColumnMap = entityMetadata.joinColumns;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var tableAlias = joinAliasMap[entityName];
        if (!tableAlias) {
            throw "Alias for entity " + entityName + " is not defined in the From clause.";
        }
        var selectFragment = '';
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
                var columnName = void 0;
                if (columnMap[propertyName]) {
                    columnName = columnMap[propertyName].name;
                    if (!columnName) {
                        throw "Found @Column but not @Column.name for '" + entityName + "." + propertyName + "' (alias '" + tableAlias + "') in the SELECT clause.";
                    }
                }
                else if (joinColumnMap[propertyName]) {
                    columnName = joinColumnMap[propertyName].name;
                    if (!columnName) {
                        throw "Found @JoinColumn but not @JoinColumn.name for '" + entityName + "." + propertyName + "' (alias '" + tableAlias + "') in the SELECT clause.";
                    }
                }
                else {
                    this.warn("Did not find @Column or @JoinColumn for '" + entityName + "." + propertyName + "' (alias '" + tableAlias + "') in the SELECT clause. Using property name");
                    columnName = propertyName;
                }
                var columnAlias = "column_" + ++this.currentFieldIndex;
                var columnSelect = tableAlias + "." + columnName + " as columnAlias\n";
                columnAliasMap[(tableAlias + "." + propertyName)] = columnAlias;
                if (existingSelectFragment) {
                    columnSelect = "\t, " + columnSelect;
                }
                else {
                    columnSelect = "\t" + columnSelect;
                }
                selectFragment += columnSelect;
            }
            else if (entityRelationMap[propertyName]) {
                var defaultsChildMap = {};
                entityDefaultsMap[propertyName] = defaultsChildMap;
                selectFragment += this.getSelectFragment(entityRelationMap[propertyName].entityName, existingSelectFragment + selectFragment, selectClauseFragment[propertyName], joinAliasMap, columnAliasMap, defaultsChildMap);
            }
            else {
                throw "Unexpected property '" + propertyName + "' on entity '" + entityName + "' (alias '" + tableAlias + "') in SELECT clause.";
            }
        }
        return selectFragment;
    };
    SQLStringQuery.prototype.getFromFragment = function (joinQEntityMap, joinAliasMap) {
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
        var firstEntityMetadata = firstEntity.__entityConstructor__;
        var tableName = firstEntity.__entityName__;
        if (firstEntityMetadata.table && firstEntityMetadata.table.name) {
            tableName = firstEntityMetadata.table.name;
        }
        else {
            this.warn("Did not find @Table.name for first table in FROM clause. Using entity class name.");
        }
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
            var leftEntityMetadata = leftEntity.__entityConstructor__;
            var rightEntityMetadata = rightEntity.__entityConstructor__;
            var tableName_1 = rightEntity.__entityName__;
            if (rightEntityMetadata.table && rightEntityMetadata.table.name) {
                tableName_1 = rightEntityMetadata.table.name;
            }
            else {
                this.warn("Did not find @Table.name for table " + (i + 1) + " in FROM clause. Using entity class name.");
            }
            var joinTypeString = void 0;
            switch (joinRelation.joinType) {
                case PHSQLQuery_1.JoinType.INNER_JOIN:
                    joinTypeString = 'INNER JOIN';
                    break;
                case PHSQLQuery_1.JoinType.LEFT_JOIN:
                    joinTypeString = 'LEFT JOIN';
                    break;
            }
            var rightEntityJoinColumn = void 0, leftColumn = void 0;
            if (rightEntityMetadata.manyToOneMap[joinRelation.relationPropertyName]) {
                var rightEntityJoinColumnMetadata = rightEntityMetadata.joinColumns[joinRelation.relationPropertyName];
                if (!rightEntityJoinColumnMetadata || !rightEntityJoinColumnMetadata.name) {
                    throw "Could not find @JoinColumn for @ManyToOne relation: " + joinRelation.relationPropertyName + " on Right entity in jon for table " + (i + 1) + " in the FROM clause.";
                }
                rightEntityJoinColumn = rightEntityJoinColumnMetadata.name;
                if (!leftEntityMetadata.idProperty) {
                    throw "Could not find @Id for right entity of join to table " + (i + 1) + " in FROM clause";
                }
                leftColumn = leftEntityMetadata.idProperty;
                var leftEntityColumnMetadata = leftEntityMetadata.columnMap[leftColumn];
                if (leftEntityColumnMetadata) {
                    if (leftEntityColumnMetadata.name) {
                        leftColumn = leftEntityColumnMetadata.name;
                    }
                    else {
                        throw "Found @Column but not @Column.name for @Id column of left/parent entity in join for table " + (i + 1) + " in FROM clause";
                    }
                }
                else {
                    this.warn("Did not find @Column.name for @Id column of left/parent entity in join for table " + (i + 1) + " in FROM clause. Using object property name.");
                }
            }
            else if (rightEntityMetadata.oneToManyMap[joinRelation.relationPropertyName]) {
                var rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[joinRelation.relationPropertyName];
                var mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
                if (!mappedByLeftEntityProperty) {
                    throw "Could not find @OneToMany.mappedBy for relation " + joinRelation.relationPropertyName + " of table " + (i + 1) + " in FROM clause.";
                }
                leftEntityMetadata.manyToOneMap[mappedByLeftEntityProperty];
                var leftEntityJoinColumnMetadata = rightEntityMetadata.joinColumns[mappedByLeftEntityProperty];
                if (!leftEntityJoinColumnMetadata || !leftEntityJoinColumnMetadata.name) {
                    throw "Could not find @JoinColumn for @ManyToOne relation: " + joinRelation.relationPropertyName + " on Left entity in jon for table " + (i + 1) + " in the FROM clause.";
                }
                leftColumn = leftEntityJoinColumnMetadata.name;
                if (!rightEntityMetadata.idProperty) {
                    throw "Could not find @Id for right entity of join to table " + (i + 1) + " in FROM clause";
                }
                rightEntityJoinColumn = leftEntityMetadata.idProperty;
                var rightEntityColumnMetadata = leftEntityMetadata.columnMap[rightEntityJoinColumn];
                if (rightEntityColumnMetadata && rightEntityColumnMetadata.name) {
                    if (rightEntityColumnMetadata.name) {
                        rightEntityJoinColumn = rightEntityColumnMetadata.name;
                    }
                    else {
                        throw "Found @Column but not @Column.name for @Id column of Right entity in join for table " + (i + 1) + " in FROM clause.";
                    }
                }
                else {
                    this.warn("Did not find @Column.name for @Id column of Right entity in join for table " + (i + 1) + " in FROM clause. Using object property name.");
                }
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
    SQLStringQuery.prototype.getWHEREFragment = function (operation, nestingIndex, joinQEntityMap) {
        var _this = this;
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
                    var columnMetadata = entityMetadata.columnMap[propertyName];
                    if (columnMetadata) {
                        if (!columnMetadata.name) {
                            throw "Found @Column but not @Column.name for '" + alias + "." + propertyName + "' in a WHERE clause.";
                        }
                        else {
                            whereFragment = alias + "." + columnMetadata.name + " ";
                        }
                    }
                    else {
                        this.warn("Did not find @Column for '" + alias + "." + propertyName + "' in a WHERE clause. Using object property name.");
                        whereFragment = alias + "." + propertyName + " ";
                    }
                    var valueOperation = operation[property];
                    var fieldOperation = void 0;
                    for (var operationProperty in valueOperation) {
                        if (fieldOperation) {
                            throw "More than open operation (" + fieldOperation + ", " + operationProperty + ", ...) is defined on field '" + alias + "." + propertyName + "' used in the WHERE clause.";
                        }
                        fieldOperation = operationProperty;
                    }
                    var operatorAndValueFragment = void 0;
                    var value = valueOperation[fieldOperation];
                    if (field instanceof BooleanField_1.QBooleanField) {
                        operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'boolean');
                        if (!operatorAndValueFragment) {
                            throw "Unexpected operation '" + fieldOperation + "' on field '" + alias + "." + propertyName + "' in the WHERE clause.";
                        }
                    }
                    else if (field instanceof DateField_1.QDateField) {
                        operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'Date', this.sqlAdaptor.dateToDbQuery);
                    }
                    else if (field instanceof NumberField_1.QNumberField) {
                        operatorAndValueFragment = this.getComparibleOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.numberTypeCheck, 'number');
                    }
                    else if (field instanceof StringField_1.QStringField) {
                        operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, this.stringTypeCheck, 'string', this.sanitizeStringValue);
                        if (!operatorAndValueFragment) {
                            switch (fieldOperation) {
                                case '$like':
                                    if (typeof value != 'string') {
                                        this.throwValueOnOperationError('string', '$like (LIKE)', alias, propertyName);
                                    }
                                    operatorAndValueFragment = "LIKE " + this.sanitizeStringValue(value);
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
    SQLStringQuery.prototype.getComparibleOperatorAndValueFragment = function (fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, conversionFunction) {
        var operatorAndValueFragment = this.getCommonOperatorAndValueFragment(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, conversionFunction);
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
            value = conversionFunction(value);
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
    SQLStringQuery.prototype.getCommonOperatorAndValueFragment = function (fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, conversionFunction) {
        var _this = this;
        var sqlOperator;
        switch (fieldOperation) {
            case '$eq':
                sqlOperator = '=';
                if (!typeCheckFunction(value)) {
                    this.throwValueOnOperationError(typeName, '$eq (=)', alias, propertyName);
                }
                if (conversionFunction) {
                    value = conversionFunction(value);
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
                            return conversionFunction(aValue);
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
                    value = conversionFunction(value);
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
                            return conversionFunction(aValue);
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
    SQLStringQuery.prototype.sanitizeStringValue = function (value) {
        // FIXME: sanitize the string to prevent SQL Injection attacks.
        return "'" + value + "'";
    };
    SQLStringQuery.prototype.warn = function (warning) {
        console.log(warning);
    };
    SQLStringQuery.prototype.parseQueryResults = function (entityName, selectClauseFragment, results) {
        var _this = this;
        var parsedResults = [];
        if (!results || !results.length) {
            return parsedResults;
        }
        return results.map(function (result) {
            return _this.parseQueryResult(entityName, selectClauseFragment, result, [0], _this.defaultsMap);
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
        var joinColumnMap = entityMetadata.joinColumns;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var entityAlias = this.joinAliasMap[entityName];
        var resultObject = {};
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
                var childEntityName = entityRelationMap[propertyName].entityName;
                var childSelectClauseFragment = selectClauseFragment[propertyName];
                var childDefaultsMap = entityDefaultsMap[propertyName];
                var childResultObject = this.parseQueryResult(childEntityName, childSelectClauseFragment, resultRow, nextFieldIndex, childDefaultsMap);
                resultObject[propertyName] = childResultObject;
            }
            nextFieldIndex[0]++;
        }
        return resultObject;
    };
    return SQLStringQuery;
}());
exports.SQLStringQuery = SQLStringQuery;
//# sourceMappingURL=SQLStringQuery.js.map