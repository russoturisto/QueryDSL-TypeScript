"use strict";
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
//# sourceMappingURL=PHRawEntitySQLQuery.js.map