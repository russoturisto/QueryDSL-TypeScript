"use strict";
var Operation = (function () {
    function Operation(type) {
        this.type = type;
    }
    Operation.prototype.objectEquals = function (otherOp, checkValue) {
        if (this.constructor !== otherOp.constructor) {
            return false;
        }
        if (this.type !== otherOp.type) {
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