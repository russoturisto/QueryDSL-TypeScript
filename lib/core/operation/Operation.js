"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (OperationCategory) {
    OperationCategory[OperationCategory["BOOLEAN"] = 0] = "BOOLEAN";
    OperationCategory[OperationCategory["DATE"] = 1] = "DATE";
    OperationCategory[OperationCategory["LOGICAL"] = 2] = "LOGICAL";
    OperationCategory[OperationCategory["NUMBER"] = 3] = "NUMBER";
    OperationCategory[OperationCategory["STRING"] = 4] = "STRING";
})(exports.OperationCategory || (exports.OperationCategory = {}));
var OperationCategory = exports.OperationCategory;
here;
next;
notEquals(value, T | PHRawFlatSQLQuery);
JO;
notIn(values, T[]);
JO;
var Operation = (function () {
    function Operation(type) {
        this.type = type;
    }
    return Operation;
}());
exports.Operation = Operation;
var ValueOperation = (function (_super) {
    __extends(ValueOperation, _super);
    function ValueOperation(type) {
        _super.call(this, type);
        this.type = type;
    }
    ValueOperation.prototype.equals = function (value) {
        return {
            $eq: value
        };
    };
    ValueOperation.prototype.exists = function (exists) {
        return {
            $exists: exists
        };
    };
    ValueOperation.prototype.isNotNull = function () {
        return this.exists(false);
    };
    ValueOperation.prototype.isNull = function () {
        return this.exists(true);
    };
    ValueOperation.prototype.isIn = function (values) {
        return {
            $in: values
        };
    };
    ValueOperation.prototype.notEquals = function (value) {
        return {
            $ne: value
        };
    };
    ValueOperation.prototype.notIn = function (values) {
        return {
            $nin: values
        };
    };
    return ValueOperation;
}(Operation));
exports.ValueOperation = ValueOperation;
//# sourceMappingURL=Operation.js.map