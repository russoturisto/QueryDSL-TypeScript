"use strict";
var PHMappedSQLQuery = (function () {
    function PHMappedSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phRawQuery = phRawQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHMappedSQLQuery.prototype.toSQL = function () {
        var jsonObjectSqlQuery = getCommonJsonQuery(this.phRawQuery, false);
        return jsonObjectSqlQuery;
    };
    return PHMappedSQLQuery;
}());
exports.PHMappedSQLQuery = PHMappedSQLQuery;
//# sourceMappingURL=PHMappedSQLQuery.js.map