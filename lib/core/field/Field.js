"use strict";
(function (FieldType) {
    FieldType[FieldType["BOOLEAN"] = 0] = "BOOLEAN";
    FieldType[FieldType["BOOLEAN_ARRAY"] = 1] = "BOOLEAN_ARRAY";
    FieldType[FieldType["DATE"] = 2] = "DATE";
    FieldType[FieldType["DATE_ARRAY"] = 3] = "DATE_ARRAY";
    FieldType[FieldType["NUMBER"] = 4] = "NUMBER";
    FieldType[FieldType["NUMBER_ARRAY"] = 5] = "NUMBER_ARRAY";
    FieldType[FieldType["STRING"] = 6] = "STRING";
    FieldType[FieldType["STRING_ARRAY"] = 7] = "STRING_ARRAY";
})(exports.FieldType || (exports.FieldType = {}));
var FieldType = exports.FieldType;
var QField = (function () {
    function QField(q, qConstructor, entityName, fieldName, fieldType, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.nativeFieldName = nativeFieldName;
        q.addEntityField(this);
    }
    QField.prototype.getFieldKey = function () {
        var key = this.entityName + "." + this.fieldName;
        return key;
    };
    QField.prototype.setOperation = function (jsonOperation) {
        var operation = {};
        operation[this.getFieldKey()] = jsonOperation;
        return operation;
    };
    QField.prototype.objectEquals = function (otherField, checkValue) {
        if (this.q.constructor !== otherField.q.constructor) {
            return false;
        }
        if (this.constructor !== otherField.constructor) {
            return false;
        }
        if (this.fieldType !== otherField.fieldType) {
            return false;
        }
        if (this.fieldName !== otherField.fieldName) {
            return false;
        }
        return true;
    };
    return QField;
}());
exports.QField = QField;
//# sourceMappingURL=Field.js.map