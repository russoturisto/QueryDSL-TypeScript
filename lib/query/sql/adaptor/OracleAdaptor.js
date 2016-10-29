"use strict";
/**
 * Created by Papa on 8/27/2016.
 */
var OracleAdaptor = (function () {
    function OracleAdaptor(sqlValueProvider) {
        this.sqlValueProvider = sqlValueProvider;
    }
    OracleAdaptor.prototype.dateToDbQuery = function (date, embedParameters) {
        if (embedParameters) {
            var dateString = date.toJSON();
            dateString = dateString.replace('Z', '');
            return "trunc(to_timestamp_tz('" + dateString + ".GMT','YYYY-MM-DD\"T\"HH24:MI:SS.FF3.TZR'))";
        }
        else {
            return date.getTime();
        }
    };
    OracleAdaptor.prototype.getResultArray = function (rawResponse) {
        throw "Not implemented - getResultArray";
    };
    OracleAdaptor.prototype.getResultCellValue = function (resultRow, columnName, index, dataType, defaultValue) {
        throw "Not implemented - getResultCellValue";
    };
    OracleAdaptor.prototype.getFunctionAdaptor = function () {
        throw "Not implemented getFunctionAdaptor";
    };
    return OracleAdaptor;
}());
exports.OracleAdaptor = OracleAdaptor;
//# sourceMappingURL=OracleAdaptor.js.map