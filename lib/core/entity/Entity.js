"use strict";
var QEntity = (function () {
    // rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);
    function QEntity(__entityConstructor__, __entityName__, __isTemplateEntity__, __nativeEntityName__) {
        if (__isTemplateEntity__ === void 0) { __isTemplateEntity__ = false; }
        this.__entityConstructor__ = __entityConstructor__;
        this.__entityName__ = __entityName__;
        this.__isTemplateEntity__ = __isTemplateEntity__;
        this.__nativeEntityName__ = __nativeEntityName__;
        this.__entityFields__ = [];
        this.__entityRelations__ = [];
        // TODO: convert class name to native name if it's not provided
    }
    QEntity.prototype.addEntityRelation = function (relation) {
        this.__entityRelations__.push(relation);
    };
    QEntity.prototype.addEntityField = function (field) {
        this.__entityFields__.push(field);
    };
    /*
     addOperation<O extends IOperation<IQ>>(
     op:O
     ):void {
     this.rootOperation.getChildOps().push(op);
     }
     */
    QEntity.prototype.getQ = function () {
        return this;
    };
    QEntity.prototype.fields = function (fields) {
        throw "Not implemented";
    };
    return QEntity;
}());
exports.QEntity = QEntity;
//# sourceMappingURL=Entity.js.map