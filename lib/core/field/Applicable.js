"use strict";
var Functions_1 = require("./Functions");
/**
 * Created by Papa on 10/19/2016.
 */
(function (JSONClauseObjectType) {
    JSONClauseObjectType[JSONClauseObjectType["FIELD"] = 0] = "FIELD";
    JSONClauseObjectType[JSONClauseObjectType["FUNCTION"] = 1] = "FUNCTION";
    JSONClauseObjectType[JSONClauseObjectType["MANY_TO_ONE_RELATION"] = 2] = "MANY_TO_ONE_RELATION";
})(exports.JSONClauseObjectType || (exports.JSONClauseObjectType = {}));
var JSONClauseObjectType = exports.JSONClauseObjectType;
function applyFunctionsReturnString(jsonClauseObject) {
    var columnName;
    switch (jsonClauseObject.type) {
        case JSONClauseObjectType.FIELD:
        case JSONClauseObjectType.FUNCTION:
        case JSONClauseObjectType.MANY_TO_ONE_RELATION:
    }
}
exports.applyFunctionsReturnString = applyFunctionsReturnString;
function getFunctionName(sqlFunction) {
    switch (sqlFunction) {
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
        case Functions_1.SqlFunction.AVG:
    }
}
//# sourceMappingURL=Applicable.js.map