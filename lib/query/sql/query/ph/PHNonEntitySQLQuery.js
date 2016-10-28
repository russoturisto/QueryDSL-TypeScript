"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Functions_1 = require("../../../../core/field/Functions");
var PHAbstractSQLQuery_1 = require("./PHAbstractSQLQuery");
exports.NON_ENTITY_SELECT_ERROR_MESSAGE = "Unsupported entry in Non-Entity SELECT clause, must be a(n): Entity Field | ManyToOne Relation | primitive wrapped by \"bool\",\"date\",\"num\",\"str\" | query wrapped by \"field\"";
var PHDistinguishableSQLQuery = (function (_super) {
    __extends(PHDistinguishableSQLQuery, _super);
    function PHDistinguishableSQLQuery() {
        _super.apply(this, arguments);
        this.isHierarchicalEntityQuery = false;
    }
    PHDistinguishableSQLQuery.prototype.selectClauseToJSON = function (rawSelect) {
        if (rawSelect instanceof Functions_1.QDistinctFunction) {
            if (this.isHierarchicalEntityQuery) {
                throw "Distinct cannot be used in SELECT of Hierarchical/Bridged Entity queries.";
            }
            var rawInnerSelect = rawSelect.getSelectClause();
            var innerSelect = this.nonDistinctSelectClauseToJSON(rawSelect);
            return rawSelect.toJSON(innerSelect);
        }
        else {
            return this.nonDistinctSelectClauseToJSON(rawSelect);
        }
    };
    return PHDistinguishableSQLQuery;
}(PHAbstractSQLQuery_1.PHAbstractSQLQuery));
exports.PHDistinguishableSQLQuery = PHDistinguishableSQLQuery;
//# sourceMappingURL=PHNonEntitySQLQuery.js.map