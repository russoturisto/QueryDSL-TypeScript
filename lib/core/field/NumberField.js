"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var NumberOperation_1 = require("../operation/NumberOperation");
var Appliable_1 = require("./Appliable");
var OperableField_1 = require("./OperableField");
var Aliases_1 = require("../entity/Aliases");
exports.NUMBER_PROPERTY_ALIASES = new Aliases_1.ColumnAliases('np_');
exports.NUMBER_ENTITY_PROPERTY_ALIASES = new Aliases_1.ColumnAliases('ne_');
var QNumberField = (function (_super) {
    __extends(QNumberField, _super);
    function QNumberField(q, qConstructor, entityName, fieldName, alias) {
        if (alias === void 0) { alias = exports.NUMBER_ENTITY_PROPERTY_ALIASES.getNextAlias(); }
        _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.DATE, new NumberOperation_1.NumberOperation(), alias);
    }
    QNumberField.prototype.getInstance = function () {
        return new QNumberField(this.q, this.qConstructor, this.entityName, this.fieldName, exports.NUMBER_PROPERTY_ALIASES.getNextAlias());
    };
    return QNumberField;
}(OperableField_1.QOperableField));
exports.QNumberField = QNumberField;
var NUMBER_FUNCTION_ALIASES = new Aliases_1.ColumnAliases('nf_');
var QNumberFunction = (function (_super) {
    __extends(QNumberFunction, _super);
    function QNumberFunction(value, alias) {
        if (alias === void 0) { alias = NUMBER_FUNCTION_ALIASES.getNextAlias(); }
        _super.call(this, null, null, null, null, alias);
        this.value = value;
    }
    QNumberFunction.prototype.getInstance = function () {
        return new QNumberFunction(this.value);
    };
    QNumberFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        var functionApplicable = this.getInstance();
        functionApplicable.__appliedFunctions__ = functionApplicable.__appliedFunctions__.concat(this.__appliedFunctions__);
        functionApplicable.__appliedFunctions__.push(sqlFunctionCall);
        return functionApplicable;
    };
    QNumberFunction.prototype.toJSON = function () {
        return this.operableFunctionToJson(Appliable_1.JSONClauseObjectType.NUMBER_FIELD_FUNCTION, this.value);
    };
    return QNumberFunction;
}(QNumberField));
exports.QNumberFunction = QNumberFunction;
//# sourceMappingURL=NumberField.js.map