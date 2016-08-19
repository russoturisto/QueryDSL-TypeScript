"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("../field/Field");
var Operation_1 = require("./Operation");
var NumberOperation = (function (_super) {
    __extends(NumberOperation, _super);
    function NumberOperation() {
        _super.call(this, Field_1.FieldType.NUMBER);
    }
    NumberOperation.prototype.equals = function (value) {
        return {
            $eq: value
        };
    };
    NumberOperation.prototype.exists = function (exists) {
        return {
            $exists: exists
        };
    };
    NumberOperation.prototype.greaterThan = function (greaterThan) {
        return {
            $gt: greaterThan
        };
    };
    NumberOperation.prototype.greaterThanOrEquals = function (greaterThanOrEquals) {
        return {
            $gte: greaterThanOrEquals
        };
    };
    NumberOperation.prototype.isIn = function (values) {
        return {
            $in: values
        };
    };
    NumberOperation.prototype.lessThan = function (lessThan) {
        return {
            $lt: lessThan
        };
    };
    NumberOperation.prototype.lessThanOrEquals = function (lessThanOrEquals) {
        return {
            $lte: lessThanOrEquals
        };
    };
    NumberOperation.prototype.notEquals = function (value) {
        return {
            $ne: value
        };
    };
    NumberOperation.prototype.notIn = function (values) {
        return {
            $nin: values
        };
    };
    return NumberOperation;
}(Operation_1.Operation));
exports.NumberOperation = NumberOperation;
//# sourceMappingURL=NumberOperation.js.map