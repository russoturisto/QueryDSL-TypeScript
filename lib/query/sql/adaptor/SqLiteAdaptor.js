"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Functions_1 = require("../../../core/field/Functions");
var Appliable_1 = require("../../../core/field/Appliable");
/**
 * Created by Papa on 8/27/2016.
 */
var SqLiteAdaptor = (function () {
    function SqLiteAdaptor() {
        this.functionAdaptor = new SqlLiteFunctionAdaptor();
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
    return SqLiteAdaptor;
}());
exports.SqLiteAdaptor = SqLiteAdaptor;
var SqlLiteFunctionAdaptor = (function (_super) {
    __extends(SqlLiteFunctionAdaptor, _super);
    function SqlLiteFunctionAdaptor() {
        _super.apply(this, arguments);
    }
    SqlLiteFunctionAdaptor.prototype.getFunctionCall = function (jsonFunctionCall, value, qEntityMapByAlias) {
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
                    return "ROUND(" + value + ", " + jsonFunctionCall[0] + ")";
                }
            case Functions_1.SqlFunction.NOW:
                return "DATE('now')";
            case Functions_1.SqlFunction.FORMAT:
                var formatString = jsonFunctionCall.parameters[0];
                var formatCall = "FORMAT('" + formatString + "', ";
                for (var i = 1; i < jsonFunctionCall.parameters.length; i++) {
                    var formatParam = jsonFunctionCall.parameters[i];
                    switch (formatParam.type) {
                        case Appliable_1.JSONClauseObjectType.FIELD:
                        case Appliable_1.JSONClauseObjectType.FIELD_FUNCTION:
                        case Appliable_1.JSONClauseObjectType.MANY_TO_ONE_RELATION:
                            formatParam = this.getFunctionCalls(formatParam, qEntityMapByAlias);
                            break;
                        default:
                            switch (typeof formatParam) {
                                case "boolean":
                                    formatParam = (formatParam) ? 'true' : 'false';
                                    break;
                                case "number":
                                    break;
                                case "string":
                                    formatParam = "'" + formatParam + "'";
                                    break;
                                default:
                                    "Unsupported parameter for Format function, can either be a boolean, number, string, property name, or a function call";
                            }
                    }
                    formatCall = formatCall + ", " + formatParam;
                }
                formatCall += ')';
                return formatCall;
            case Functions_1.SqlFunction.REPLACE:
                if (jsonFunctionCall.valueIsPrimitive) {
                    return "REPLACE('" + jsonFunctionCall.parameters[0] + "', " + jsonFunctionCall.parameters[1] + ", " + jsonFunctionCall.parameters[2] + ")";
                }
                else {
                    return "REPLACE('" + value + "', " + jsonFunctionCall[0] + ", " + jsonFunctionCall[1] + ")";
                }
            case Functions_1.SqlFunction.TRIM:
                if (jsonFunctionCall.valueIsPrimitive) {
                    return "TRIM('" + jsonFunctionCall.parameters[0] + "')";
                }
                else {
                    return "TRIM(" + value + ")";
                }
        }
    };
    return SqlLiteFunctionAdaptor;
}(Appliable_1.AbstractFunctionAdaptor));
exports.SqlLiteFunctionAdaptor = SqlLiteFunctionAdaptor;
//# sourceMappingURL=SqLiteAdaptor.js.map