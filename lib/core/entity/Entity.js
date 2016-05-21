"use strict";
/**
 * Created by Papa on 4/21/2016.
 */
var LogicalOperation_1 = require("../operation/LogicalOperation");
var OperationType_1 = require("../operation/OperationType");
var QEntity = (function () {
    function QEntity(entityConstructor, nativeName) {
        this.entityConstructor = entityConstructor;
        this.nativeName = nativeName;
        this.entityFields = [];
        this.entityRelations = [];
        this.rootOperation = new LogicalOperation_1.LogicalOperation(this, OperationType_1.OperationType.AND, []);
        // TODO: convert class name to native name if it's not provided
    }
    QEntity.prototype.addEntityRelation = function (relation) {
        this.entityRelations.push(relation);
    };
    QEntity.prototype.addEntityField = function (field) {
        this.entityFields.push(field);
    };
    QEntity.prototype.addOperation = function (op) {
        this.rootOperation.getChildOps().push(op);
    };
    QEntity.prototype.getQ = function () {
        return this;
    };
    QEntity.prototype.fields = function (fields) {
        throw "Not implemented";
    };
    QEntity.prototype.joinOn = function (comparisonOp) {
        if (comparisonOp.getQ() !== this) {
            throw "Must join on own field";
        }
        throw "Not Implemented";
    };
    QEntity.prototype.and = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.rootOperation.and.apply(this.rootOperation, ops);
    };
    QEntity.prototype.or = function () {
        var ops = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ops[_i - 0] = arguments[_i];
        }
        return this.rootOperation.or.apply(this.rootOperation, ops);
    };
    QEntity.prototype.not = function (op) {
        return this.rootOperation.not(op);
    };
    QEntity.prototype.objectEquals = function (otherOp, checkValues) {
        if (this.constructor !== otherOp.constructor) {
            return false;
        }
        var otherQ = otherOp;
        return this.rootOperation.objectEquals(otherQ.rootOperation, checkValues);
    };
    return QEntity;
}());
exports.QEntity = QEntity;
//# sourceMappingURL=Entity.js.map