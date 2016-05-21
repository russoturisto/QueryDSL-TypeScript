"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ComparisonOperation_1 = require("../operation/ComparisonOperation");
(function (FieldType) {
    FieldType[FieldType["BOOLEAN"] = 0] = "BOOLEAN";
    FieldType[FieldType["DATE"] = 1] = "DATE";
    FieldType[FieldType["ENTITY"] = 2] = "ENTITY";
    FieldType[FieldType["ENTITY_ARRAY"] = 3] = "ENTITY_ARRAY";
    FieldType[FieldType["NUMBER"] = 4] = "NUMBER";
    FieldType[FieldType["STRING"] = 5] = "STRING";
})(exports.FieldType || (exports.FieldType = {}));
var FieldType = exports.FieldType;
var QField = (function (_super) {
    __extends(QField, _super);
    function QField(owningEntity, fieldType, fieldName, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        _super.call(this, owningEntity, fieldType, fieldName, nativeFieldName);
        owningEntity.addEntityField(this);
    }
    return QField;
}(ComparisonOperation_1.ComparisonOperation));
exports.QField = QField;
//# sourceMappingURL=Field.js.map