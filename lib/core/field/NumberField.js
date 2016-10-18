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
        return _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.NUMBER, new NumberOperation_1.NumberOperation()) || this;
    }
    QNumberField.prototype.greaterThan = function (greaterThan) {
        return this.setOperation(this.operation.greaterThan(greaterThan));
    };
    QNumberField.prototype.greaterThanOrEquals = function (greaterThanOrEquals) {
        return this.setOperation(this.operation.greaterThanOrEquals(greaterThanOrEquals));
    };
    QNumberField.prototype.lessThan = function (lessThan) {
        return this.setOperation(this.operation.lessThan(lessThan));
    };
    QNumberField.prototype.lessThanOrEquals = function (lessThanOrEquals) {
        return this.setOperation(this.operation.lessThanOrEquals(lessThanOrEquals));
    };
    return QNumberField;
}(Field_1.QField));
exports.QNumberField = QNumberField;
//# sourceMappingURL=NumberField.js.map