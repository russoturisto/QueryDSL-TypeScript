"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Operation_1 = require("./Operation");
var StringOperation = (function (_super) {
    __extends(StringOperation, _super);
    function StringOperation() {
        _super.call(this, Operation_1.OperationCategory.STRING);
    }
    StringOperation.prototype.like = function (lValue, rValue) {
        return {
            category: this.category,
            lValue: lValue,
            operator: "$like",
            rValue: rValue
        };
    };
    return StringOperation;
}(Operation_1.ValueOperation));
exports.StringOperation = StringOperation;
//# sourceMappingURL=StringOperation.js.map