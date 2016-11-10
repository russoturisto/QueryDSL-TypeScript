"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StringOperation_1 = require("../operation/StringOperation");
var Appliable_1 = require("./Appliable");
var OperableField_1 = require("./OperableField");
var QStringField = (function (_super) {
    __extends(QStringField, _super);
    function QStringField(q, qConstructor, entityName, fieldName, objectType) {
        if (objectType === void 0) { objectType = Appliable_1.JSONClauseObjectType.FIELD; }
        _super.call(this, q, qConstructor, entityName, fieldName, objectType, Appliable_1.SQLDataType.STRING, new StringOperation_1.StringOperation());
    }
    QStringField.prototype.getInstance = function (qEntity) {
        if (qEntity === void 0) { qEntity = this.q; }
        return this.copyFunctions(new QStringField(qEntity, this.qConstructor, this.entityName, this.fieldName));
    };
    QStringField.prototype.like = function (value) {
        return this.operation.like(this, OperableField_1.QOperableField.wrapPrimitive(value));
    };
    return QStringField;
}(OperableField_1.QOperableField));
exports.QStringField = QStringField;
var QStringFunction = (function (_super) {
    __extends(QStringFunction, _super);
    function QStringFunction(value, isQueryParameter) {
        if (isQueryParameter === void 0) { isQueryParameter = false; }
        _super.call(this, null, null, null, null, Appliable_1.JSONClauseObjectType.FIELD_FUNCTION);
        this.value = value;
        this.isQueryParameter = isQueryParameter;
    }
    QStringFunction.prototype.getInstance = function () {
        return this.copyFunctions(new QStringFunction(this.value));
    };
    QStringFunction.prototype.toJSON = function (columnAliases, forSelectClause) {
        var json = this.operableFunctionToJson(this, columnAliases, forSelectClause);
        if (this.isQueryParameter) {
            this.parameterAlias = json.value;
        }
        return json;
    };
    return QStringFunction;
}(QStringField));
exports.QStringFunction = QStringFunction;
//# sourceMappingURL=StringField.js.map