"use strict";
(function (JoinType) {
    JoinType[JoinType["FULL_JOIN"] = 0] = "FULL_JOIN";
    JoinType[JoinType["INNER_JOIN"] = 1] = "INNER_JOIN";
    JoinType[JoinType["LEFT_JOIN"] = 2] = "LEFT_JOIN";
    JoinType[JoinType["RIGHT_JOIN"] = 3] = "RIGHT_JOIN";
})(exports.JoinType || (exports.JoinType = {}));
var JoinType = exports.JoinType;
var PHSQLQuery = (function () {
    function PHSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phRawQuery = phRawQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHSQLQuery.prototype.toSQL = function () {
        var phJoin = [];
        this.phRawQuery.from.forEach(function (iEntity) {
            phJoin.push(iEntity.getRelationJson());
        });
        return {
            select: this.phRawQuery.select,
            from: phJoin,
            where: this.phRawQuery.where
        };
    };
    return PHSQLQuery;
}());
exports.PHSQLQuery = PHSQLQuery;
//# sourceMappingURL=PHSQLQuery.js.map