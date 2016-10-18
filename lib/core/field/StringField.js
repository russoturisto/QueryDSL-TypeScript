"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Field_1 = require("./Field");
var StringOperation_1 = require("../operation/StringOperation");
var QStringField = (function (_super) {
    __extends(QStringField, _super);
    function QStringField(q, qConstructor, entityName, fieldName) {
        return _super.call(this, q, qConstructor, entityName, fieldName, Field_1.FieldType.BOOLEAN, new StringOperation_1.StringOperation()) || this;
    }
    QStringField.prototype.like = function (like) {
        return this.setOperation(this.operation.like(like));
    };
    return QStringField;
}(Field_1.QField));
exports.QStringField = QStringField;
//# sourceMappingURL=StringField.js.map