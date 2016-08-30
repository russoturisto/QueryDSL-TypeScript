"use strict";
/**
 * Created by Papa on 8/27/2016.
 */
var MySqlAdaptor = (function () {
    function MySqlAdaptor() {
    }
    MySqlAdaptor.prototype.dateToDbQuery = function (date) {
        var milliseconds = date.getTime();
        return "FROM_UNIXTIME(" + milliseconds + ")";
    };
    MySqlAdaptor.prototype.getResultArray = function (rawResponse) {
        return rawResponse.res.rows;
    };
    MySqlAdaptor.prototype.getResultCellValue = function (resultRow, columnName, index, dataType, defaultValue) {
        return resultRow[columnName];
    };
    return MySqlAdaptor;
}());
exports.MySqlAdaptor = MySqlAdaptor;
//# sourceMappingURL=MySqlAdaptor.js.map