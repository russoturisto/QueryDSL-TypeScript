"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BooleanOperation_1 = require("../operation/BooleanOperation");
var Field_1 = require("./Field");
var OperableField_1 = require("./OperableField");
var Appliable_1 = require("./Appliable");
var Aliases_1 = require("../entity/Aliases");
var BOOLEAN_PROPERTY_ALIASES = new Aliases_1.ColumnAliases('bp_');
exports.BOOLEAN_ENTITY_PROPERTY_ALIASES = new Aliases_1.ColumnAliases('be_');
var QBooleanField = (function (_super) {
    __extends(QBooleanField, _super);
    function QBooleanField(q, qConstructor, entityName, fieldName, alias) {
        if (alias === void 0) { alias = exports.BOOLEAN_ENTITY_PROPERTY_ALIASES.getNextAlias(); }
        _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.BOOLEAN, new BooleanOperation_1.BooleanOperation(), alias);
    }
    QBooleanField.prototype.getInstance = function () {
        return new QBooleanField(this.q, this.qConstructor, this.entityName, this.fieldName, BOOLEAN_PROPERTY_ALIASES.getNextAlias());
    };
    return QBooleanField;
}(OperableField_1.QOperableField));
exports.QBooleanField = QBooleanField;
var BOOLEAN_FUNCTION_ALIASES = new Aliases_1.ColumnAliases('bf_');
var QBooleanFunction = (function (_super) {
    __extends(QBooleanFunction, _super);
    function QBooleanFunction(value, alias) {
        if (alias === void 0) { alias = BOOLEAN_FUNCTION_ALIASES.getNextAlias(); }
        _super.call(this, null, null, null, null, alias);
        this.value = value;
    }
    QBooleanFunction.prototype.getInstance = function () {
        return new QBooleanFunction(this.value);
    };
    QBooleanFunction.prototype.toJSON = function () {
        return this.operableFunctionToJson(Appliable_1.JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION, this.value);
    };
    return QBooleanFunction;
}(QBooleanField));
exports.QBooleanFunction = QBooleanFunction;
//# sourceMappingURL=BooleanField.js.map