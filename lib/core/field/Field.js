"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHQuery_1 = require("../../query/PHQuery");
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
    function QField(q, qConstructor, entityName, fieldName, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.nativeFieldName = nativeFieldName;
        q.addEntityField(this);
    }
    QField.prototype.toJSON = function () {
        var jsonOperation = {};
        jsonOperation[PHQuery_1.PH_JOIN_TO_ENTITY] = this.entityName;
        jsonOperation[PHQuery_1.PH_JOIN_TO_FIELD] = this.fieldName;
        return jsonOperation;
    };
    QField.prototype.getQ = function () {
        return this.q;
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
var QBooleanField = (function (_super) {
    __extends(QBooleanField, _super);
    function QBooleanField(q, qConstructor, entityName, fieldName, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        _super.call(this, q, qConstructor, entityName, fieldName, nativeFieldName);
        this.fieldType = FieldType.BOOLEAN;
        q.addEntityField(this);
    }
    return QBooleanField;
}(QField));
exports.QBooleanField = QBooleanField;
var QDateField = (function (_super) {
    __extends(QDateField, _super);
    function QDateField(q, qConstructor, entityName, fieldName, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        _super.call(this, q, qConstructor, entityName, fieldName, nativeFieldName);
        this.fieldType = FieldType.DATE;
        q.addEntityField(this);
    }
    return QDateField;
}(QField));
exports.QDateField = QDateField;
var QNumberField = (function (_super) {
    __extends(QNumberField, _super);
    function QNumberField(q, qConstructor, entityName, fieldName, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        _super.call(this, q, qConstructor, entityName, fieldName, nativeFieldName);
        this.fieldType = FieldType.NUMBER;
        q.addEntityField(this);
    }
    return QNumberField;
}(QField));
exports.QNumberField = QNumberField;
var QStringField = (function (_super) {
    __extends(QStringField, _super);
    function QStringField(q, qConstructor, entityName, fieldName, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        _super.call(this, q, qConstructor, entityName, fieldName, nativeFieldName);
        this.fieldType = FieldType.STRING;
        q.addEntityField(this);
    }
    return QStringField;
}(QField));
exports.QStringField = QStringField;
//# sourceMappingURL=Field.js.map