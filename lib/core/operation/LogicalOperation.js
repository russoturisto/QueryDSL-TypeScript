"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Papa on 4/21/2016.
 */
var Operation_1 = require("./Operation");
var LogicalOperation = (function (_super) {
    __extends(LogicalOperation, _super);
    function LogicalOperation() {
        _super.call(this, null);
    }
    LogicalOperation.verifyChildOps = function (ops) {
        if (!ops || !ops.length) {
            throw "No child operations provided";
        }
    };
    LogicalOperation.prototype.and = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return {
            $and: ops
        };
    };
    LogicalOperation.prototype.or = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return {
            $or: ops
        };
    };
    LogicalOperation.prototype.not = function (op) {
        return {
            $not: op
        };
    };
    return LogicalOperation;
}(Operation_1.Operation));
exports.LogicalOperation = LogicalOperation;
//# sourceMappingURL=LogicalOperation.js.map