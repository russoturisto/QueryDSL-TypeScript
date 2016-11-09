"use strict";
var FieldInOrderBy_1 = require("../../../../core/field/FieldInOrderBy");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Will order the results exactly as specified in the Order By clause
 */
var ExactOrderByParser = (function () {
    function ExactOrderByParser(validator) {
        this.validator = validator;
    }
    ExactOrderByParser.prototype.getOrderByFragment = function (rootSelectClauseFragment, orderBy) {
        var _this = this;
        return orderBy.map(function (orderByField) {
            _this.validator.validateAliasedFieldAccess(orderByField.fieldAlias);
            switch (orderByField.sortOrder) {
                case FieldInOrderBy_1.SortOrder.ASCENDING:
                    return orderByField.fieldAlias + " ASC";
                case FieldInOrderBy_1.SortOrder.DESCENDING:
                    return orderByField.fieldAlias + " DESC";
            }
        }).join(', ');
    };
    return ExactOrderByParser;
}());
exports.ExactOrderByParser = ExactOrderByParser;
//# sourceMappingURL=ExactOrderByParser.js.map