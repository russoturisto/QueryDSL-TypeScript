"use strict";
var PHSQLUpdate = (function () {
    function PHSQLUpdate(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phRawQuery = phRawQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHSQLUpdate.prototype.toSQL = function () {
        return {
            deleteFrom: this.phRawQuery.deleteFrom.getRelationJson(),
            where: this.phRawQuery.where
        };
    };
    return PHSQLUpdate;
}());
exports.PHSQLUpdate = PHSQLUpdate;
//# sourceMappingURL=PHSQLDelete.js.map