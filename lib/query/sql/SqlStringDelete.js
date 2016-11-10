"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringNoJoinQuery_1 = require("./SQLStringNoJoinQuery");
/**
 * Created by Papa on 10/2/2016.
 */
var SQLStringDelete = (function (_super) {
    __extends(SQLStringDelete, _super);
    function SQLStringDelete(phJsonDelete, qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, qEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
        this.phJsonDelete = phJsonDelete;
    }
    SQLStringDelete.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var fromFragment = this.getTableFragment(this.phJsonDelete.deleteFrom);
        var whereFragment = '';
        var jsonQuery = this.phJsonDelete;
        if (jsonQuery.where) {
            whereFragment = "\nWHERE\n" + this.getWHEREFragment(jsonQuery.where, '');
        }
        return "DELETE\nFROM\n" + fromFragment + whereFragment;
    };
    return SQLStringDelete;
}(SQLStringNoJoinQuery_1.SQLStringNoJoinQuery));
exports.SQLStringDelete = SQLStringDelete;
//# sourceMappingURL=SQLStringDelete.js.map