"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NumberOperation_1 = require("../operation/NumberOperation");
var Appliable_1 = require("./Appliable");
var OperableField_1 = require("./OperableField");
var QNumberField = (function (_super) {
    __extends(QNumberField, _super);
    function QNumberField(q, qConstructor, entityName, fieldName, objectType) {
        if (objectType === void 0) { objectType = Appliable_1.JSONClauseObjectType.FIELD; }
        _super.call(this, q, qConstructor, entityName, fieldName, objectType, Appliable_1.SQLDataType.NUMBER, new NumberOperation_1.NumberOperation());
    }
    QNumberField.prototype.getInstance = function (qEntity) {
        if (qEntity === void 0) { qEntity = this.q; }
        return this.copyFunctions(new QNumberField(qEntity, this.qConstructor, this.entityName, this.fieldName));
    };
    return QNumberField;
}(OperableField_1.QOperableField));
exports.QNumberField = QNumberField;
var QNumberFunction = (function (_super) {
    __extends(QNumberFunction, _super);
    function QNumberFunction(value, isQueryParameter) {
        if (isQueryParameter === void 0) { isQueryParameter = false; }
        _super.call(this, null, null, null, null, Appliable_1.JSONClauseObjectType.FIELD_FUNCTION);
        this.value = value;
        this.isQueryParameter = isQueryParameter;
    }
    QNumberFunction.prototype.getInstance = function () {
        return this.copyFunctions(new QNumberFunction(this.value));
    };
    QNumberFunction.prototype.toJSON = function (columnAliases, forSelectClause) {
        var json = this.operableFunctionToJson(this, columnAliases, forSelectClause);
        if (this.isQueryParameter) {
            this.parameterAlias = json.value;
        }
        return json;
    };
    return QNumberFunction;
}(QNumberField));
exports.QNumberFunction = QNumberFunction;
//# sourceMappingURL=NumberField.js.map