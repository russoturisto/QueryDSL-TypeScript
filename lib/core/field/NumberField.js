"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var NumberOperation_1 = require("../operation/NumberOperation");
var QNumberField = (function (_super) {
    __extends(QNumberField, _super);
    function QNumberField(q, qConstructor, entityName, fieldName) {
        _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.NUMBER);
        this.numberOperation = new NumberOperation_1.NumberOperation();
    }
    QNumberField.prototype.equals = function (value) {
        return this.setOperation(this.numberOperation.equals(value));
    };
    QNumberField.prototype.exists = function (exists) {
        return this.setOperation(this.numberOperation.exists(exists));
    };
    QNumberField.prototype.greaterThan = function (greaterThan) {
        return this.setOperation(this.numberOperation.greaterThan(greaterThan));
    };
    QNumberField.prototype.greaterThanOrEquals = function (greaterThanOrEquals) {
        return this.setOperation(this.numberOperation.greaterThanOrEquals(greaterThanOrEquals));
    };
    QNumberField.prototype.isIn = function (values) {
        return this.setOperation(this.numberOperation.isIn(values));
    };
    QNumberField.prototype.lessThan = function (lessThan) {
        return this.setOperation(this.numberOperation.lessThan(lessThan));
    };
    QNumberField.prototype.lessThanOrEquals = function (lessThanOrEquals) {
        return this.setOperation(this.numberOperation.lessThanOrEquals(lessThanOrEquals));
    };
    QNumberField.prototype.notEquals = function (value) {
        return this.setOperation(this.numberOperation.notEquals(value));
    };
    QNumberField.prototype.notIn = function (values) {
        return this.setOperation(this.numberOperation.notIn(values));
    };
    return QNumberField;
}(Field_1.QField));
exports.QNumberField = QNumberField;
//# sourceMappingURL=NumberField.js.map