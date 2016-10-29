"use strict";
var SQLStringQuery_1 = require("../SQLStringQuery");
var OracleAdaptor_1 = require("./OracleAdaptor");
var SqLiteAdaptor_1 = require("./SqLiteAdaptor");
function getSQLAdaptor(sqlValueProvider, sqlDialect) {
    switch (sqlDialect) {
        case SQLStringQuery_1.SQLDialect.ORACLE:
            return new OracleAdaptor_1.OracleAdaptor(sqlValueProvider);
        case SQLStringQuery_1.SQLDialect.SQLITE:
            return new SqLiteAdaptor_1.SqLiteAdaptor(sqlValueProvider);
        default:
            throw "Unknown SQL Dialect " + sqlDialect;
    }
}
exports.getSQLAdaptor = getSQLAdaptor;
//# sourceMappingURL=SQLAdaptor.js.map