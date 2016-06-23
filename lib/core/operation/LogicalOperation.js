"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Operation_1 = require("./Operation");
var OperationType_1 = require("./OperationType");
function and() {
    var ops = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ops[_i - 0] = arguments[_i];
    }
    return LogicalOperation.addOperation(OperationType_1.OperationType.AND, ops);
}
exports.and = and;
function or() {
    var ops = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ops[_i - 0] = arguments[_i];
    }
    return LogicalOperation.addOperation(OperationType_1.OperationType.OR, ops);
}
exports.or = or;
function not(op) {
    return LogicalOperation.addOperation(OperationType_1.OperationType.NOT, [op]);
}
exports.not = not;
var LogicalOperation = (function (_super) {
    __extends(LogicalOperation, _super);
    function LogicalOperation(type, childOps) {
        _super.call(this, type);
        this.childOps = childOps;
    }
    LogicalOperation.verifyChildOps = function (ops) {
        if (!ops || !ops.length) {
            throw "No child operations provided";
        }
    };
    LogicalOperation.addOperation = function (operationType, ops) {
        LogicalOperation.verifyChildOps(ops);
        var logicalOperation = new LogicalOperation(operationType, ops);
        return logicalOperation;
    };
    LogicalOperation.prototype.verifyChildOps = function (ops) {
        if (ops === void 0) { ops = this.childOps; }
        LogicalOperation.verifyChildOps(ops);
        ops.forEach(function (operation) {
            // TODO: additional validation, if any
        });
    };
    LogicalOperation.prototype.addOperation = function (operationType, ops) {
        this.verifyChildOps(ops);
        var logicalOperation = new LogicalOperation(operationType, ops);
        this.childOps.push(logicalOperation);
        return this;
    };
    LogicalOperation.prototype.and = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.addOperation(OperationType_1.OperationType.AND, ops);
    };
    LogicalOperation.prototype.or = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.addOperation(OperationType_1.OperationType.OR, ops);
    };
    LogicalOperation.prototype.not = function (op) {
        return this.addOperation(OperationType_1.OperationType.NOT, [op]);
    };
    LogicalOperation.prototype.getChildOps = function () {
        return this.childOps;
    };
    LogicalOperation.prototype.objectEquals = function (otherOp, checkValue) {
        if (this.constructor !== otherOp.constructor) {
            return false;
        }
        if (this.type !== otherOp.type) {
            return false;
        }
        if (!this.valueEquals(otherOp, checkValue)) {
            return false;
        }
        return true;
    };
    LogicalOperation.prototype.toJSON = function () {
        var jsonOperation = {};
        var operator;
        switch (this.type) {
            case OperationType_1.OperationType.AND:
                operator = '&and';
                break;
            case OperationType_1.OperationType.NOT:
                operator = '&not';
                break;
            case OperationType_1.OperationType.OR:
                operator = '&or';
                break;
            default:
                throw "Not Implemented";
        }
        var childJsonOps = this.childOps.map(function (childOp) {
            return childOp.toJSON();
        });
        jsonOperation[operator] = childJsonOps;
        return jsonOperation;
    };
    LogicalOperation.prototype.valueEquals = function (otherOp, checkChildValues) {
        var otherLOp = otherOp;
        this.verifyChildOps();
        otherLOp.verifyChildOps();
        if (this.childOps.length !== otherLOp.childOps.length) {
            return false;
        }
        for (var i = 0; i < this.childOps.length; i++) {
            var ownChildOp = this.childOps[i];
            var otherChildOp = otherLOp.childOps[i];
            if (!ownChildOp.objectEquals(otherChildOp, checkChildValues)) {
                return false;
            }
        }
        return true;
    };
    return LogicalOperation;
}(Operation_1.Operation));
exports.LogicalOperation = LogicalOperation;
//# sourceMappingURL=LogicalOperation.js.map