"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var DateOperation_1 = require("../operation/DateOperation");
var QDateField = (function (_super) {
    __extends(QDateField, _super);
    function QDateField(q, qConstructor, entityName, fieldName) {
        _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.DATE);
        this.dateOperation = new DateOperation_1.DateOperation();
    }
    QDateField.prototype.equals = function (value) {
        return this.setOperation(this.dateOperation.equals(value));
    };
    QDateField.prototype.exists = function (exists) {
        return this.setOperation(this.dateOperation.exists(exists));
    };
    QDateField.prototype.greaterThan = function (greaterThan) {
        return this.setOperation(this.dateOperation.greaterThan(greaterThan));
    };
    QDateField.prototype.greaterThanOrEquals = function (greaterThanOrEquals) {
        return this.setOperation(this.dateOperation.greaterThanOrEquals(greaterThanOrEquals));
    };
    QDateField.prototype.isIn = function (values) {
        return this.setOperation(this.dateOperation.isIn(values));
    };
    QDateField.prototype.lessThan = function (lessThan) {
        return this.setOperation(this.dateOperation.lessThan(lessThan));
    };
    QDateField.prototype.lessThanOrEquals = function (lessThanOrEquals) {
        return this.setOperation(this.dateOperation.lessThanOrEquals(lessThanOrEquals));
    };
    QDateField.prototype.notEquals = function (value) {
        return this.setOperation(this.dateOperation.notEquals(value));
    };
    QDateField.prototype.notIn = function (values) {
        return this.setOperation(this.dateOperation.notIn(values));
    };
    return QDateField;
}(Field_1.QField));
exports.QDateField = QDateField;
//# sourceMappingURL=DateField.js.map