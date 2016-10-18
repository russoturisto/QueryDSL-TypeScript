"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IOrderByParser_1 = require("./IOrderByParser");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Will order the results exactly as specified in the Order By clause
 */
var ExactOrderByParser = (function (_super) {
    __extends(ExactOrderByParser, _super);
    function ExactOrderByParser() {
        return _super.apply(this, arguments) || this;
    }
    ExactOrderByParser.prototype.getOrderByFragment = function (joinTree, qEntityMapByAlias) {
        if (!this.orderBy) {
            return '';
        }
        return this.getCommonOrderByFragment(qEntityMapByAlias, this.orderBy);
    };
    return ExactOrderByParser;
}(IOrderByParser_1.AbstractOrderByParser));
exports.ExactOrderByParser = ExactOrderByParser;
//# sourceMappingURL=ExactOrderByParser.js.map