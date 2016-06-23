"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LogicalOperation_1 = require("./LogicalOperation");
var OperationType_1 = require("./OperationType");
var LogicalFieldOperation = (function (_super) {
    __extends(LogicalFieldOperation, _super);
    function LogicalFieldOperation() {
        _super.apply(this, arguments);
    }
    LogicalFieldOperation.prototype.and = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.addOperation(OperationType_1.OperationType.AND, ops);
    };
    LogicalFieldOperation.prototype.or = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.addOperation(OperationType_1.OperationType.OR, ops);
    };
    LogicalFieldOperation.prototype.not = function (op) {
        return this.addOperation(OperationType_1.OperationType.NOT, [op]);
    };
    return LogicalFieldOperation;
}(LogicalOperation_1.LogicalOperation));
exports.LogicalFieldOperation = LogicalFieldOperation;
//# sourceMappingURL=LogicalFieldOperation.js.map