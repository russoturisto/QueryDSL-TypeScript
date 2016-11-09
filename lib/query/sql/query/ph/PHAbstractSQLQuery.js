"use strict";
var PHMappedSQLQuery_1 = require("./PHMappedSQLQuery");
var OperableField_1 = require("../../../../core/field/OperableField");
var PHFieldSQLQuery_1 = require("./PHFieldSQLQuery");
var Operation_1 = require("../../../../core/operation/Operation");
var Entity_1 = require("../../../../core/entity/Entity");
var Aliases_1 = require("../../../../core/entity/Aliases");
/**
 * Created by Papa on 10/27/2016.
 */
var PHAbstractSQLQuery = (function () {
    function PHAbstractSQLQuery(entityAliases, columnAliases) {
        if (entityAliases === void 0) { entityAliases = new Aliases_1.EntityAliases(); }
        if (columnAliases === void 0) { columnAliases = entityAliases.getNewFieldColumnAliases(); }
        this.entityAliases = entityAliases;
        this.columnAliases = columnAliases;
        this.isEntityQuery = false;
    }
    PHAbstractSQLQuery.prototype.getNonEntitySqlQuery = function (rawQuery, jsonQuery) {
        var from = this.fromClauseToJSON(rawQuery.from);
        jsonQuery.from = from;
        jsonQuery.where = PHAbstractSQLQuery.whereClauseToJSON(rawQuery.where, this.columnAliases);
        jsonQuery.groupBy = this.groupByClauseToJSON(rawQuery.groupBy);
        jsonQuery.having = PHAbstractSQLQuery.whereClauseToJSON(rawQuery.having, this.columnAliases);
        jsonQuery.orderBy = this.orderByClauseToJSON(rawQuery.orderBy);
        jsonQuery.limit = rawQuery.limit;
        jsonQuery.offset = rawQuery.offset;
        return jsonQuery;
    };
    PHAbstractSQLQuery.prototype.fromClauseToJSON = function (fromClause) {
        var _this = this;
        return fromClause.map(function (fromEntity) {
            if (!(fromEntity instanceof Entity_1.QEntity)) {
                throw "FROM clause can contain only Views or Entities.";
            }
            if (_this.isEntityQuery) {
                if (fromEntity instanceof Entity_1.QView) {
                    throw "Entity FROM clauses can contain only Entities.";
                }
            }
            return fromEntity.getRelationJson(_this.columnAliases);
        });
    };
    PHAbstractSQLQuery.whereClauseToJSON = function (whereClause, columnAliases) {
        var _this = this;
        if (!whereClause) {
            return null;
        }
        var operation = whereClause;
        var jsonOperation = {
            category: operation.category,
            operator: operation.operator
        };
        switch (operation.category) {
            case Operation_1.OperationCategory.LOGICAL:
                var logicalOperation = operation;
                var jsonLogicalOperation = jsonOperation;
                switch (operation.operator) {
                    case '$not':
                        jsonLogicalOperation.value = this.whereClauseToJSON(logicalOperation.value, columnAliases);
                        break;
                    case '$and':
                    case '$or':
                        jsonLogicalOperation.value = logicalOperation.value.map(function (value) {
                            return _this.whereClauseToJSON(value, columnAliases);
                        });
                        break;
                    default:
                        throw "Unsupported logical operation '" + operation.operator + "'";
                }
                break;
            case Operation_1.OperationCategory.FUNCTION:
                var functionOperation = operation;
                var query = functionOperation.getQuery();
                var jsonQuery = new PHMappedSQLQuery_1.PHMappedSQLQuery(query, columnAliases.entityAliases).toJSON();
                jsonOperation = functionOperation.toJSON(jsonQuery);
                break;
            case Operation_1.OperationCategory.BOOLEAN:
            case Operation_1.OperationCategory.DATE:
            case Operation_1.OperationCategory.NUMBER:
            case Operation_1.OperationCategory.STRING:
                var valueOperation = operation;
                // All Non logical or exists operations are value operations (eq, isNull, like, etc.)
                var jsonValueOperation = jsonOperation;
                jsonValueOperation.lValue = this.convertLRValue(valueOperation.lValue, columnAliases);
                var rValue = valueOperation.rValue;
                if (rValue instanceof Array) {
                    jsonValueOperation.rValue = rValue.map(function (anRValue) {
                        return _this.convertLRValue(anRValue, columnAliases);
                    });
                }
                else {
                    jsonValueOperation.rValue = this.convertLRValue(rValue, columnAliases);
                }
                break;
        }
        return jsonOperation;
    };
    PHAbstractSQLQuery.convertLRValue = function (rValue, columnAliases) {
        switch (typeof rValue) {
            case "boolean":
            case "number":
            case "string":
                throw "L and R values must be converted to Functions";
            case "undefined":
                throw "'undefined' is not a valid L or R value";
            default:
                if (rValue instanceof Date) {
                    throw "L and R values must be converted to Functions";
                }
                else if (rValue instanceof OperableField_1.QOperableField) {
                    return rValue.toJSON(columnAliases, false);
                } // Must be a Field Query
                else {
                    var rawFieldQuery = rValue;
                    var phFieldQuery = new PHFieldSQLQuery_1.PHFieldSQLQuery(rawFieldQuery, columnAliases.entityAliases);
                    return phFieldQuery.toJSON();
                }
        }
    };
    PHAbstractSQLQuery.prototype.groupByClauseToJSON = function (groupBy) {
        var _this = this;
        if (!groupBy || !groupBy.length) {
            return null;
        }
        return groupBy.map(function (field) {
            if (!_this.columnAliases.hasAliasFor(field)) {
                throw "Field used in group by clause is not present in select clause";
            }
            return {
                fieldAlias: _this.columnAliases.getExistingAlias(field)
            };
        });
    };
    PHAbstractSQLQuery.prototype.orderByClauseToJSON = function (orderBy) {
        var _this = this;
        if (!orderBy || !orderBy.length) {
            return null;
        }
        return orderBy.map(function (field) {
            return field.toJSON(_this.columnAliases);
        });
    };
    return PHAbstractSQLQuery;
}());
exports.PHAbstractSQLQuery = PHAbstractSQLQuery;
//# sourceMappingURL=PHAbstractSQLQuery.js.map