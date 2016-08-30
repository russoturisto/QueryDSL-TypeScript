"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("../field/Field");
var Operation_1 = require("./Operation");
var StringOperation = (function (_super) {
    __extends(StringOperation, _super);
    function StringOperation() {
        _super.call(this, Field_1.FieldType.NUMBER);
    }
    StringOperation.prototype.like = function (like) {
        return {
            $like: like
        };
    };
    return StringOperation;
}(Operation_1.Operation));
exports.StringOperation = StringOperation;
//# sourceMappingURL=StringOperation.js.map