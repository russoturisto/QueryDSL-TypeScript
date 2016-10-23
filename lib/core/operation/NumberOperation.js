"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Operation_1 = require("./Operation");
var NumberOperation = (function (_super) {
    __extends(NumberOperation, _super);
    function NumberOperation() {
        _super.call(this, Operation_1.OperationCategory.NUMBER);
    }
    NumberOperation.prototype.greaterThan = function (value) {
        return {
            operator: "$gt",
            category: this.category,
            rValue: value
        };
    };
    NumberOperation.prototype.greaterThanOrEquals = function (value) {
        return {
            operator: "$gte",
            category: this.category,
            rValue: value
        };
    };
    NumberOperation.prototype.lessThan = function (value) {
        return {
            operator: "$lt",
            category: this.category,
            rValue: value
        };
    };
    NumberOperation.prototype.lessThanOrEquals = function (value) {
        return {
            operator: "$lte",
            category: this.category,
            rValue: value
        };
    };
    return NumberOperation;
}(Operation_1.ValueOperation));
exports.NumberOperation = NumberOperation;
//# sourceMappingURL=NumberOperation.js.map