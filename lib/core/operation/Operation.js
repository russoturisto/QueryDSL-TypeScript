"use strict";
(function (OperationCategory) {
    OperationCategory[OperationCategory["BOOLEAN"] = 0] = "BOOLEAN";
    OperationCategory[OperationCategory["DATE"] = 1] = "DATE";
    OperationCategory[OperationCategory["LOGICAL"] = 2] = "LOGICAL";
    OperationCategory[OperationCategory["NUMBER"] = 3] = "NUMBER";
    OperationCategory[OperationCategory["STRING"] = 4] = "STRING";
})(exports.OperationCategory || (exports.OperationCategory = {}));
var OperationCategory = exports.OperationCategory;
var Operation = (function () {
    function Operation(type) {
        this.type = type;
    }
    Operation.prototype.equals = function (value) {
        return {
            $eq: value
        };
    };
    Operation.prototype.exists = function (exists) {
        return {
            $exists: exists
        };
    };
    Operation.prototype.isNotNull = function () {
        return this.exists(false);
    };
    Operation.prototype.isNull = function () {
        return this.exists(true);
    };
    Operation.prototype.isIn = function (values) {
        return {
            $in: values
        };
    };
    Operation.prototype.notEquals = function (value) {
        return {
            $ne: value
        };
    };
    Operation.prototype.notIn = function (values) {
        return {
            $nin: values
        };
    };
    return Operation;
}());
exports.Operation = Operation;
//# sourceMappingURL=Operation.js.map