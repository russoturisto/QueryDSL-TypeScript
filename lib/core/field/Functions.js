"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StringField_1 = require("./StringField");
var Appliable_1 = require("./Appliable");
var NumberField_1 = require("./NumberField");
var DateField_1 = require("./DateField");
var Operation_1 = require("../operation/Operation");
var BooleanField_1 = require("./BooleanField");
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
    SqlFunction[SqlFunction["TRIM"] = 14] = "TRIM";
    // Other
    SqlFunction[SqlFunction["DISTINCT"] = 15] = "DISTINCT";
    SqlFunction[SqlFunction["EXISTS"] = 16] = "EXISTS"; // used in where clauses
})(exports.SqlFunction || (exports.SqlFunction = {}));
var SqlFunction = exports.SqlFunction;
var strFld;
function abs(numberField) {
    if (typeof numberField === "number") {
        return new NumberField_1.QNumberFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.ABS, true, [numberField]));
    }
    else {
        numberField.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
        return numberField;
    }
}
exports.abs = abs;
function avg(numberField) {
    numberField.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
    return numberField;
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
function count(field) {
    field.applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
    return field;
}
exports.count = count;
function max(field) {
    field.applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
    return field;
}
exports.max = max;
function min(field) {
    field.applySqlFunction(getSqlFunctionCall(SqlFunction.MIN));
    return field;
}
exports.min = min;
function sum(numberField) {
    numberField.applySqlFunction(getSqlFunctionCall(SqlFunction.SUM));
    return numberField;
}
exports.sum = sum;
function ucase(stringField) {
    if (typeof stringField === "string") {
        return new StringField_1.QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE, true, [stringField]));
    }
    else {
        stringField.applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
        return stringField;
    }
}
exports.ucase = ucase;
function lcase(stringField) {
    if (typeof stringField === "string") {
        return new StringField_1.QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE, true, [stringField]));
    }
    else {
        stringField.applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
        return stringField;
    }
}
exports.lcase = lcase;
function mid(stringField, start, length) {
    if (typeof stringField === "string") {
        return new StringField_1.QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.MID, true, [stringField, start, length]));
    }
    else {
        stringField.applySqlFunction(getSqlFunctionCall(SqlFunction.MID, false, [start, length]));
        return stringField;
    }
}
exports.mid = mid;
function len(stringField) {
    if (typeof stringField === "string") {
        return new StringField_1.QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.LEN, true, [stringField]));
    }
    else {
        stringField.applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
        return stringField;
    }
}
exports.len = len;
function round(numberField, digits) {
    if (digits === void 0) { digits = 0; }
    if (typeof numberField === "number") {
        return new NumberField_1.QNumberFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, true, [numberField, digits]));
    }
    else {
        numberField.applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, false, [digits]));
        return numberField;
    }
}
exports.round = round;
function now() {
    return new DateField_1.QDateFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.NOW));
}
exports.now = now;
function format(format) {
    var formatParameters = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        formatParameters[_i - 1] = arguments[_i];
    }
    return new StringField_1.QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, true, formatParameters));
}
exports.format = format;
function replace(stringField, toReplace, replaceWith) {
    if (typeof stringField === "string") {
        return new StringField_1.QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, true, [stringField, toReplace, replaceWith]));
    }
    else {
        stringField.applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, false, [toReplace, replaceWith]));
        return stringField;
    }
}
exports.replace = replace;
function trim(stringField) {
    if (typeof stringField === "string") {
        return new StringField_1.QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM, true, [stringField]));
    }
    else {
        stringField.applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
        return stringField;
    }
}
exports.trim = trim;
var StandAloneFunction = (function () {
    function StandAloneFunction() {
    }
    return StandAloneFunction;
}());
exports.StandAloneFunction = StandAloneFunction;
function distinct(selectClause) {
    var distinctFunction = new QDistinctFunction();
    distinctFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.DISTINCT, false, [selectClause]));
    return distinctFunction;
}
exports.distinct = distinct;
var QDistinctFunction = (function (_super) {
    __extends(QDistinctFunction, _super);
    function QDistinctFunction() {
        _super.apply(this, arguments);
        this.__appliedFunctions__ = [];
    }
    QDistinctFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        this.__appliedFunctions__.push(sqlFunctionCall);
        return this;
    };
    QDistinctFunction.prototype.getSelectClause = function () {
        return this.__appliedFunctions__[0].parameters[0];
    };
    QDistinctFunction.prototype.toJSON = function (parsedSelectClause) {
        if (this.__appliedFunctions__.length != 1) {
            throw "Not expecting and parent or child functions on \"distinct\"";
        }
        if (this.__appliedFunctions__[0].parameters.length != 1) {
            throw "Expecting only 1 parameter on \"distinct\" function.";
        }
        var appliedFunctions = [
            getSqlFunctionCall(SqlFunction.DISTINCT, false, [parsedSelectClause])
        ];
        return {
            __appliedFunctions__: appliedFunctions,
            type: Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION
        };
    };
    QDistinctFunction.getSelect = function (distinct) {
        return distinct.__appliedFunctions__[0].parameters[0];
    };
    return QDistinctFunction;
}(StandAloneFunction));
exports.QDistinctFunction = QDistinctFunction;
function exists(phRawQuery) {
    var selectClause = phRawQuery.select;
    if (!selectClause) {
        throw "Sub-Query must have SELECT clause defined to be used in EXITS function";
    }
    var existsFunction = new QExistsFunction();
    existsFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.EXISTS, false, [phRawQuery]));
    return existsFunction;
}
exports.exists = exists;
var QExistsFunction = (function (_super) {
    __extends(QExistsFunction, _super);
    function QExistsFunction() {
        _super.apply(this, arguments);
        this.__appliedFunctions__ = [];
        this.operator = "$exists";
        this.category = Operation_1.OperationCategory.FUNCTION;
    }
    QExistsFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        this.__appliedFunctions__.push(sqlFunctionCall);
        return this;
    };
    QExistsFunction.prototype.getQuery = function () {
        return this.__appliedFunctions__[0].parameters[0];
    };
    QExistsFunction.prototype.toJSON = function (parsedQuery) {
        if (this.__appliedFunctions__.length != 1) {
            throw "Not expecting and parent or child functions on \"exists\"";
        }
        if (this.__appliedFunctions__[0].parameters.length != 1) {
            throw "Expecting only 1 parameter on \"exists\" function.";
        }
        var appliedFunctions = [
            getSqlFunctionCall(SqlFunction.EXISTS, false, [parsedQuery])
        ];
        return {
            category: this.category,
            object: {
                __appliedFunctions__: appliedFunctions,
                type: Appliable_1.JSONClauseObjectType.EXISTS_FUNCTION
            },
            operator: this.operator
        };
    };
    return QExistsFunction;
}(StandAloneFunction));
exports.QExistsFunction = QExistsFunction;
function bool(primitive) {
    return new BooleanField_1.QBooleanFunction(primitive);
}
exports.bool = bool;
function date(primitive) {
    return new DateField_1.QDateFunction(primitive);
}
exports.date = date;
function num(primitive) {
    return new NumberField_1.QNumberFunction(primitive);
}
exports.num = num;
function str(primitive) {
    return new StringField_1.QStringFunction(primitive);
}
exports.str = str;
//# sourceMappingURL=Functions.js.map