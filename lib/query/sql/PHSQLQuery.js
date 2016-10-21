"use strict";
var Relation_1 = require("../../core/entity/Relation");
var Field_1 = require("../../core/field/Field");
var Functions_1 = require("../../core/field/Functions");
(function (JoinType) {
    JoinType[JoinType["FULL_JOIN"] = 0] = "FULL_JOIN";
    JoinType[JoinType["INNER_JOIN"] = 1] = "INNER_JOIN";
    JoinType[JoinType["LEFT_JOIN"] = 2] = "LEFT_JOIN";
    JoinType[JoinType["RIGHT_JOIN"] = 3] = "RIGHT_JOIN";
})(exports.JoinType || (exports.JoinType = {}));
var JoinType = exports.JoinType;
function getPHSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
    var selectClause = phRawQuery.select;
    if (selectClause instanceof Functions_1.FunctionAppliable
        || selectClause instanceof Field_1.QField
        || selectClause instanceof Relation_1.QManyToOneRelation
        || selectClause instanceof Array) {
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
            return iEntity.getRelationJson();
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
        else if (value instanceof Functions_1.FunctionAppliable
            || value instanceof Field_1.QField
            || value instanceof Relation_1.QManyToOneRelation) {
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
var PHObjectSQLQuery = (function () {
    function PHObjectSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phRawQuery = phRawQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHObjectSQLQuery.prototype.toSQL = function () {
        var jsonObjectSqlQuery = getCommonJsonQuery(this.phRawQuery, false);
        return jsonObjectSqlQuery;
    };
    return PHObjectSQLQuery;
}());
exports.PHObjectSQLQuery = PHObjectSQLQuery;
var PHFlatSQLQuery = (function () {
    function PHFlatSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phRawQuery = phRawQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHFlatSQLQuery.prototype.toSQL = function () {
        var jsonObjectSqlQuery = getCommonJsonQuery(this.phRawQuery, true);
        var groupBy = [];
        if (this.phRawQuery.groupBy) {
            groupBy = this.phRawQuery.groupBy.map(function (appliable) {
                return appliable.toJSON();
            });
        }
        jsonObjectSqlQuery.groupBy = groupBy;
        jsonObjectSqlQuery.having = this.phRawQuery.having;
        return jsonObjectSqlQuery;
    };
    return PHFlatSQLQuery;
}());
exports.PHFlatSQLQuery = PHFlatSQLQuery;
//# sourceMappingURL=PHSQLQuery.js.map