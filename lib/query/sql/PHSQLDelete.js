"use strict";
var PHSQLDelete = (function () {
    function PHSQLDelete(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phRawQuery = phRawQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHSQLDelete.prototype.toSQL = function () {
        return {
            deleteFrom: this.phRawQuery.deleteFrom.getRelationJson(),
            where: this.phRawQuery.where
        };
    };
    return PHSQLDelete;
}());
exports.PHSQLDelete = PHSQLDelete;
//# sourceMappingURL=PHSQLDelete.js.map