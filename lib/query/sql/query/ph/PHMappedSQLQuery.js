"use strict";
var PHMappedSQLQuery = (function () {
    function PHMappedSQLQuery(phRawQuery, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phRawQuery = phRawQuery;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHMappedSQLQuery.prototype.toJSON = function () {
        var jsonObjectSqlQuery = getCommonJsonQuery(this.phRawQuery, false);
        return jsonObjectSqlQuery;
    };
    return PHMappedSQLQuery;
}());
exports.PHMappedSQLQuery = PHMappedSQLQuery;
//# sourceMappingURL=PHMappedSQLQuery.js.map