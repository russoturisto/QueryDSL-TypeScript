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
var AbstractFunctionAdaptor = (function () {
    function AbstractFunctionAdaptor(sqlValueProvider) {
        this.sqlValueProvider = sqlValueProvider;
    }
    AbstractFunctionAdaptor.prototype.getFunctionCalls = function (clause, innerValue, qEntityMapByAlias, forField) {
        var _this = this;
        clause.__appliedFunctions__.forEach(function (appliedFunction) {
            innerValue = _this.getFunctionCall(appliedFunction, innerValue, qEntityMapByAlias, forField);
        });
        return innerValue;
    };
    return AbstractFunctionAdaptor;
}());
exports.AbstractFunctionAdaptor = AbstractFunctionAdaptor;
//# sourceMappingURL=SQLAdaptor.js.map