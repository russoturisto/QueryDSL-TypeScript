"use strict";
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
//# sourceMappingURL=PHFlatSQLQuery.js.map