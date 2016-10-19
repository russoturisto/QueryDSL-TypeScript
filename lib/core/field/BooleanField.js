"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BooleanOperation_1 = require("../operation/BooleanOperation");
var Field_1 = require("./Field");
var QBooleanField = (function (_super) {
    __extends(QBooleanField, _super);
    function QBooleanField(q, qConstructor, entityName, fieldName) {
        _super.call(this, QBooleanField, q, qConstructor, entityName, fieldName, Field_1.FieldType.BOOLEAN, new BooleanOperation_1.BooleanOperation());
    }
    return QBooleanField;
}(Field_1.QField));
exports.QBooleanField = QBooleanField;
//# sourceMappingURL=BooleanField.js.map