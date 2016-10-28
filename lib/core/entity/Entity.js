"use strict";
/**
 * Created by Papa on 4/21/2016.
 */
var Relation_1 = require("./Relation");
var Aliases_1 = require("./Aliases");
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
        var jsonRelation = {
            currentChildIndex: this.currentChildIndex,
            entityName: this.__entityName__,
            fromClausePosition: this.fromClausePosition,
            joinType: this.joinType,
            relationType: null,
            rootEntityPrefix: this.rootEntityPrefix
        };
        if (this.joinWhereClause) {
            this.getJoinRelationJson(jsonRelation);
        }
        else if (this.relationPropertyName) {
            this.getEntityRelationJson(jsonRelation);
        }
        else {
            this.getRootRelationJson(jsonRelation);
        }
        return jsonRelation;
    };
    QEntity.prototype.getJoinRelationJson = function (jsonRelation) {
        jsonRelation.relationType = Relation_1.JSONRelationType.ENTITY_JOIN;
        jsonRelation.joinWhereClause = this.joinWhereClause;
        return jsonRelation;
    };
    QEntity.prototype.getEntityRelationJson = function (jsonRelation) {
        jsonRelation.relationType = Relation_1.JSONRelationType.ENTITY_RELATION;
        jsonRelation.relationPropertyName = this.relationPropertyName;
        return jsonRelation;
    };
    QEntity.prototype.getRootRelationJson = function (jsonRelation) {
        jsonRelation.relationType = Relation_1.JSONRelationType.ENTITY_ROOT;
        return jsonRelation;
    };
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