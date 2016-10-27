"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var QOperableField = (function (_super) {
    __extends(QOperableField, _super);
    function QOperableField(
        // All child field constructors must have the following signature (4 parameters):
        childConstructor, q, qConstructor, entityName, fieldName, fieldType, operation) {
        _super.call(this, childConstructor, q, qConstructor, entityName, fieldName, fieldType);
        this.operation = operation;
        if (q) {
            q.addEntityField(fieldName, this);
        }
    }
    QOperableField.prototype.getInstance = function () {
        return new this.childConstructor(this.q, this.qConstructor, this.entityName, this.fieldName, this.fieldType, this.operation);
    };
    QOperableField.prototype.setOperation = function (jsonOperation) {
        jsonOperation.lValue = this;
        return jsonOperation;
    };
    QOperableField.prototype.equals = function (value) {
        return this.setOperation(this.operation.equals(value));
    };
    QOperableField.prototype.isNotNull = function () {
        return this.setOperation(this.operation.isNotNull());
    };
    QOperableField.prototype.isNull = function () {
        return this.setOperation(this.operation.isNull());
    };
    QOperableField.prototype.isIn = function (values) {
        return this.setOperation(this.operation.isIn(values));
    };
    QOperableField.prototype.notEquals = function (value) {
        return this.setOperation(this.operation.notEquals(value));
    };
    QOperableField.prototype.notIn = function (values) {
        return this.setOperation(this.operation.notIn(values));
    };
    return QOperableField;
}(Field_1.QField));
exports.QOperableField = QOperableField;
//# sourceMappingURL=OperableField.js.map