"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Functions_1 = require("../../../../core/field/Functions");
var PHAbstractSQLQuery_1 = require("./PHAbstractSQLQuery");
exports.SELECT_ERROR_MESSAGE = "Unsupported entity in SELECT clause, must be a(n): Entity Field | ManyToOne Relation | primitive wrapped by \"bool\",\"date\",\"num\",\"str\" | query wrapped by \"field\"";
var PHNonEntitySQLQuery = (function (_super) {
    __extends(PHNonEntitySQLQuery, _super);
    function PHNonEntitySQLQuery() {
        _super.apply(this, arguments);
    }
    PHNonEntitySQLQuery.prototype.selectClauseToJSON = function (rawSelect) {
        if (rawSelect instanceof Functions_1.QDistinctFunction) {
            var rawInnerSelect = rawSelect.getSelectClause();
            var innerSelect = this.nonDistinctSelectClauseToJSON(rawSelect);
            return rawSelect.toJSON(innerSelect);
        }
        else {
            return this.nonDistinctSelectClauseToJSON(rawSelect);
        }
    };
    return PHNonEntitySQLQuery;
}(PHAbstractSQLQuery_1.PHAbstractSQLQuery));
exports.PHNonEntitySQLQuery = PHNonEntitySQLQuery;
//# sourceMappingURL=PHNonEntitySQLQuery.js.map