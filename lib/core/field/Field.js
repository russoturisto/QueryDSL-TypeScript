"use strict";
var Relation_1 = require("../entity/Relation");
var FieldInOrderBy_1 = require("./FieldInOrderBy");
var Appliable_1 = require("./Appliable");
var PHFieldSQLQuery_1 = require("../../query/sql/query/ph/PHFieldSQLQuery");
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
        childConstructor, q, qConstructor, entityName, fieldName, fieldType) {
        this.childConstructor = childConstructor;
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.__appliedFunctions__ = [];
    }
    QField.prototype.getFieldKey = function () {
        var key = Relation_1.QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition) + "." + this.fieldName;
        return key;
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
    QField.prototype.asc = function () {
        return new FieldInOrderBy_1.FieldInOrderBy(this, FieldInOrderBy_1.SortOrder.ASCENDING);
    };
    QField.prototype.desc = function () {
        return new FieldInOrderBy_1.FieldInOrderBy(this, FieldInOrderBy_1.SortOrder.DESCENDING);
    };
    QField.prototype.getInstance = function () {
        return new this.childConstructor(this.q, this.qConstructor, this.entityName, this.fieldName, this.fieldType);
    };
    QField.prototype.applySqlFunction = function (sqlFunctionCall) {
        var appliedField = this.getInstance();
        appliedField.__appliedFunctions__ = appliedField.__appliedFunctions__.concat(this.__appliedFunctions__);
        appliedField.__appliedFunctions__.push(sqlFunctionCall);
        return appliedField;
    };
    QField.prototype.addSubQuery = function (subQuery) {
        var appliedField = this.getInstance();
        appliedField.__subQuery__ = subQuery;
        return appliedField;
    };
    QField.prototype.toJSON = function () {
        var jsonField = {
            __appliedFunctions__: this.__appliedFunctions__,
            propertyName: this.fieldName,
            tableAlias: Relation_1.QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition),
            type: Appliable_1.JSONClauseObjectType.FIELD
        };
        if (this.__subQuery__) {
            var subSelectQuery = new PHFieldSQLQuery_1.PHFieldSQLQuery(this.__subQuery__).toJSON();
            jsonField.subQuery = subSelectQuery;
        }
        return jsonField;
    };
    return QField;
}());
exports.QField = QField;
//# sourceMappingURL=Field.js.map