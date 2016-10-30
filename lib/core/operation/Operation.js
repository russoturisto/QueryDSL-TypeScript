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
    function ValueOperation(category, lValue) {
        _super.call(this, category);
        this.category = category;
        this.lValue = lValue;
    }
    ValueOperation.prototype.equals = function (value) {
        return {
            category: this.category,
            lValue: this.lValue,
            operation: "$eq",
            rValue: value
        };
    };
    ValueOperation.prototype.isNotNull = function () {
        return {
            operation: "$isNotNull",
            category: this.category
        };
    };
    ValueOperation.prototype.isNull = function () {
        return {
            operation: "$isNull",
            category: this.category
        };
    };
    ValueOperation.prototype.isIn = function (values) {
        return {
            operation: "$in",
            category: this.category,
            rValue: values
        };
    };
    ValueOperation.prototype.notEquals = function (value) {
        return {
            operation: "$ne",
            category: this.category,
            rValue: value
        };
    };
    ValueOperation.prototype.notIn = function (values) {
        return {
            operation: "$nin",
            category: this.category,
            rValue: values
        };
    };
    return ValueOperation;
}(Operation));
exports.ValueOperation = ValueOperation;
//# sourceMappingURL=Operation.js.map