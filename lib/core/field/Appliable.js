"use strict";
/**
 * Created by Papa on 10/19/2016.
 */
(function (JSONClauseObjectType) {
    JSONClauseObjectType[JSONClauseObjectType["FIELD"] = 0] = "FIELD";
    JSONClauseObjectType[JSONClauseObjectType["FIELD_FUNCTION"] = 1] = "FIELD_FUNCTION";
    JSONClauseObjectType[JSONClauseObjectType["FIELD_QUERY"] = 2] = "FIELD_QUERY";
    JSONClauseObjectType[JSONClauseObjectType["DISTINCT_FUNCTION"] = 3] = "DISTINCT_FUNCTION";
    JSONClauseObjectType[JSONClauseObjectType["EXISTS_FUNCTION"] = 4] = "EXISTS_FUNCTION";
    JSONClauseObjectType[JSONClauseObjectType["MANY_TO_ONE_RELATION"] = 5] = "MANY_TO_ONE_RELATION";
})(exports.JSONClauseObjectType || (exports.JSONClauseObjectType = {}));
var JSONClauseObjectType = exports.JSONClauseObjectType;
(function (SQLDataType) {
    SQLDataType[SQLDataType["BOOLEAN"] = 0] = "BOOLEAN";
    SQLDataType[SQLDataType["DATE"] = 1] = "DATE";
    SQLDataType[SQLDataType["NUMBER"] = 2] = "NUMBER";
    SQLDataType[SQLDataType["STRING"] = 3] = "STRING";
})(exports.SQLDataType || (exports.SQLDataType = {}));
var SQLDataType = exports.SQLDataType;
//# sourceMappingURL=Appliable.js.map