"use strict";
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
var SqlLiteFunctionAdaptor = (function () {
    function SqlLiteFunctionAdaptor() {
    }
    SqlLiteFunctionAdaptor.prototype.getFunctionCall = function (jsonFunctionCall, value) {
        switch (sqlFunction) {
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
            case SqlFunction.AVG:
        }
    };
    return SqlLiteFunctionAdaptor;
}());
exports.SqlLiteFunctionAdaptor = SqlLiteFunctionAdaptor;
/*
 abs(X)

 The abs(X) function returns the absolute value of the numeric argument X. Abs(X) returns NULL if X is NULL. Abs(X) returns 0.0 if X is a string or blob that cannot be converted to a numeric value. If X is the integer -9223372036854775808 then abs(X) throws an integer overflow error since there is no equivalent positive 64-bit two complement value.

 changes()

 The changes() function returns the number of database rows that were changed or inserted or deleted by the most recently completed INSERT, DELETE, or UPDATE statement, exclusive of statements in lower-level triggers. The changes() SQL function is a wrapper around the sqlite3_changes() C/C++ function and hence follows the same rules for counting changes.

 char(X1,X2,...,XN)

 The char(X1,X2,...,XN) function returns a string composed of characters having the unicode code point values of integers X1 through XN, respectively.

 coalesce(X,Y,...)

 The coalesce() function returns a copy of its first non-NULL argument, or NULL if all arguments are NULL. Coalesce() must have at least 2 arguments.

 glob(X,Y)

 The glob(X,Y) function is equivalent to the expression "Y GLOB X". Note that the X and Y arguments are reversed in the glob() function relative to the infix GLOB operator. If the sqlite3_create_function() interface is used to override the glob(X,Y) function with an alternative implementation then the GLOB operator will invoke the alternative implementation.

 hex(X)

 The hex() function interprets its argument as a BLOB and returns a string which is the upper-case hexadecimal rendering of the content of that blob.

 ifnull(X,Y)

 The ifnull() function returns a copy of its first non-NULL argument, or NULL if both arguments are NULL. Ifnull() must have exactly 2 arguments. The ifnull() function is equivalent to coalesce() with two arguments.

 instr(X,Y)

 The instr(X,Y) function finds the first occurrence of string Y within string X and returns the number of prior characters plus 1, or 0 if Y is nowhere found within X. Or, if X and Y are both BLOBs, then instr(X,Y) returns one more than the number bytes prior to the first occurrence of Y, or 0 if Y does not occur anywhere within X. If both arguments X and Y to instr(X,Y) are non-NULL and are not BLOBs then both are interpreted as strings. If either X or Y are NULL in instr(X,Y) then the result is NULL.

 length(X)

 For a string value X, the length(X) function returns the number of characters (not bytes) in X prior to the first NUL character. Since SQLite strings do not normally contain NUL characters, the length(X) function will usually return the total number of characters in the string X. For a blob value X, length(X) returns the number of bytes in the blob. If X is NULL then length(X) is NULL. If X is numeric then length(X) returns the length of a string representation of X.

 lower(X)

 The lower(X) function returns a copy of string X with all ASCII characters converted to lower case. The default built-in lower() function works for ASCII characters only. To do case conversions on non-ASCII characters, load the ICU extension.

 ltrim(X)
 ltrim(X,Y)

 The ltrim(X,Y) function returns a string formed by removing any and all characters that appear in Y from the left side of X. If the Y argument is omitted, ltrim(X) removes spaces from the left side of X.

 max(X,Y,...)

 The multi-argument max() function returns the argument with the maximum value, or return NULL if any argument is NULL. The multi-argument max() function searches its arguments from left to right for an argument that defines a collating function and uses that collating function for all string comparisons. If none of the arguments to max() define a collating function, then the BINARY collating function is used. Note that max() is a simple function when it has 2 or more arguments but operates as an aggregate function if given only a single argument.

 min(X,Y,...)

 The multi-argument min() function returns the argument with the minimum value. The multi-argument min() function searches its arguments from left to right for an argument that defines a collating function and uses that collating function for all string comparisons. If none of the arguments to min() define a collating function, then the BINARY collating function is used. Note that min() is a simple function when it has 2 or more arguments but operates as an aggregate function if given only a single argument.


 replace(X,Y,Z)

 The replace(X,Y,Z) function returns a string formed by substituting string Z for every occurrence of string Y in string X. The BINARY collating sequence is used for comparisons. If Y is an empty string then return X unchanged. If Z is not initially a string, it is cast to a UTF-8 string prior to processing.

 round(X)
 round(X,Y)

 The round(X,Y) function returns a floating-point value X rounded to Y digits to the right of the decimal point. If the Y argument is omitted, it is assumed to be 0.

 rtrim(X)
 rtrim(X,Y)

 The rtrim(X,Y) function returns a string formed by removing any and all characters that appear in Y from the right side of X. If the Y argument is omitted, rtrim(X) removes spaces from the right side of X.


 substr(X,Y,Z)
 substr(X,Y)

 The substr(X,Y,Z) function returns a substring of input string X that begins with the Y-th character and which is Z characters long. If Z is omitted then substr(X,Y) returns all characters through the end of the string X beginning with the Y-th. The left-most character of X is number 1. If Y is negative then the first character of the substring is found by counting from the right rather than the left. If Z is negative then the abs(Z) characters preceding the Y-th character are returned. If X is a string then characters indices refer to actual UTF-8 characters. If X is a BLOB then the indices refer to bytes.

 trim(X)
 trim(X,Y)

 The trim(X,Y) function returns a string formed by removing any and all characters that appear in Y from both ends of X. If the Y argument is omitted, trim(X) removes spaces from both ends of X.


 upper(X)

 The upper(X) function returns a copy of input string X in which all lower-case ASCII characters are converted to their upper-case equivalent.

 */ 
//# sourceMappingURL=SqLiteAdaptor.js.map