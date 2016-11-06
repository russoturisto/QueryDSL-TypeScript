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
var QBooleanField = (function (_super) {
    __extends(QBooleanField, _super);
    function QBooleanField(q, qConstructor, entityName, fieldName) {
        _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.BOOLEAN, new BooleanOperation_1.BooleanOperation());
    }
    QBooleanField.prototype.getInstance = function (qEntity) {
        if (qEntity === void 0) { qEntity = this.q; }
        return this.copyFunctions(new QBooleanField(qEntity, this.qConstructor, this.entityName, this.fieldName));
    };
    return QBooleanField;
}(OperableField_1.QOperableField));
exports.QBooleanField = QBooleanField;
var QBooleanFunction = (function (_super) {
    __extends(QBooleanFunction, _super);
    function QBooleanFunction(value) {
        _super.call(this, null, null, null, null);
        this.value = value;
    }
    QBooleanFunction.prototype.getInstance = function () {
        return this.copyFunctions(new QBooleanFunction(this.value));
    };
    QBooleanFunction.prototype.toJSON = function (columnAliases) {
        return this.operableFunctionToJson(Appliable_1.JSONClauseObjectType.BOOLEAN_FIELD_FUNCTION, this.value, columnAliases);
    };
    return QBooleanFunction;
}(QBooleanField));
exports.QBooleanFunction = QBooleanFunction;
//# sourceMappingURL=BooleanField.js.map