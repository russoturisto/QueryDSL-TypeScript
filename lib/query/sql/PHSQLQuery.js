"use strict";
var Operation_1 = require("../../core/operation/Operation");
var EntityUtils_1 = require("../../core/utils/EntityUtils");
var Field_1 = require("../../core/field/Field");
var PHFieldSQLQuery_1 = require("./query/ph/PHFieldSQLQuery");
var PHAbstractSQLQuery = (function () {
    function PHAbstractSQLQuery() {
    }
    PHAbstractSQLQuery.whereClauseToJSON = function (whereClause) {
        var _this = this;
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
                jsonOperation = functionOperation.toJSON();
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
    PHAbstractSQLQuery.convertRValue = function (rValue) {
        switch (typeof rValue) {
            case "boolean":
            case "number":
            case "string":
                return rValue;
            default:
                if (rValue instanceof Date) {
                    return rValue;
                }
                else if (rValue instanceof Field_1.QField) {
                    return rValue.toJSON();
                } // Must be a Field Query
                else {
                    var rawFieldQuery = rValue;
                    var phFieldQuery = new PHFieldSQLQuery_1.PHFieldSQLQuery(rawFieldQuery);
                    return phFieldQuery.toJSON();
                }
        }
    };
    return PHAbstractSQLQuery;
}());
exports.PHAbstractSQLQuery = PHAbstractSQLQuery;
function getPHSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
    var selectClause = phRawQuery.select;
    if (EntityUtils_1.isAppliable(selectClause) || selectClause instanceof Array) {
        return new PHFlatSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
    }
    else {
        return new PHObjectSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
    }
}
exports.getPHSQLQuery = getPHSQLQuery;
exports.QUERY_MARKER_FIELD = '.isQuery';
function getCommonJsonQuery(phRawQuery, isFlatQuery) {
    var phJoin = [];
    var rootEntityName = null;
    if (phRawQuery.from && phRawQuery.from.length) {
        rootEntityName = phRawQuery.from[0].rootEntityPrefix;
        phJoin = phRawQuery.from.map(function (iEntity) {
            return iEntity.getEntityRelationJson();
        });
    }
    var selectClause = this.convertSelects(this.phRawQuery.select, isFlatQuery);
    var commonJsonQuery = {
        rootEntityPrefix: rootEntityName,
        select: selectClause,
        from: phJoin,
        where: this.phRawQuery.where,
        orderBy: this.phRawQuery.orderBy
    };
    commonJsonQuery[exports.QUERY_MARKER_FIELD] = true;
    return commonJsonQuery;
}
function convertSelects(selectClause, isFlatQuery) {
    if (!(selectClause instanceof Object)) {
        return selectClause;
    }
    for (var property in selectClause) {
        var value = selectClause[property];
        if (value instanceof PHObjectSQLQuery) {
            if (isFlatQuery) {
                throw "Object sub-select statements not allowed in Flat SQL select statements";
            }
            selectClause[property] = value.toSQL();
        }
        else if (EntityUtils_1.isAppliable(value)) {
            // Flat sub-queries are allowed in as sub-selectes in Object queries for a given field
            selectClause[property] = selectClause.toJSON();
        }
        else if (value instanceof Array) {
            throw "Arrays are not allowed in select statements";
        }
        else if (value instanceof Object && !(value instanceof Date)) {
            selectClause[property] = convertSelects(value, isFlatQuery);
        }
    }
    return selectClause;
}
//# sourceMappingURL=PHSQLQuery.js.map