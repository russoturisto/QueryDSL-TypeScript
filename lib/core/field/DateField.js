"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var DateOperation_1 = require("../operation/DateOperation");
var Appliable_1 = require("./Appliable");
var OperableField_1 = require("./OperableField");
var QDateField = (function (_super) {
    __extends(QDateField, _super);
    function QDateField(q, qConstructor, entityName, fieldName) {
        _super.call(this, QDateField, q, qConstructor, entityName, fieldName, Field_1.FieldType.DATE, new DateOperation_1.DateOperation());
    }
    return QDateField;
}(OperableField_1.QOperableField));
exports.QDateField = QDateField;
var QDateFunction = (function (_super) {
    __extends(QDateFunction, _super);
    function QDateFunction(value) {
        _super.call(this, null, null, null, null);
        this.value = value;
    }
    QDateFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        var functionApplicable = new QDateFunction(this.value);
        functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
        functionApplicable.__appliedFunctions__.push(sqlFunctionCall);
        return functionApplicable;
    };
    QDateFunction.prototype.toJSON = function () {
        return {
            __appliedFunctions__: this.__appliedFunctions__,
            type: Appliable_1.JSONClauseObjectType.DATE_FIELD_FUNCTION,
            value: this.value
        };
    };
    return QDateFunction;
}(QDateField));
exports.QDateFunction = QDateFunction;
//# sourceMappingURL=DateField.js.map