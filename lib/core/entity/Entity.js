"use strict";
var QEntity = (function () {
    // rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);
    function QEntity(__entityConstructor__, __entityName__, alias, parentEntityAlias, relationPropertyName, joinType) {
        if (parentEntityAlias === void 0) { parentEntityAlias = null; }
        if (relationPropertyName === void 0) { relationPropertyName = null; }
        if (joinType === void 0) { joinType = null; }
        this.__entityConstructor__ = __entityConstructor__;
        this.__entityName__ = __entityName__;
        this.alias = alias;
        this.parentEntityAlias = parentEntityAlias;
        this.relationPropertyName = relationPropertyName;
        this.joinType = joinType;
        this.__entityFieldMap__ = {};
        this.__entityRelationMap__ = {};
        // TODO: convert class name to native name if it's not provided
    }
    QEntity.prototype.addEntityRelation = function (propertyName, relation) {
        this.__entityRelationMap__[propertyName] = relation;
    };
    QEntity.prototype.addEntityField = function (propertyName, field) {
        this.__entityFieldMap__[propertyName] = field;
    };
    QEntity.prototype.getRelationJson = function () {
        return {
            alias: this.alias,
            entityName: this.__entityName__,
            joinType: this.joinType,
            parentEntityAlias: this.parentEntityAlias,
            relationPropertyName: this.relationPropertyName
        };
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