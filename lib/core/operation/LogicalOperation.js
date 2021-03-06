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
function and() {
    var ops = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ops[_i - 0] = arguments[_i];
    }
    return new LogicalOperation().and(ops);
}
exports.and = and;
function or() {
    var ops = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ops[_i - 0] = arguments[_i];
    }
    return new LogicalOperation().or(ops);
}
exports.or = or;
function not(op) {
    return new LogicalOperation().not(op);
}
exports.not = not;
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
    LogicalOperation.prototype.and = function (ops) {
        return {
            category: Operation_1.OperationCategory.LOGICAL,
            operator: '$and',
            value: ops
        };
    };
    LogicalOperation.prototype.or = function (ops) {
        return {
            category: Operation_1.OperationCategory.LOGICAL,
            operator: '$or',
            value: ops
        };
    };
    LogicalOperation.prototype.not = function (op) {
        return {
            category: Operation_1.OperationCategory.LOGICAL,
            operator: '$not',
            value: op
        };
    };
    return LogicalOperation;
}(Operation_1.Operation));
exports.LogicalOperation = LogicalOperation;
//# sourceMappingURL=LogicalOperation.js.map