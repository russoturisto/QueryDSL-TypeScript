"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Operation_1 = require("./Operation");
var DateOperation = (function (_super) {
    __extends(DateOperation, _super);
    function DateOperation() {
        _super.call(this, Operation_1.OperationCategory.DATE);
    }
    DateOperation.prototype.greaterThan = function (value) {
        return {
            operator: "$gt",
            category: this.category,
            rValue: value
        };
    };
    DateOperation.prototype.greaterThanOrEquals = function (value) {
        return {
            operator: "$gte",
            category: this.category,
            rValue: value
        };
    };
    DateOperation.prototype.lessThan = function (value) {
        return {
            operator: "$lt",
            category: this.category,
            rValue: value
        };
    };
    DateOperation.prototype.lessThanOrEquals = function (value) {
        return {
            operator: "$lte",
            category: this.category,
            rValue: value
        };
    };
    return DateOperation;
}(Operation_1.ValueOperation));
exports.DateOperation = DateOperation;
//# sourceMappingURL=DateOperation.js.map