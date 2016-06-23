"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FieldOperation_1 = require("./FieldOperation");
var Field_1 = require("../field/Field");
var OperationType_1 = require("./OperationType");
var BooleanOperation = (function (_super) {
    __extends(BooleanOperation, _super);
    function BooleanOperation() {
        _super.apply(this, arguments);
        this.fieldType = Field_1.FieldType.BOOLEAN;
    }
    BooleanOperation.prototype.getDefinedInstance = function (type, value) {
        var definedOperation = new BooleanOperation(type, this.fieldType);
        definedOperation.isDefined = true;
        definedOperation.value = value;
        return definedOperation;
    };
    BooleanOperation.prototype.equals = function (value) {
        return this.getDefinedInstance(OperationType_1.OperationType.EQUALS, value);
    };
    BooleanOperation.prototype.exists = function (exists) {
        return this.getDefinedInstance(OperationType_1.OperationType.EXISTS, exists);
    };
    BooleanOperation.prototype.notEquals = function (value) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT_EQUALS, value);
    };
    BooleanOperation.prototype.and = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.getDefinedInstance(OperationType_1.OperationType.AND, ops);
    };
    BooleanOperation.prototype.or = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.getDefinedInstance(OperationType_1.OperationType.OR, ops);
    };
    BooleanOperation.prototype.not = function (op) {
        return this.getDefinedInstance(OperationType_1.OperationType.NOT, op);
    };
    return BooleanOperation;
}(FieldOperation_1.FieldOperation));
exports.BooleanOperation = BooleanOperation;
//# sourceMappingURL=BooleanOperation.js.map