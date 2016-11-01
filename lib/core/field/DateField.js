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
var Aliases_1 = require("../entity/Aliases");
var DATE_PROPERTY_ALIASES = new Aliases_1.ColumnAliases('dp_');
var DATE_ENTITY_PROPERTY_ALIASES = new Aliases_1.ColumnAliases('de_');
var QDateField = (function (_super) {
    __extends(QDateField, _super);
    function QDateField(q, qConstructor, entityName, fieldName, alias) {
        if (alias === void 0) { alias = DATE_ENTITY_PROPERTY_ALIASES.getNextAlias(); }
        _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.DATE, new DateOperation_1.DateOperation(), alias);
    }
    QDateField.prototype.getInstance = function () {
        return new QDateField(this.q, this.qConstructor, this.entityName, this.fieldName, DATE_PROPERTY_ALIASES.getNextAlias());
    };
    return QDateField;
}(OperableField_1.QOperableField));
exports.QDateField = QDateField;
var DATE_FUNCTION_ALIASES = new Aliases_1.ColumnAliases('df_');
var QDateFunction = (function (_super) {
    __extends(QDateFunction, _super);
    function QDateFunction(value, alias) {
        if (alias === void 0) { alias = DATE_FUNCTION_ALIASES.getNextAlias(); }
        _super.call(this, null, null, null, null, alias);
        this.value = value;
    }
    QDateFunction.prototype.getInstance = function () {
        return new QDateFunction(this.value);
    };
    QDateFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        var functionApplicable = this.getInstance();
        functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
        functionApplicable.__appliedFunctions__.push(sqlFunctionCall);
        return functionApplicable;
    };
    QDateFunction.prototype.toJSON = function () {
        return this.operableFunctionToJson(Appliable_1.JSONClauseObjectType.DATE_FIELD_FUNCTION, this.value);
    };
    return QDateFunction;
}(QDateField));
exports.QDateFunction = QDateFunction;
//# sourceMappingURL=DateField.js.map