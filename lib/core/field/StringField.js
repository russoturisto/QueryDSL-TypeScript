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
var Aliases_1 = require("../entity/Aliases");
var STRING_PROPERTY_ALIASES = new Aliases_1.ColumnAliases('sp_');
var STRING_ENTITY_PROPERTY_ALIASES = new Aliases_1.ColumnAliases('se_');
var QStringField = (function (_super) {
    __extends(QStringField, _super);
    function QStringField(q, qConstructor, entityName, fieldName, alias) {
        if (alias === void 0) { alias = STRING_ENTITY_PROPERTY_ALIASES.getNextAlias(); }
        _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.STRING, new StringOperation_1.StringOperation(), alias);
    }
    QStringField.prototype.getInstance = function () {
        return new QStringField(this.q, this.qConstructor, this.entityName, this.fieldName, STRING_PROPERTY_ALIASES.getNextAlias());
    };
    QStringField.prototype.like = function (like) {
        return this.operation.like(this, like);
    };
    return QStringField;
}(OperableField_1.QOperableField));
exports.QStringField = QStringField;
var STRING_PRIMITIVE_ALIASES = new Aliases_1.ColumnAliases('sp_');
var QStringFunction = (function (_super) {
    __extends(QStringFunction, _super);
    function QStringFunction(value, alias) {
        if (alias === void 0) { alias = STRING_PRIMITIVE_ALIASES.getNextAlias(); }
        _super.call(this, null, null, null, null, alias);
        this.value = value;
    }
    QStringFunction.prototype.getInstance = function () {
        return new QStringFunction(this.value);
    };
    QStringFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        var functionApplicable = this.getInstance();
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