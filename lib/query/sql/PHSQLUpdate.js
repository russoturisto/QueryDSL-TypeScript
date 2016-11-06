"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHAbstractSQLQuery_1 = require("./query/ph/PHAbstractSQLQuery");
var PHSQLUpdate = (function (_super) {
    __extends(PHSQLUpdate, _super);
    function PHSQLUpdate(phRawQuery) {
        _super.call(this);
        this.phRawQuery = phRawQuery;
    }
    PHSQLUpdate.prototype.toSQL = function () {
        return {
            update: this.phRawQuery.update.getRelationJson(this.columnAliases),
            set: this.phRawQuery.set,
            where: PHAbstractSQLQuery_1.PHAbstractSQLQuery.whereClauseToJSON(this.phRawQuery.where, this.columnAliases)
        };
    };
    return PHSQLUpdate;
}(PHAbstractSQLQuery_1.PHAbstractSQLQuery));
exports.PHSQLUpdate = PHSQLUpdate;
//# sourceMappingURL=PHSQLUpdate.js.map