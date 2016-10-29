"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringQuery_1 = require("../../SQLStringQuery");
/**
 * Represents SQL String query with flat (aka traditional) Select clause.
 */
var FlatSQLStringQuery = (function (_super) {
    __extends(FlatSQLStringQuery, _super);
    function FlatSQLStringQuery(phJsonQuery, qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, phJsonQuery, qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, SQLStringQuery_1.QueryResultType.FLAT);
    }
    FlatSQLStringQuery.prototype.getSELECTFragment = function (entityName, selectSqlFragment, selectClauseFragment, joinTree, entityDefaults, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        return selectSqlFragment;
    };
    FlatSQLStringQuery.prototype.getOrderByFragment = function (orderBy) {
        return this.orderByParser.getOrderByFragment(this.joinTree, this.qEntityMapByAlias);
    };
    return FlatSQLStringQuery;
}(SQLStringQuery_1.SQLStringQuery));
exports.FlatSQLStringQuery = FlatSQLStringQuery;
//# sourceMappingURL=FlatSQLStringQuery.js.map