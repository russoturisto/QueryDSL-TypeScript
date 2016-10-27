"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHNonEntitySQLQuery_1 = require("./PHNonEntitySQLQuery");
var Field_1 = require("../../../../core/field/Field");
var PHFlatSQLQuery = (function (_super) {
    __extends(PHFlatSQLQuery, _super);
    function PHFlatSQLQuery(phRawQuery) {
        _super.call(this);
        this.phRawQuery = phRawQuery;
    }
    PHFlatSQLQuery.prototype.nonDistinctSelectClauseToJSON = function (rawSelect) {
        if (!(rawSelect instanceof Array)) {
            throw "Flat Queries an array of fields in SELECT clause.";
        }
        return rawSelect.map(function (selectField) {
            if (!(selectField instanceof Field_1.QField)) {
                throw PHNonEntitySQLQuery_1.SELECT_ERROR_MESSAGE;
            }
            return selectField.toJSON();
        });
    };
    PHFlatSQLQuery.prototype.toJSON = function () {
        var select = this.selectClauseToJSON(this.phRawQuery.select);
        var jsonFieldQuery = {
            select: select
        };
        return this.getNonEntitySqlQuery(this.phRawQuery, jsonFieldQuery);
    };
    return PHFlatSQLQuery;
}(PHNonEntitySQLQuery_1.PHNonEntitySQLQuery));
exports.PHFlatSQLQuery = PHFlatSQLQuery;
//# sourceMappingURL=PHFlatSQLQuery.js.map