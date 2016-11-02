"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLAdaptor_1 = require("./SQLAdaptor");
var Functions_1 = require("../../../core/field/Functions");
/**
 * Created by Papa on 8/27/2016.
 */
var SqLiteAdaptor = (function () {
    function SqLiteAdaptor(sqlValueProvider) {
        this.sqlValueProvider = sqlValueProvider;
        this.functionAdaptor = new SqlLiteFunctionAdaptor(sqlValueProvider);
    }
    SqLiteAdaptor.prototype.getParameterSymbol = function () {
        return '?';
    };
    SqLiteAdaptor.prototype.dateToDbQuery = function (date) {
        var milliseconds = date.getTime();
        return '' + milliseconds;
    };
    SqLiteAdaptor.prototype.getResultArray = function (rawResponse) {
        return rawResponse.res.rows;
    };
    SqLiteAdaptor.prototype.getResultCellValue = function (resultRow, columnName, index, dataType, defaultValue) {
        return resultRow[columnName];
    };
    SqLiteAdaptor.prototype.getFunctionAdaptor = function () {
        return this.functionAdaptor;
    };
    SqLiteAdaptor.prototype.applyFunction = function (value, functionCall, isField) {
        throw "Not implemented applyFunction";
    };
    return SqLiteAdaptor;
}());
exports.SqLiteAdaptor = SqLiteAdaptor;
var SqlLiteFunctionAdaptor = (function (_super) {
    __extends(SqlLiteFunctionAdaptor, _super);
    function SqlLiteFunctionAdaptor(sqlValueProvider) {
        _super.call(this, sqlValueProvider);
        this.sqlValueProvider = sqlValueProvider;
    }
    SqlLiteFunctionAdaptor.prototype.getFunctionCall = function (jsonFunctionCall, value, qEntityMapByAlias, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        switch (jsonFunctionCall.functionType) {
            case Functions_1.SqlFunction.ABS:
                return "ABS(" + value + ")";
            case Functions_1.SqlFunction.AVG:
                return "AVG(" + value + ")";
            case Functions_1.SqlFunction.COUNT:
                return "COUNT(" + value + ")";
            case Functions_1.SqlFunction.MAX:
                return "MAX(" + value + ")";
            case Functions_1.SqlFunction.MIN:
                return "MIN(" + value + ")";
            case Functions_1.SqlFunction.SUM:
                return "SUM(" + value + ")";
            case Functions_1.SqlFunction.UCASE:
                return "UPPER(" + value + ")";
            case Functions_1.SqlFunction.LCASE:
                return "LOWER(" + value + ")";
            case Functions_1.SqlFunction.MID:
                var start = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[0]);
                var length_1 = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[1]);
                return "SUBSTR(" + value + ", " + start + ", " + length_1 + ")";
            case Functions_1.SqlFunction.LEN:
                return "LENGTH(" + value + ")";
            case Functions_1.SqlFunction.ROUND:
                var digits = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[0]);
                return "ROUND(" + value + ", " + digits + ")";
            case Functions_1.SqlFunction.NOW:
                return "DATE('now')";
            case Functions_1.SqlFunction.FORMAT:
                var formatCall = "FORMAT('" + value + "', ";
                for (var i = 0; i < jsonFunctionCall.parameters.length; i++) {
                    var formatParam = jsonFunctionCall.parameters[i];
                    formatParam = this.sqlValueProvider.getFunctionCallValue(formatParam);
                    formatCall = formatCall + ", " + formatParam;
                }
                formatCall += ')';
                return formatCall;
            case Functions_1.SqlFunction.REPLACE:
                var param1 = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[0]);
                var param2 = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[1]);
                return "REPLACE('" + value + "', " + param1 + ", " + param2 + ")";
            case Functions_1.SqlFunction.TRIM:
                return "TRIM(" + value + ")";
            case Functions_1.SqlFunction.DISTINCT:
                throw "Invalid placement of a distinct function";
            case Functions_1.SqlFunction.EXISTS:
                throw "Invalid placement of an exists function";
            default:
                throw "Unknown function type: " + jsonFunctionCall.functionType;
        }
    };
    return SqlLiteFunctionAdaptor;
}(SQLAdaptor_1.AbstractFunctionAdaptor));
exports.SqlLiteFunctionAdaptor = SqlLiteFunctionAdaptor;
//# sourceMappingURL=SqLiteAdaptor.js.map