"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FieldOperation_1 = require("./FieldOperation");
var Field_1 = require("../field/Field");
var OperationType_1 = require("./OperationType");
var DateOperation = (function (_super) {
    __extends(DateOperation, _super);
    function DateOperation() {
        _super.apply(this, arguments);
        this.fieldType = Field_1.FieldType.DATE;
    }
    DateOperation.prototype.getDefinedInstance = function (type, value) {
        var definedOperation = new DateOperation(type, this.fieldType);
        definedOperation.isDefined = true;
        definedOperation.value = value;
        return definedOperation;
    };
    DateOperation.prototype.equals = function (value) {
        return this.getDefinedInstance(OperationType_1.OperationType.EQUALS, value);
    };
    DateOperation.prototype.exists = function (exists) {
        return this.getDefinedInstance(OperationType_1.OperationType.EXISTS, exists);
    };
    DateOperation.prototype.greaterThan = function (greaterThan) {
        return this.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN, greaterThan);
    };
    DateOperation.prototype.greaterThanOrEquals = function (greaterThanOrEquals) {
        return this.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN_OR_EQUALS, greaterThanOrEquals);
    };
    DateOperation.prototype.isIn = function (values) {
        return this.getDefinedInstance(OperationType_1.OperationType.IN, values);
    };
    DateOperation.prototype.lessThan = function (lessThan) {
        return this.getDefinedInstance(OperationType_1.OperationType.LESS_THAN, lessThan);
    };
    DateOperation.prototype.lessThanOrEquals = function (lessThanOrEquals) {
        return this.getDefinedInstance(OperationType_1.OperationType.LESS_THAN_OR_EQUALS, lessThanOrEquals);
    };
    DateOperation.prototype.notEquals = function (value) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT_EQUALS, value);
    };
    DateOperation.prototype.notIn = function (values) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT_IN, values);
    };
    DateOperation.prototype.and = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.getDefinedInstance(OperationType_1.OperationType.AND, ops);
    };
    DateOperation.prototype.or = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.getDefinedInstance(OperationType_1.OperationType.OR, ops);
    };
    DateOperation.prototype.not = function (op) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT, op);
    };
    return DateOperation;
}(FieldOperation_1.FieldOperation));
exports.DateOperation = DateOperation;
//# sourceMappingURL=DateOperation.js.map