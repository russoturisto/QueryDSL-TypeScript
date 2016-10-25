"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (OperationCategory) {
    OperationCategory[OperationCategory["BOOLEAN"] = 0] = "BOOLEAN";
    OperationCategory[OperationCategory["DATE"] = 1] = "DATE";
    OperationCategory[OperationCategory["FUNCTION"] = 2] = "FUNCTION";
    OperationCategory[OperationCategory["LOGICAL"] = 3] = "LOGICAL";
    OperationCategory[OperationCategory["NUMBER"] = 4] = "NUMBER";
    OperationCategory[OperationCategory["STRING"] = 5] = "STRING";
})(exports.OperationCategory || (exports.OperationCategory = {}));
var OperationCategory = exports.OperationCategory;
var Operation = (function () {
    function Operation(category) {
        this.category = category;
    }
    return Operation;
}());
exports.Operation = Operation;
var ValueOperation = (function (_super) {
    __extends(ValueOperation, _super);
    function ValueOperation(category) {
        _super.call(this, category);
        this.category = category;
    }
    ValueOperation.prototype.equals = function (value) {
        return {
            operator: "$eq",
            category: this.category,
            rValue: value
        };
    };
    ValueOperation.prototype.isNotNull = function () {
        return {
            operator: "$isNotNull",
            category: this.category
        };
    };
    ValueOperation.prototype.isNull = function () {
        return {
            operator: "$isNull",
            category: this.category
        };
    };
    ValueOperation.prototype.isIn = function (values) {
        return {
            operator: "$in",
            category: this.category,
            rValue: values
        };
    };
    ValueOperation.prototype.notEquals = function (value) {
        return {
            operator: "$ne",
            category: this.category,
            rValue: value
        };
    };
    ValueOperation.prototype.notIn = function (values) {
        return {
            operator: "$nin",
            category: this.category,
            rValue: values
        };
    };
    return ValueOperation;
}(Operation));
exports.ValueOperation = ValueOperation;
//# sourceMappingURL=Operation.js.map