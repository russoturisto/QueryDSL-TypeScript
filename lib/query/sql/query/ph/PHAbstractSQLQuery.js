"use strict";
var PHMappedSQLQuery_1 = require("./PHMappedSQLQuery");
var Joins_1 = require("../../../../core/entity/Joins");
var OperableField_1 = require("../../../../core/field/OperableField");
var PHFieldSQLQuery_1 = require("./PHFieldSQLQuery");
var Operation_1 = require("../../../../core/operation/Operation");
var Entity_1 = require("../../../../core/entity/Entity");
var Relation_1 = require("../../../../core/entity/Relation");
/**
 * Created by Papa on 10/27/2016.
 */
var PHAbstractSQLQuery = (function () {
    function PHAbstractSQLQuery() {
        this.isEntityQuery = false;
    }
    PHAbstractSQLQuery.prototype.getNonEntitySqlQuery = function (rawQuery, jsonQuery) {
        var from = this.fromClauseToJSON(rawQuery.from);
        jsonQuery.from = from;
        jsonQuery.where = this.whereClauseToJSON(rawQuery.where);
        jsonQuery.groupBy = this.groupByClauseToJSON(rawQuery.groupBy);
        jsonQuery.having = this.whereClauseToJSON(rawQuery.having);
        jsonQuery.orderBy = this.orderByClauseToJSON(rawQuery.orderBy);
        jsonQuery.limit = rawQuery.limit;
        jsonQuery.offset = rawQuery.offset;
        return jsonQuery;
    };
    PHAbstractSQLQuery.prototype.fromClauseToJSON = function (fromClause) {
        var _this = this;
        return fromClause.map(function (fromEntity) {
            if (fromEntity instanceof Entity_1.QEntity) {
                return fromEntity.getRelationJson();
            }
            else {
                if (_this.isEntityQuery) {
                    throw "Entity FROM clauses can only contain QEntities";
                }
                return _this.getSubSelectInFromClause(fromEntity);
            }
        });
    };
    PHAbstractSQLQuery.prototype.whereClauseToJSON = function (whereClause) {
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
                        jsonLogicalOperation.value = this.whereClauseToJSON(logicalOperation.value);
                        break;
                    case '$and':
                    case '$or':
                        jsonLogicalOperation.value = logicalOperation.value.map(function (value) {
                            return _this.whereClauseToJSON(value);
                        });
                        break;
                    default:
                        throw "Unsupported logical operator '" + operation.operator + "'";
                }
                break;
            case Operation_1.OperationCategory.FUNCTION:
                var functionOperation = operation;
                var query = functionOperation.getQuery();
                var jsonQuery = new PHMappedSQLQuery_1.PHMappedSQLQuery(query).toJSON();
                jsonOperation = functionOperation.toJSON(jsonQuery);
                break;
            case Operation_1.OperationCategory.BOOLEAN:
            case Operation_1.OperationCategory.DATE:
            case Operation_1.OperationCategory.NUMBER:
            case Operation_1.OperationCategory.STRING:
                var valueOperation = operation;
                var jsonValueOperation = operation;
                jsonValueOperation.lValue = valueOperation.lValue.toJSON();
                var rValue = valueOperation.rValue;
                if (rValue instanceof Array) {
                    jsonValueOperation.rValue = rValue.map(function (anRValue) {
                        return _this.convertRValue(anRValue);
                    });
                }
                else {
                    jsonValueOperation.rValue = this.convertRValue(rValue);
                }
                break;
        }
        return jsonOperation;
    };
    PHAbstractSQLQuery.prototype.convertRValue = function (rValue) {
        switch (typeof rValue) {
            case "boolean":
            case "number":
            case "string":
                return rValue;
            default:
                if (rValue instanceof Date) {
                    return rValue;
                }
                else if (rValue instanceof OperableField_1.QOperableField) {
                    return rValue.toJSON();
                } // Must be a Field Query
                else {
                    var rawFieldQuery = rValue;
                    var phFieldQuery = new PHFieldSQLQuery_1.PHFieldSQLQuery(rawFieldQuery);
                    return phFieldQuery.toJSON();
                }
        }
    };
    PHAbstractSQLQuery.prototype.groupByClauseToJSON = function (groupBy) {
        if (!groupBy || !groupBy.length) {
            return null;
        }
        return groupBy.map(function (field) {
            return field.toJSON();
        });
    };
    PHAbstractSQLQuery.prototype.orderByClauseToJSON = function (orderBy) {
        if (!orderBy || !orderBy.length) {
            return null;
        }
        return orderBy.map(function (field) {
            return field.toJSON();
        });
    };
    PHAbstractSQLQuery.prototype.getSubSelectInFromClause = function (subSelectEntity) {
        var rawQuery = subSelectEntity[Joins_1.SUB_SELECT_QUERY];
        if (!rawQuery) {
            throw "Reference to own query is missing in sub-select entity";
        }
        var joinRelation = rawQuery;
        var jsonMappedQuery = new PHMappedSQLQuery_1.PHMappedSQLQuery(rawQuery).toJSON();
        jsonMappedQuery.relationType = Relation_1.JSONRelationType.SUB_QUERY;
        jsonMappedQuery.joinWhereClause = this.whereClauseToJSON(joinRelation.joinWhereClause);
        return jsonMappedQuery;
    };
    return PHAbstractSQLQuery;
}());
exports.PHAbstractSQLQuery = PHAbstractSQLQuery;
//# sourceMappingURL=PHAbstractSQLQuery.js.map