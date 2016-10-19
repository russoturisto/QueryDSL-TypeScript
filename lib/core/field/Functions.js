"use strict";
var Applicable_1 = require("./Applicable");
/**
 * Extrated from http://www.w3schools.com/sql/sql_functions.asp
 */
(function (SqlFunction) {
    // SQL Aggregate Functions
    // SQL aggregate functions return a single value, calculated from values in a column.
    // Useful Aggregate functions:
    SqlFunction[SqlFunction["AVG"] = 0] = "AVG";
    SqlFunction[SqlFunction["COUNT"] = 1] = "COUNT";
    SqlFunction[SqlFunction["FIRST"] = 2] = "FIRST";
    SqlFunction[SqlFunction["LAST"] = 3] = "LAST";
    SqlFunction[SqlFunction["MAX"] = 4] = "MAX";
    SqlFunction[SqlFunction["MIN"] = 5] = "MIN";
    SqlFunction[SqlFunction["SUM"] = 6] = "SUM";
    //SQL Scalar functions
    //SQL scalar functions return a single value, based on the input value.
    // Useful scalar functions:
    SqlFunction[SqlFunction["UCASE"] = 7] = "UCASE";
    SqlFunction[SqlFunction["LCASE"] = 8] = "LCASE";
    SqlFunction[SqlFunction["MID"] = 9] = "MID";
    SqlFunction[SqlFunction["LEN"] = 10] = "LEN";
    SqlFunction[SqlFunction["ROUND"] = 11] = "ROUND";
    SqlFunction[SqlFunction["NOW"] = 12] = "NOW";
    SqlFunction[SqlFunction["FORMAT"] = 13] = "FORMAT";
    // Added
    SqlFunction[SqlFunction["TRIM"] = 14] = "TRIM"; // Trims a string
})(exports.SqlFunction || (exports.SqlFunction = {}));
var SqlFunction = exports.SqlFunction;
var strFld;
function avg(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
}
exports.avg = avg;
function getSqlFunctionCall(sqlFunction, parameters) {
    return {
        functionType: sqlFunction,
        parameters: parameters
    };
}
function count(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
}
exports.count = count;
function first(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.FIRST));
}
exports.first = first;
function last(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LAST));
}
exports.last = last;
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
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
}
exports.ucase = ucase;
function lcase(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
}
exports.lcase = lcase;
function mid(appliable, start, length) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.MID, [start, length]));
}
exports.mid = mid;
function len(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
}
exports.len = len;
function round(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND));
}
exports.round = round;
function now() {
    return new FunctionApplicable().applySqlFunction(getSqlFunctionCall(SqlFunction.NOW));
}
exports.now = now;
function format(appliable, format) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, [format]));
}
exports.format = format;
function trim(appliable) {
    return appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
}
exports.trim = trim;
var FunctionApplicable = (function () {
    function FunctionApplicable() {
        this.appliedFunctions = [];
    }
    FunctionApplicable.prototype.applySqlFunction = function (sqlFunctionCall) {
        var functionApplicable = new FunctionApplicable();
        functionApplicable.appliedFunctions = functionApplicable.appliedFunctions.concat(this.appliedFunctions);
        functionApplicable.appliedFunctions.push(sqlFunctionCall);
        return functionApplicable;
    };
    FunctionApplicable.prototype.toJSON = function () {
        return {
            appliedFunctions: this.appliedFunctions,
            type: Applicable_1.JSONClauseObjectType.FUNCTION
        };
    };
    return FunctionApplicable;
}());
exports.FunctionApplicable = FunctionApplicable;
//# sourceMappingURL=Functions.js.map