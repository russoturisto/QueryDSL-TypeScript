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
    ValueOperation.prototype.equals = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$eq",
            rValue: rValue
        };
    };
    ValueOperation.prototype.greaterThan = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "gt",
            rValue: rValue
        };
    };
    ValueOperation.prototype.greaterThanOrEquals = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$gte",
            rValue: rValue
        };
    };
    ValueOperation.prototype.isNotNull = function (lValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$isNotNull"
        };
    };
    ValueOperation.prototype.isNull = function (lValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$isNull"
        };
    };
    ValueOperation.prototype.isIn = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$in",
            rValue: rValue
        };
    };
    ValueOperation.prototype.lessThan = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$lt",
            rValue: rValue
        };
    };
    ValueOperation.prototype.lessThanOrEquals = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$lte",
            rValue: rValue
        };
    };
    ValueOperation.prototype.notEquals = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$ne",
            rValue: lValue
        };
    };
    ValueOperation.prototype.notIn = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operation: "$nin",
            rValue: rValue
        };
    };
    return ValueOperation;
}(Operation));
exports.ValueOperation = ValueOperation;
//# sourceMappingURL=Operation.js.map