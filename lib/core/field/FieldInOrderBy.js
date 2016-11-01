/**
 * Created by Papa on 10/16/2016.
 */
"use strict";
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
            fieldAlias: this.field.alias,
            sortOrder: this.sortOrder
        };
    };
    return FieldInOrderBy;
}());
exports.FieldInOrderBy = FieldInOrderBy;
//# sourceMappingURL=FieldInOrderBy.js.map