"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var DateOperation_1 = require("../operation/DateOperation");
var Appliable_1 = require("./Appliable");
var QDateField = (function (_super) {
    __extends(QDateField, _super);
    function QDateField(q, qConstructor, entityName, fieldName) {
        _super.call(this, QDateField, q, qConstructor, entityName, fieldName, Field_1.FieldType.DATE, new DateOperation_1.DateOperation());
    }
    QDateField.prototype.greaterThan = function (value) {
        return this.setOperation(this.operation.greaterThan(value));
    };
    QDateField.prototype.greaterThanOrEquals = function (value) {
        return this.setOperation(this.operation.greaterThanOrEquals(value));
    };
    QDateField.prototype.lessThan = function (value) {
        return this.setOperation(this.operation.lessThan(value));
    };
    QDateField.prototype.lessThanOrEquals = function (value) {
        return this.setOperation(this.operation.lessThanOrEquals(value));
    };
    return QDateField;
}(Field_1.QField));
exports.QDateField = QDateField;
var QDateFunction = (function (_super) {
    __extends(QDateFunction, _super);
    function QDateFunction() {
        _super.call(this, null, null, null, null);
    }
    QDateFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        var functionApplicable = new QDateFunction();
        functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
        functionApplicable.__appliedFunctions__.push(sqlFunctionCall);
        return functionApplicable;
    };
    QDateFunction.prototype.toJSON = function () {
        return {
            __appliedFunctions__: this.__appliedFunctions__,
            type: Appliable_1.JSONClauseObjectType.FIELD_FUNCTION
        };
    };
    return QDateFunction;
}(QDateField));
exports.QDateFunction = QDateFunction;
//# sourceMappingURL=DateField.js.map