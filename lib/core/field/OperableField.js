"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var Functions_1 = require("./Functions");
var QOperableField = (function (_super) {
    __extends(QOperableField, _super);
    function QOperableField(q, qConstructor, entityName, fieldName, objectType, dataType, operation) {
        _super.call(this, q, qConstructor, entityName, fieldName, objectType, dataType);
        this.operation = operation;
        if (q) {
            q.addEntityField(fieldName, this);
        }
    }
    QOperableField.prototype.equals = function (value) {
        return this.operation.equals(this, this.wrapPrimitive(value));
    };
    QOperableField.prototype.greaterThan = function (value) {
        return this.operation.greaterThan(this, this.wrapPrimitive(value));
    };
    QOperableField.prototype.greaterThanOrEquals = function (value) {
        return this.operation.greaterThanOrEquals(this, this.wrapPrimitive(value));
    };
    QOperableField.prototype.isNotNull = function () {
        return this.operation.isNotNull(this);
    };
    QOperableField.prototype.isNull = function () {
        return this.operation.isNull(this);
    };
    QOperableField.prototype.isIn = function (values) {
        return this.operation.isIn(this, this.wrapPrimitive(values));
    };
    QOperableField.prototype.lessThan = function (value) {
        return this.operation.lessThan(this, this.wrapPrimitive(value));
    };
    QOperableField.prototype.lessThanOrEquals = function (value) {
        return this.operation.lessThanOrEquals(this, this.wrapPrimitive(value));
    };
    QOperableField.prototype.notEquals = function (value) {
        return this.operation.notEquals(this, this.wrapPrimitive(value));
    };
    QOperableField.prototype.notIn = function (values) {
        return this.operation.notIn(this, this.wrapPrimitive(values));
    };
    QOperableField.prototype.wrapPrimitive = function (value) {
        switch (typeof value) {
            case "boolean":
                return Functions_1.bool(value);
            case "number":
                return Functions_1.num(value);
            case "string":
                return Functions_1.str(value);
            case "undefined":
                throw "Cannot use an 'undefined' value in an operation";
        }
        if (value instanceof Date) {
            return Functions_1.date(value);
        }
        return value;
    };
    return QOperableField;
}(Field_1.QField));
exports.QOperableField = QOperableField;
//# sourceMappingURL=OperableField.js.map