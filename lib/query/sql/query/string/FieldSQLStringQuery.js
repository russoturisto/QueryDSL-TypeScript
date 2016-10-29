"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NonEntitySQLStringQuery_1 = require("./NonEntitySQLStringQuery");
var SQLStringQuery_1 = require("../../SQLStringQuery");
/**
 * Created by Papa on 10/29/2016.
 */
var FieldSQLStringQuery = (function (_super) {
    __extends(FieldSQLStringQuery, _super);
    function FieldSQLStringQuery(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, SQLStringQuery_1.QueryResultType.FIELD);
    }
    return FieldSQLStringQuery;
}(NonEntitySQLStringQuery_1.NonEntitySQLStringQuery));
exports.FieldSQLStringQuery = FieldSQLStringQuery;
//# sourceMappingURL=FieldSQLStringQuery.js.map