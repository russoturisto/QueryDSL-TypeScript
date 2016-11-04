"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHAbstractSQLQuery_1 = require("./query/ph/PHAbstractSQLQuery");
var PHSQLDelete = (function (_super) {
    __extends(PHSQLDelete, _super);
    function PHSQLDelete(phRawQuery) {
        _super.call(this);
        this.phRawQuery = phRawQuery;
    }
    PHSQLDelete.prototype.toSQL = function () {
        return {
            deleteFrom: this.phRawQuery.deleteFrom.getRelationJson(),
            where: PHAbstractSQLQuery_1.PHAbstractSQLQuery.whereClauseToJSON(this.phRawQuery.where)
        };
    };
    return PHSQLDelete;
}(PHAbstractSQLQuery_1.PHAbstractSQLQuery));
exports.PHSQLDelete = PHSQLDelete;
//# sourceMappingURL=PHSQLDelete.js.map