"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FieldOperation_1 = require("./FieldOperation");
var Field_1 = require("../field/Field");
var OperationType_1 = require("./OperationType");
var NumberOperation = (function (_super) {
    __extends(NumberOperation, _super);
    function NumberOperation() {
        _super.apply(this, arguments);
        this.fieldType = Field_1.FieldType.NUMBER;
    }
    NumberOperation.prototype.getDefinedInstance = function (type, value) {
        var definedOperation = new NumberOperation(type, this.fieldType);
        definedOperation.isDefined = true;
        definedOperation.value = value;
        return definedOperation;
    };
    NumberOperation.prototype.equals = function (value) {
        return this.getDefinedInstance(OperationType_1.OperationType.EQUALS, value);
    };
    NumberOperation.prototype.exists = function (exists) {
        return this.getDefinedInstance(OperationType_1.OperationType.EXISTS, exists);
    };
    NumberOperation.prototype.greaterThan = function (greaterThan) {
        return this.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN, greaterThan);
    };
    NumberOperation.prototype.greaterThanOrEquals = function (greaterThanOrEquals) {
        return this.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN_OR_EQUALS, greaterThanOrEquals);
    };
    NumberOperation.prototype.isIn = function (values) {
        return this.getDefinedInstance(OperationType_1.OperationType.IN, values);
    };
    NumberOperation.prototype.lessThan = function (lessThan) {
        return this.getDefinedInstance(OperationType_1.OperationType.LESS_THAN, lessThan);
    };
    NumberOperation.prototype.lessThanOrEquals = function (lessThanOrEquals) {
        return this.getDefinedInstance(OperationType_1.OperationType.LESS_THAN_OR_EQUALS, lessThanOrEquals);
    };
    NumberOperation.prototype.notEquals = function (value) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT_EQUALS, value);
    };
    NumberOperation.prototype.notIn = function (values) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT_IN, values);
    };
    NumberOperation.prototype.and = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.getDefinedInstance(OperationType_1.OperationType.AND, ops);
    };
    NumberOperation.prototype.or = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.getDefinedInstance(OperationType_1.OperationType.OR, ops);
    };
    NumberOperation.prototype.not = function (op) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT, op);
    };
    return NumberOperation;
}(FieldOperation_1.FieldOperation));
exports.NumberOperation = NumberOperation;
//# sourceMappingURL=NumberOperation.js.map