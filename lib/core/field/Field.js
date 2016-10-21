"use strict";
var Relation_1 = require("../entity/Relation");
var FieldInOrderBy_1 = require("./FieldInOrderBy");
var Appliable_1 = require("./Appliable");
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
    function QField(
        // All child field constructors must have the following signature (4 parameters):
        childConstructor, q, qConstructor, entityName, fieldName, fieldType, operation) {
        this.childConstructor = childConstructor;
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.operation = operation;
        this.appliedFunctions = [];
        q.addEntityField(fieldName, this);
    }
    QField.prototype.getFieldKey = function () {
        var key = Relation_1.QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition) + "." + this.fieldName;
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
    QField.prototype.equals = function (value) {
        return this.setOperation(this.operation.equals(value));
    };
    QField.prototype.exists = function (exists) {
        return this.setOperation(this.operation.exists(exists));
    };
    QField.prototype.isNotNull = function () {
        return this.exists(false);
    };
    QField.prototype.isNull = function () {
        return this.exists(true);
    };
    QField.prototype.isIn = function (values) {
        return this.setOperation(this.operation.isIn(values));
    };
    QField.prototype.notEquals = function (value) {
        return this.setOperation(this.operation.notEquals(value));
    };
    QField.prototype.notIn = function (values) {
        return this.setOperation(this.operation.notIn(values));
    };
    QField.prototype.asc = function () {
        return new FieldInOrderBy_1.FieldInOrderBy(this, FieldInOrderBy_1.SortOrder.ASCENDING).toJSON();
    };
    QField.prototype.desc = function () {
        return new FieldInOrderBy_1.FieldInOrderBy(this, FieldInOrderBy_1.SortOrder.DESCENDING).toJSON();
    };
    QField.prototype.applySqlFunction = function (sqlFunctionCall) {
        var appliedField = new this.childConstructor(this.q, this.qConstructor, this.entityName, this.fieldName);
        appliedField.appliedFunctions = appliedField.appliedFunctions.concat(this.appliedFunctions);
        appliedField.appliedFunctions.push(sqlFunctionCall);
        return appliedField;
    };
    QField.prototype.toJSON = function () {
        return {
            appliedFunctions: this.appliedFunctions,
            propertyName: this.fieldName,
            tableAlias: Relation_1.QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition),
            type: Appliable_1.JSONClauseObjectType.FIELD
        };
    };
    return QField;
}());
exports.QField = QField;
//# sourceMappingURL=Field.js.map