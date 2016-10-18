"use strict";
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
})(exports.SqlFunction || (exports.SqlFunction = {}));
var SqlFunction = exports.SqlFunction;
function avg(numberField) {
    return {
        functionType: SqlFunction.AVG,
        field: {
            propertyName: numberField.fieldName,
        }
    };
}
exports.avg = avg;
//# sourceMappingURL=Functions.js.map