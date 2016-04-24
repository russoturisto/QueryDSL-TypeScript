"use strict";
var Operation = (function () {
    function Operation(q, fieldName, type, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
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
}());
exports.Operation = Operation;
//# sourceMappingURL=Operation.js.map