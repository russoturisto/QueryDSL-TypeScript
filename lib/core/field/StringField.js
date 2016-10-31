"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var StringOperation_1 = require("../operation/StringOperation");
var Appliable_1 = require("./Appliable");
var OperableField_1 = require("./OperableField");
var QStringField = (function (_super) {
    __extends(QStringField, _super);
    function QStringField(q, qConstructor, entityName, fieldName) {
        _super.call(this, QStringField, q, qConstructor, entityName, fieldName, Field_1.FieldType.STRING, new StringOperation_1.StringOperation());
    }
    QStringField.prototype.like = function (like) {
        return this.operation.like(this, like);
    };
    return QStringField;
}(OperableField_1.QOperableField));
exports.QStringField = QStringField;
var QStringFunction = (function (_super) {
    __extends(QStringFunction, _super);
    function QStringFunction(value) {
        _super.call(this, null, null, null, null);
        this.value = value;
    }
    QStringFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        var functionApplicable = new QStringFunction(this.value);
        functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
        functionApplicable.__appliedFunctions__.push(sqlFunctionCall);
        return functionApplicable;
    };
    QStringFunction.prototype.toJSON = function () {
        return this.operableFunctionToJson(Appliable_1.JSONClauseObjectType.STRING_FIELD_FUNCTION, this.value);
    };
    return QStringFunction;
}(QStringField));
exports.QStringFunction = QStringFunction;
//# sourceMappingURL=StringField.js.map