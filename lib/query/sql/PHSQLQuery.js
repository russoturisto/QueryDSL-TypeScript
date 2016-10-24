"use strict";
var EntityUtils_1 = require("../../core/utils/EntityUtils");
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