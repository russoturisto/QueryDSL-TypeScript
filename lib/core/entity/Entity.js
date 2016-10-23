"use strict";
var Aliases_1 = require("./Aliases");
null | undefined;
var QEntity = (function () {
    function QEntity(__qEntityConstructor__, __entityConstructor__, __entityName__, rootEntityPrefix, fromClausePosition, relationPropertyName, joinType) {
        if (rootEntityPrefix === void 0) { rootEntityPrefix = Aliases_1.getNextRootEntityName(); }
        if (fromClausePosition === void 0) { fromClausePosition = []; }
        if (relationPropertyName === void 0) { relationPropertyName = null; }
        if (joinType === void 0) { joinType = null; }
        this.__qEntityConstructor__ = __qEntityConstructor__;
        this.__entityConstructor__ = __entityConstructor__;
        this.__entityName__ = __entityName__;
        this.rootEntityPrefix = rootEntityPrefix;
        this.fromClausePosition = fromClausePosition;
        this.relationPropertyName = relationPropertyName;
        this.joinType = joinType;
        this.__entityFieldMap__ = {};
        this.__entityRelationMap__ = {};
        // rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);
        this.currentChildIndex = 0;
    }
    QEntity.prototype.addEntityRelation = function (propertyName, relation) {
        this.__entityRelationMap__[propertyName] = relation;
    };
    QEntity.prototype.addEntityField = function (propertyName, field) {
        this.__entityFieldMap__[propertyName] = field;
    };
    QEntity.prototype.getRelationJson = function () {
        return {
            rootEntityName: this.rootEntityPrefix,
            fromClausePosition: this.fromClausePosition,
            entityName: this.__entityName__,
            joinType: this.joinType,
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
    QEntity.prototype.getNextChildJoinPosition = function () {
        var nextChildJoinPosition = this.fromClausePosition.slice();
        nextChildJoinPosition.push(++this.currentChildIndex);
        return nextChildJoinPosition;
    };
    return QEntity;
}());
exports.QEntity = QEntity;
//# sourceMappingURL=Entity.js.map