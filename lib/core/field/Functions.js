"use strict";
var Appliable_1 = require("./Appliable");
/**
 * Extrated from http://www.w3schools.com/sql/sql_functions.asp
 */
(function (SqlFunction) {
    // SQL Aggregate Functions
    // SQL aggregate functions return a single value, calculated from values in a column.
    // Useful Aggregate functions:
    SqlFunction[SqlFunction["ABS"] = 0] = "ABS";
    SqlFunction[SqlFunction["AVG"] = 1] = "AVG";
    SqlFunction[SqlFunction["COUNT"] = 2] = "COUNT";
    //FIRST, // not in SqLite: Returns the first value
    //LAST, // not in SqLite: Returns the last value
    SqlFunction[SqlFunction["MAX"] = 3] = "MAX";
    SqlFunction[SqlFunction["MIN"] = 4] = "MIN";
    SqlFunction[SqlFunction["SUM"] = 5] = "SUM";
    //SQL Scalar functions
    //SQL scalar functions return a single value, based on the input value.
    // Useful scalar functions:
    SqlFunction[SqlFunction["UCASE"] = 6] = "UCASE";
    SqlFunction[SqlFunction["LCASE"] = 7] = "LCASE";
    SqlFunction[SqlFunction["MID"] = 8] = "MID";
    SqlFunction[SqlFunction["LEN"] = 9] = "LEN";
    SqlFunction[SqlFunction["ROUND"] = 10] = "ROUND";
    SqlFunction[SqlFunction["NOW"] = 11] = "NOW";
    SqlFunction[SqlFunction["FORMAT"] = 12] = "FORMAT";
    // Added
    SqlFunction[SqlFunction["REPLACE"] = 13] = "REPLACE";
    SqlFunction[SqlFunction["TRIM"] = 14] = "TRIM"; // Trims a string
})(exports.SqlFunction || (exports.SqlFunction = {}));
var SqlFunction = exports.SqlFunction;
var strFld;
function abs(appliable) {
    if (typeof appliable === "number") {
        return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.ABS, true, [appliable]));
    }
    else {
        return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
    }
}
exports.abs = abs;
function avg(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
}
exports.avg = avg;
function getSqlFunctionCall(sqlFunction, valueIsPrimitive, parameters) {
    if (valueIsPrimitive === void 0) { valueIsPrimitive = false; }
    return {
        functionType: sqlFunction,
        parameters: parameters,
        valueIsPrimitive: valueIsPrimitive
    };
}
function count(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
}
exports.count = count;
function max(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
}
exports.max = max;
function min(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.MIN));
}
exports.min = min;
function sum(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.SUM));
}
exports.sum = sum;
function ucase(appliable) {
    if (typeof appliable === "string") {
        return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE, true, [appliable]));
    }
    else {
        return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
    }
}
exports.ucase = ucase;
function lcase(appliable) {
    if (typeof appliable === "string") {
        return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE, true, [appliable]));
    }
    else {
        return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
    }
}
exports.lcase = lcase;
function mid(appliable, start, length) {
    if (typeof appliable === "string") {
        return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.MID, true, [appliable, start, length]));
    }
    else {
        return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.MID, false, [start, length]));
    }
}
exports.mid = mid;
function len(appliable) {
    if (typeof appliable === "string") {
        return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.LEN, true, [appliable]));
    }
    else {
        return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
    }
}
exports.len = len;
function round(appliable, digits) {
    if (digits === void 0) { digits = 0; }
    if (typeof appliable === "number") {
        return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, true, [appliable, digits]));
    }
    else {
        return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, false, [digits]));
    }
}
exports.round = round;
function now() {
    return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.NOW));
}
exports.now = now;
function format(format) {
    var appliables = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        appliables[_i - 1] = arguments[_i];
    }
    return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, true, appliables));
}
exports.format = format;
function replace(appliable, toReplace, replaceWith) {
    if (typeof appliable === "string") {
        return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, true, [appliable, toReplace, replaceWith]));
    }
    else {
        return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, false, [toReplace, replaceWith]));
    }
}
exports.replace = replace;
function trim(appliable) {
    if (typeof appliable === "string") {
        return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM, true, [appliable]));
    }
    else {
        return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
    }
}
exports.trim = trim;
var FunctionAppliable = (function () {
    function FunctionAppliable() {
        this.appliedFunctions = [];
    }
    FunctionAppliable.prototype.applySqlFunction = function (sqlFunctionCall) {
        var functionApplicable = new FunctionAppliable();
        functionApplicable.appliedFunctions = functionApplicable.appliedFunctions.concat(this.appliedFunctions);
        functionApplicable.appliedFunctions.push(sqlFunctionCall);
        return functionApplicable;
    };
    FunctionAppliable.prototype.toJSON = function () {
        return {
            appliedFunctions: this.appliedFunctions,
            type: Appliable_1.JSONClauseObjectType.FUNCTION
        };
    };
    return FunctionAppliable;
}());
exports.FunctionAppliable = FunctionAppliable;
//# sourceMappingURL=Functions.js.map