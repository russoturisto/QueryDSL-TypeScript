"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueryFragment_1 = require("../QueryFragment");
var Operation = (function (_super) {
    __extends(Operation, _super);
    function Operation(q, fieldName, type, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        _super.call(this);
        this.q = q;
        this.fieldName = fieldName;
        this.type = type;
        this.nativeFieldName = nativeFieldName;
    }
    Operation.prototype.getQ = function () {
        return this.q;
    };
    Operation.prototype.objectEquals = function (otherOp, checkValue) {
        if (this.q.constructor !== otherOp.q.constructor) {
            return false;
        }
        if (this.constructor !== otherOp.constructor) {
            return false;
        }
        if (this.type !== otherOp.type) {
            return false;
        }
        if (this.fieldName !== otherOp.fieldName) {
            return false;
        }
        if (checkValue && !this.valueEquals(otherOp, checkValue)) {
            return false;
        }
        return true;
    };
    return Operation;
}(QueryFragment_1.QueryFragment));
exports.Operation = Operation;
//# sourceMappingURL=Operation.js.map