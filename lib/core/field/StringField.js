"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var StringOperation_1 = require("../operation/StringOperation");
var QStringField = (function (_super) {
    __extends(QStringField, _super);
    function QStringField(q, qConstructor, entityName, fieldName) {
        _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.BOOLEAN);
        this.stringOperation = new StringOperation_1.StringOperation();
    }
    QStringField.prototype.equals = function (value) {
        return this.setOperation(this.stringOperation.equals(value));
    };
    QStringField.prototype.exists = function (exists) {
        return this.setOperation(this.stringOperation.exists(exists));
    };
    QStringField.prototype.isIn = function (values) {
        return this.setOperation(this.stringOperation.isIn(values));
    };
    QStringField.prototype.like = function (like) {
        return this.setOperation(this.stringOperation.like(like));
    };
    QStringField.prototype.notEquals = function (value) {
        return this.setOperation(this.stringOperation.notEquals(value));
    };
    QStringField.prototype.notIn = function (values) {
        return this.setOperation(this.stringOperation.notIn(values));
    };
    return QStringField;
}(Field_1.QField));
exports.QStringField = QStringField;
//# sourceMappingURL=StringField.js.map