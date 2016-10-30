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
    SqLiteAdaptor.prototype.dateToDbQuery = function (date, embedParameters) {
        var milliseconds = date.getTime();
        if (embedParameters) {
            return "FROM_UNIXTIME(" + milliseconds + ")";
        }
        else {
            return milliseconds;
        }
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
    SqlLiteFunctionAdaptor.prototype.getFunctionCall = function (jsonFunctionCall, value, qEntityMapByAlias, forField) {
        switch (jsonFunctionCall.functionType) {
            case Functions_1.SqlFunction.ABS:
                if (jsonFunctionCall.valueIsPrimitive) {
                    return "ABS(" + jsonFunctionCall.parameters[0] + ")";
                }
                else {
                    return "ABS(" + value + ")";
                }
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
                if (jsonFunctionCall.valueIsPrimitive) {
                    return "UPPER('" + jsonFunctionCall.parameters[0] + "')";
                }
                else {
                    return "UPPER(" + value + ")";
                }
            case Functions_1.SqlFunction.LCASE:
                if (jsonFunctionCall.valueIsPrimitive) {
                    return "LOWER('" + jsonFunctionCall.parameters[0] + "')";
                }
                else {
                    return "LOWER(" + value + ")";
                }
            case Functions_1.SqlFunction.MID:
                if (jsonFunctionCall.valueIsPrimitive) {
                    return "SUBSTR(" + jsonFunctionCall.parameters[0] + ", " + jsonFunctionCall.parameters[1] + ", " + jsonFunctionCall.parameters[2] + ")";
                }
                else {
                    return "SUBSTR('" + value + "', " + jsonFunctionCall[0] + ", " + jsonFunctionCall[1] + ")";
                }
            case Functions_1.SqlFunction.LEN:
                if (jsonFunctionCall.valueIsPrimitive) {
                    return "LENGTH('" + jsonFunctionCall.parameters[0] + "')";
                }
                else {
                    return "LENGTH(" + value + ")";
                }
            case Functions_1.SqlFunction.ROUND:
                if (jsonFunctionCall.valueIsPrimitive) {
                    return "ROUND(" + jsonFunctionCall.parameters[0] + ", " + jsonFunctionCall.parameters[1] + ")";
                }
                else {
                    var param1 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[0], true, false);
                    return "ROUND(" + value + ", " + jsonFunctionCall[0] + ")";
                }
            case Functions_1.SqlFunction.NOW:
                return "DATE('now')";
            case Functions_1.SqlFunction.FORMAT:
                var formatString = jsonFunctionCall.parameters[0];
                formatString = this.sqlValueProvider.getValue(formatString, true, false);
                var formatCall = "FORMAT('" + formatString + "', ";
                for (var i = 1; i < jsonFunctionCall.parameters.length; i++) {
                    var formatParam = jsonFunctionCall.parameters[i];
                    formatParam = this.sqlValueProvider.getValue(formatParam, true, true);
                    formatCall = formatCall + ", " + formatParam;
                }
                formatCall += ')';
                return formatCall;
            case Functions_1.SqlFunction.REPLACE:
                if (jsonFunctionCall.valueIsPrimitive) {
                    var param1 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[0], true, false);
                    var param2 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[1], true, false);
                    var param3 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[2], true, false);
                    return "REPLACE('" + param1 + "', " + param2 + ", " + param3 + ")";
                }
                else {
                    var param1 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[0], true, false);
                    var param2 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[1], true, false);
                    return "REPLACE('" + value + "', " + param1 + ", " + param2 + ")";
                }
            case Functions_1.SqlFunction.TRIM:
                if (jsonFunctionCall.valueIsPrimitive) {
                    var param1 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[0], true, false);
                    return "TRIM('" + param1 + "')";
                }
                else {
                    return "TRIM(" + value + ")";
                }
        }
    };
    return SqlLiteFunctionAdaptor;
}(SQLAdaptor_1.AbstractFunctionAdaptor));
exports.SqlLiteFunctionAdaptor = SqlLiteFunctionAdaptor;
//# sourceMappingURL=SqLiteAdaptor.js.map