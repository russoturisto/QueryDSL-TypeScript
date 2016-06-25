"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FieldOperation_1 = require("./FieldOperation");
var Field_1 = require("../field/Field");
var OperationType_1 = require("./OperationType");
var StringOperation = (function (_super) {
    __extends(StringOperation, _super);
    function StringOperation(type) {
        _super.call(this, type, Field_1.FieldType.NUMBER);
    }
    StringOperation.prototype.getDefinedInstance = function (type, value) {
        var definedOperation = new StringOperation(type);
        definedOperation.isDefined = true;
        definedOperation.value = value;
        return definedOperation;
    };
    StringOperation.prototype.equals = function (value) {
        return this.getDefinedInstance(OperationType_1.OperationType.EQUALS, value);
    };
    StringOperation.prototype.exists = function (exists) {
        return this.getDefinedInstance(OperationType_1.OperationType.EXISTS, exists);
    };
    StringOperation.prototype.isIn = function (values) {
        return this.getDefinedInstance(OperationType_1.OperationType.IN, values);
    };
    StringOperation.prototype.like = function (like) {
        return this.getDefinedInstance(OperationType_1.OperationType.LIKE, like);
    };
    StringOperation.prototype.notEquals = function (value) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT_EQUALS, value);
    };
    StringOperation.prototype.notIn = function (values) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT_IN, values);
    };
    StringOperation.prototype.and = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.getDefinedInstance(OperationType_1.OperationType.AND, ops);
    };
    StringOperation.prototype.or = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.getDefinedInstance(OperationType_1.OperationType.OR, ops);
    };
    StringOperation.prototype.not = function (op) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT, op);
    };
    return StringOperation;
}(FieldOperation_1.FieldOperation));
exports.StringOperation = StringOperation;
//# sourceMappingURL=StringOperation.js.map