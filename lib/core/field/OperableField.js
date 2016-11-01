"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var QOperableField = (function (_super) {
    __extends(QOperableField, _super);
    function QOperableField(q, qConstructor, entityName, fieldName, fieldType, operation, alias) {
        _super.call(this, q, qConstructor, entityName, fieldName, fieldType, alias);
        this.operation = operation;
        if (q) {
            q.addEntityField(fieldName, this);
        }
    }
    QOperableField.prototype.equals = function (value) {
        return this.operation.equals(this, value);
    };
    QOperableField.prototype.greaterThan = function (value) {
        return this.operation.greaterThan(this, value);
    };
    QOperableField.prototype.greaterThanOrEquals = function (value) {
        return this.operation.greaterThanOrEquals(this, value);
    };
    QOperableField.prototype.isNotNull = function () {
        return this.operation.isNotNull(this);
    };
    QOperableField.prototype.isNull = function () {
        return this.operation.isNull(this);
    };
    QOperableField.prototype.isIn = function (values) {
        return this.operation.isIn(this, values);
    };
    QOperableField.prototype.lessThan = function (value) {
        return this.operation.lessThan(this, value);
    };
    QOperableField.prototype.lessThanOrEquals = function (value) {
        return this.operation.lessThanOrEquals(this, value);
    };
    QOperableField.prototype.notEquals = function (value) {
        return this.operation.notEquals(this, value);
    };
    QOperableField.prototype.notIn = function (values) {
        return this.operation.notIn(this, values);
    };
    return QOperableField;
}(Field_1.QField));
exports.QOperableField = QOperableField;
//# sourceMappingURL=OperableField.js.map