"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("../field/Field");
var Operation_1 = require("./Operation");
var BooleanOperation = (function (_super) {
    __extends(BooleanOperation, _super);
    function BooleanOperation() {
        _super.call(this, Field_1.FieldType.BOOLEAN);
    }
    return BooleanOperation;
}(Operation_1.ValueOperation));
exports.BooleanOperation = BooleanOperation;
//# sourceMappingURL=BooleanOperation.js.map