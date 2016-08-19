"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("../field/Field");
var Operation_1 = require("./Operation");
var DateOperation = (function (_super) {
    __extends(DateOperation, _super);
    function DateOperation() {
        _super.call(this, Field_1.FieldType.DATE);
    }
    DateOperation.prototype.equals = function (value) {
        return {
            $eq: value
        };
    };
    DateOperation.prototype.exists = function (exists) {
        return {
            $exists: exists
        };
    };
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
    DateOperation.prototype.isIn = function (values) {
        return {
            $in: values
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
    DateOperation.prototype.notEquals = function (value) {
        return {
            $ne: value
        };
    };
    DateOperation.prototype.notIn = function (values) {
        return {
            $nin: values
        };
    };
    return DateOperation;
}(Operation_1.Operation));
exports.DateOperation = DateOperation;
//# sourceMappingURL=DateOperation.js.map