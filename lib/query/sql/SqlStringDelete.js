"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
/**
 * Created by Papa on 10/2/2016.
 */
var SQLStringDelete = (function (_super) {
    __extends(SQLStringDelete, _super);
    function SQLStringDelete() {
        _super.apply(this, arguments);
    }
    SQLStringDelete.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var entityName = this.qEntity.__entityName__;
        var joinQEntityMap = {};
        var fromFragment = this.getFromFragment(joinQEntityMap, this.joinAliasMap, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinQEntityMap, embedParameters, parameters);
        return "DELETE\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment;
    };
    return SQLStringDelete;
}(SQLStringWhereBase_1.SQLStringWhereBase));
exports.SQLStringDelete = SQLStringDelete;
//# sourceMappingURL=SQLStringDelete.js.map