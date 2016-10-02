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
            update: this.phRawQuery.update.getRelationJson(),
            set: this.phRawQuery.set,
            where: this.phRawQuery.where
        };
    };
    return PHSQLUpdate;
}());
exports.PHSQLUpdate = PHSQLUpdate;
//# sourceMappingURL=PHSQLUpdate.js.map