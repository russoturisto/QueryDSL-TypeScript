"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Papa on 4/21/2016.
 */
var ComparisonOperation_1 = require("../operation/ComparisonOperation");
var StringField = (function (_super) {
    __extends(StringField, _super);
    function StringField(fieldName, qEntity) {
        _super.call(this, qEntity, fieldName, null);
    }
    StringField.prototype.setComparisonOperation = function (value) {
    };
    StringField.prototype.objectEquals = function (otherOp, checkValue) {
        throw "Not implemented";
    };
    return StringField;
}(ComparisonOperation_1.ComparisonOperation));
exports.StringField = StringField;
//# sourceMappingURL=StringField.js.map