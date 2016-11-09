"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DateOperation_1 = require("../operation/DateOperation");
var Appliable_1 = require("./Appliable");
var OperableField_1 = require("./OperableField");
var QDateField = (function (_super) {
    __extends(QDateField, _super);
    function QDateField(q, qConstructor, entityName, fieldName, objectType) {
        if (objectType === void 0) { objectType = Appliable_1.JSONClauseObjectType.FIELD; }
        _super.call(this, q, qConstructor, entityName, fieldName, objectType, Appliable_1.SQLDataType.DATE, new DateOperation_1.DateOperation());
    }
    QDateField.prototype.getInstance = function (qEntity) {
        if (qEntity === void 0) { qEntity = this.q; }
        return this.copyFunctions(new QDateField(qEntity, this.qConstructor, this.entityName, this.fieldName));
    };
    return QDateField;
}(OperableField_1.QOperableField));
exports.QDateField = QDateField;
var QDateFunction = (function (_super) {
    __extends(QDateFunction, _super);
    function QDateFunction(value, isQueryParameter) {
        if (isQueryParameter === void 0) { isQueryParameter = false; }
        _super.call(this, null, null, null, null, Appliable_1.JSONClauseObjectType.FIELD_FUNCTION);
        this.value = value;
        this.isQueryParameter = isQueryParameter;
    }
    QDateFunction.prototype.getInstance = function () {
        return this.copyFunctions(new QDateFunction(this.value));
    };
    QDateFunction.prototype.toJSON = function (columnAliases, forSelectClause) {
        var json = this.operableFunctionToJson(this, columnAliases, forSelectClause);
        if (this.isQueryParameter) {
            this.parameterAlias = json.value;
        }
        return json;
    };
    return QDateFunction;
}(QDateField));
exports.QDateFunction = QDateFunction;
//# sourceMappingURL=DateField.js.map