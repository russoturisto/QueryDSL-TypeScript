"use strict";
var SQLStringQuery_1 = require("../SQLStringQuery");
var OracleAdaptor_1 = require("./OracleAdaptor");
var SqLiteAdaptor_1 = require("./SqLiteAdaptor");
function getSQLAdaptor(sqlDialect) {
    switch (sqlDialect) {
        case SQLStringQuery_1.SQLDialect.ORACLE:
            return new OracleAdaptor_1.OracleAdaptor();
        case SQLStringQuery_1.SQLDialect.SQLITE:
            return new SqLiteAdaptor_1.SqLiteAdaptor();
        default:
            throw "Unknown SQL Dialect " + sqlDialect;
    }
}
exports.getSQLAdaptor = getSQLAdaptor;
//# sourceMappingURL=SQLAdaptor.js.map