"use strict";
var Relation_1 = require("../entity/Relation");
var FieldInOrderBy_1 = require("./FieldInOrderBy");
var Appliable_1 = require("./Appliable");
(function (FieldType) {
    FieldType[FieldType["BOOLEAN"] = 0] = "BOOLEAN";
    FieldType[FieldType["DATE"] = 1] = "DATE";
    FieldType[FieldType["NUMBER"] = 2] = "NUMBER";
    FieldType[FieldType["STRING"] = 3] = "STRING";
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
        this.__appliedFunctions__ = [];
        if (q) {
            q.addEntityField(fieldName, this);
        }
    }
    QField.prototype.getFieldKey = function () {
        var key = Relation_1.QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition) + "." + this.fieldName;
        return key;
    };
    QField.prototype.setOperation = function (jsonOperation) {
        jsonOperation.lValue = this;
        return jsonOperation;
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
    QField.prototype.isNotNull = function () {
        return this.setOperation(this.operation.isNotNull());
    };
    QField.prototype.isNull = function () {
        return this.setOperation(this.operation.isNull());
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
        var appliedIField = new this.childConstructor(this.q, this.qConstructor, this.entityName, this.fieldName, this.fieldType);
        var appliedField = appliedIField;
        appliedField.__appliedFunctions__ = appliedField.__appliedFunctions__.concat(this.__appliedFunctions__);
        appliedField.__appliedFunctions__.push(sqlFunctionCall);
        return appliedIField;
    };
    QField.prototype.toJSON = function () {
        return {
            __appliedFunctions__: this.__appliedFunctions__,
            propertyName: this.fieldName,
            tableAlias: Relation_1.QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition),
            type: Appliable_1.JSONClauseObjectType.FIELD
        };
    };
    return QField;
}());
exports.QField = QField;
//# sourceMappingURL=Field.js.map