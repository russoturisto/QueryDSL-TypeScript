"use strict";
/**
 * Created by Papa on 8/27/2016.
 */
var SqLiteAdaptor = (function () {
    function SqLiteAdaptor() {
    }
    SqLiteAdaptor.prototype.dateToDbQuery = function (date) {
        var milliseconds = date.getTime();
        return "FROM_UNIXTIME(" + milliseconds + ")";
    };
    SqLiteAdaptor.prototype.getResultArray = function (rawResponse) {
        return rawResponse.res.rows;
    };
    SqLiteAdaptor.prototype.getResultCellValue = function (resultRow, columnName, index, dataType, defaultValue) {
        return resultRow[columnName];
    };
    return SqLiteAdaptor;
}());
exports.SqLiteAdaptor = SqLiteAdaptor;
//# sourceMappingURL=SqLiteAdaptor.js.map