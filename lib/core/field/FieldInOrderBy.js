/**
 * Created by Papa on 10/16/2016.
 */
"use strict";
var Relation_1 = require("../entity/Relation");
(function (SortOrder) {
    SortOrder[SortOrder["ASCENDING"] = 0] = "ASCENDING";
    SortOrder[SortOrder["DESCENDING"] = 1] = "DESCENDING";
})(exports.SortOrder || (exports.SortOrder = {}));
var SortOrder = exports.SortOrder;
var FieldInOrderBy = (function () {
    function FieldInOrderBy(field, sortOrder) {
        this.field = field;
        this.sortOrder = sortOrder;
    }
    FieldInOrderBy.prototype.toJSON = function () {
        return {
            alias: Relation_1.QRelation.getPositionAlias(this.field.q.fromClausePosition),
            propertyName: this.field.fieldName,
            sortOrder: this.sortOrder
        };
    };
    return FieldInOrderBy;
}());
exports.FieldInOrderBy = FieldInOrderBy;
//# sourceMappingURL=FieldInOrderBy.js.map