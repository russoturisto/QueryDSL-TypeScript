"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Operation_1 = require("./Operation");
var OperationType_1 = require("./OperationType");
var LogicalOperation = (function (_super) {
    __extends(LogicalOperation, _super);
    function LogicalOperation(q, type, childOps) {
        _super.call(this, q, null, null, null, type);
        this.childOps = childOps;
    }
    LogicalOperation.prototype.verifyChildOps = function (ops) {
        var _this = this;
        if (ops === void 0) { ops = this.childOps; }
        if (!ops || !ops.length) {
            throw "No child operations provided";
        }
        ops.forEach(function (operation) {
            if (_this.q !== operation.getQ()) {
                throw "Query object does not match";
            }
        });
    };
    LogicalOperation.prototype.addOperation = function (operationType, ops) {
        this.verifyChildOps(ops);
        var andOperation = new LogicalOperation(this.q, operationType, ops);
        this.childOps.push(andOperation);
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
        return this.addOperation(OperationType_1.OperationType.OR, [op]);
    };
    LogicalOperation.prototype.getChildOps = function () {
        return this.childOps;
    };
    LogicalOperation.prototype.objectEquals = function (otherOp, checkValue) {
        if (this.q.constructor !== otherOp.q.constructor) {
            return false;
        }
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