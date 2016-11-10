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
var OperableField_1 = require("./OperableField");
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
function getSqlFunctionCall(sqlFunction, parameters) {
    if (parameters) {
        parameters = parameters.map(function (parameter) {
            switch (typeof parameter) {
                case "boolean":
                    return bool(parameter);
                case "number":
                    return num(parameter);
                case "string":
                    return str(parameter);
                case "undefined":
                    throw "'undefined' cannot be used as a function parameter";
            }
            if (parameter instanceof Date) {
                return date(parameter);
            }
            return parameter;
        });
    }
    return {
        functionType: sqlFunction,
        parameters: parameters
    };
}
function abs(numeric) {
    if (numeric instanceof NumberField_1.QNumberField) {
        return numeric.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
    }
    else {
        return new NumberField_1.QNumberFunction(numeric).applySqlFunction(getSqlFunctionCall(SqlFunction.ABS));
    }
}
exports.abs = abs;
function avg(numeric) {
    if (numeric instanceof NumberField_1.QNumberField) {
        return numeric.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
    }
    else {
        return new NumberField_1.QNumberFunction(numeric).applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
    }
}
exports.avg = avg;
function getFunctionObject(value) {
    switch (typeof value) {
        case 'boolean':
            return new BooleanField_1.QBooleanFunction(value);
        case 'number':
            return new NumberField_1.QNumberFunction(value);
        case 'string':
            return new StringField_1.QStringFunction(value);
    }
    if (value instanceof Date) {
        return new DateField_1.QDateFunction(value);
    }
    var selectClause = value.select;
    if (selectClause instanceof QDistinctFunction) {
        selectClause = selectClause.getSelectClause();
    }
    if (selectClause instanceof BooleanField_1.QBooleanField) {
        return new BooleanField_1.QBooleanFunction(value);
    }
    else if (selectClause instanceof DateField_1.QDateField) {
        return new DateField_1.QDateFunction(value);
    }
    else if (selectClause instanceof NumberField_1.QNumberField) {
        return new NumberField_1.QNumberFunction(value);
    }
    else if (selectClause instanceof StringField_1.QStringField) {
        return new StringField_1.QStringFunction(value);
    }
    throw "Function rValue must be a primitive, Date, Field or Field query";
}
exports.getFunctionObject = getFunctionObject;
function count(value) {
    if (value instanceof OperableField_1.QOperableField) {
        return value.applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
    }
    else {
        return getFunctionObject(value).applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
    }
}
exports.count = count;
function max(value) {
    if (value instanceof OperableField_1.QOperableField) {
        return value.applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
    }
    else {
        return getFunctionObject(value).applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
    }
}
exports.max = max;
function min(value) {
    if (value instanceof OperableField_1.QOperableField) {
        return value.applySqlFunction(getSqlFunctionCall(SqlFunction.MIN));
    }
    else {
        return getFunctionObject(value).applySqlFunction(getSqlFunctionCall(SqlFunction.MIN));
    }
}
exports.min = min;
function sum(numeric) {
    if (numeric instanceof NumberField_1.QNumberField) {
        return numeric.applySqlFunction(getSqlFunctionCall(SqlFunction.SUM));
    }
    else {
        return new NumberField_1.QNumberFunction(numeric).applySqlFunction(getSqlFunctionCall(SqlFunction.SUM));
    }
}
exports.sum = sum;
function ucase(stringValue) {
    if (stringValue instanceof StringField_1.QStringField) {
        return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
    }
    else {
        return new StringField_1.QStringFunction(stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
    }
}
exports.ucase = ucase;
function lcase(stringValue) {
    if (stringValue instanceof StringField_1.QStringField) {
        return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
    }
    else {
        return new StringField_1.QStringFunction(stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
    }
}
exports.lcase = lcase;
function mid(stringValue, start, length) {
    if (stringValue instanceof StringField_1.QStringField) {
        return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.MID, [start, length]));
    }
    else {
        return new StringField_1.QStringFunction(stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.MID, [start, length]));
    }
}
exports.mid = mid;
function len(stringValue) {
    if (stringValue instanceof StringField_1.QStringField) {
        return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
    }
    else {
        return new StringField_1.QStringFunction(stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
    }
}
exports.len = len;
function round(numeric, digits) {
    if (digits === void 0) { digits = 0; }
    if (numeric instanceof NumberField_1.QNumberField) {
        return numeric.applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, [digits]));
    }
    else {
        return new NumberField_1.QNumberFunction(numeric).applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, [digits]));
    }
}
exports.round = round;
function now() {
    return new DateField_1.QDateFunction(null).applySqlFunction(getSqlFunctionCall(SqlFunction.NOW));
}
exports.now = now;
function format(format) {
    var formatParameters = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        formatParameters[_i - 1] = arguments[_i];
    }
    if (format instanceof StringField_1.QStringField) {
        return format.applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, formatParameters));
    }
    else {
        return new StringField_1.QStringFunction(format).applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, formatParameters));
    }
}
exports.format = format;
function replace(stringValue, toReplace, replaceWith) {
    if (stringValue instanceof StringField_1.QStringField) {
        return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, [toReplace, replaceWith]));
    }
    else {
        return new StringField_1.QStringFunction(stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, [toReplace, replaceWith]));
    }
}
exports.replace = replace;
function trim(stringField) {
    if (stringField instanceof StringField_1.QStringField) {
        return stringField.applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
    }
    else {
        return new StringField_1.QStringFunction(stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
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
    var distinctFunction = new QDistinctFunction(selectClause);
    distinctFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.DISTINCT));
    return distinctFunction;
}
exports.distinct = distinct;
var QDistinctFunction = (function (_super) {
    __extends(QDistinctFunction, _super);
    function QDistinctFunction(selectClause) {
        _super.call(this);
        this.selectClause = selectClause;
        this.__appliedFunctions__ = [];
    }
    QDistinctFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        this.__appliedFunctions__.push(sqlFunctionCall);
        return this;
    };
    QDistinctFunction.prototype.getSelectClause = function () {
        return this.selectClause;
    };
    QDistinctFunction.prototype.toJSON = function (parsedSelectClause) {
        if (this.__appliedFunctions__.length != 1) {
            throw "Not expecting and parent or child functions on \"distinct\"";
        }
        if (!this.selectClause) {
            throw "SELECT clause is missing in \"distinct\" function.";
        }
        var appliedFunctions = [
            getSqlFunctionCall(SqlFunction.DISTINCT)
        ];
        return {
            __appliedFunctions__: appliedFunctions,
            dataType: null,
            fieldAlias: null,
            objectType: Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION,
            value: parsedSelectClause
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
    var existsFunction = new QExistsFunction(phRawQuery);
    return existsFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.EXISTS));
}
exports.exists = exists;
var QExistsFunction = (function (_super) {
    __extends(QExistsFunction, _super);
    function QExistsFunction(subQuery) {
        _super.call(this);
        this.subQuery = subQuery;
        this.__appliedFunctions__ = [];
        this.operator = "$exists";
        this.category = Operation_1.OperationCategory.FUNCTION;
    }
    QExistsFunction.prototype.applySqlFunction = function (sqlFunctionCall) {
        this.__appliedFunctions__.push(sqlFunctionCall);
        return this;
    };
    QExistsFunction.prototype.getQuery = function () {
        return this.subQuery;
    };
    QExistsFunction.prototype.toJSON = function (parsedQuery) {
        if (this.__appliedFunctions__.length != 1) {
            throw "Not expecting and parent or child functions on \"exists\"";
        }
        if (!this.subQuery) {
            throw "Subquery is not defined in \"exists\" function.";
        }
        var appliedFunctions = [
            getSqlFunctionCall(SqlFunction.EXISTS)
        ];
        return {
            category: this.category,
            object: {
                __appliedFunctions__: appliedFunctions,
                dataType: null,
                objectType: Appliable_1.JSONClauseObjectType.EXISTS_FUNCTION,
                value: parsedQuery
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