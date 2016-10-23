"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DateOperation = (function (_super) {
    __extends(DateOperation, _super);
    function DateOperation() {
        _super.call(this, FieldType.DATE);
    }
    DateOperation.prototype.greaterThan = function (greaterThan) {
        return {
            $gt: greaterThan
        };
    };
    DateOperation.prototype.greaterThanOrEquals = function (greaterThanOrEquals) {
        return {
            $gte: greaterThanOrEquals
        };
    };
    DateOperation.prototype.lessThan = function (lessThan) {
        return {
            $lt: lessThan
        };
    };
    DateOperation.prototype.lessThanOrEquals = function (lessThanOrEquals) {
        return {
            $lte: lessThanOrEquals
        };
    };
    return DateOperation;
}(Operation));
exports.DateOperation = DateOperation;
//# sourceMappingURL=ComparableOperation.js.map