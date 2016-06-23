"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueryOperation_1 = require("./QueryOperation");
var PHQuery_1 = require("../../query/PHQuery");
var FieldOperation = (function (_super) {
    __extends(FieldOperation, _super);
    function FieldOperation(type, fieldType) {
        _super.call(this, type);
        this.fieldType = fieldType;
    }
    FieldOperation.prototype.include = function () {
        this.includeField = true;
        return this;
    };
    FieldOperation.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        if (this.includeField) {
            json[PHQuery_1.PH_INCLUDE] = true;
        }
        return json;
    };
    return FieldOperation;
}(QueryOperation_1.QueryOperation));
exports.FieldOperation = FieldOperation;
//# sourceMappingURL=FieldOperation.js.map