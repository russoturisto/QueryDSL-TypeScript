"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Papa on 4/21/2016.
 */
var Relation_1 = require("./Relation");
var Aliases_1 = require("./Aliases");
var Joins_1 = require("./Joins");
var PHMappedSQLQuery_1 = require("../../query/sql/query/ph/PHMappedSQLQuery");
var PHAbstractSQLQuery_1 = require("../../query/sql/query/ph/PHAbstractSQLQuery");
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
    QEntity.prototype.getInstance = function () {
        var instance = new this.__qEntityConstructor__(this.__qEntityConstructor__, this.__entityConstructor__, this.__entityName__, this.rootEntityPrefix, this.fromClausePosition, this.relationPropertyName, this.joinType);
        instance.currentChildIndex = this.currentChildIndex;
        instance.joinWhereClause = this.joinWhereClause;
        instance.__entityFieldMap__ = this.__entityFieldMap__;
        instance.__entityRelationMap__ = this.__entityRelationMap__;
        return instance;
    };
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
        jsonRelation.relationType = Relation_1.JSONRelationType.ENTITY_JOIN_ON;
        jsonRelation.joinWhereClause = PHAbstractSQLQuery_1.PHAbstractSQLQuery.whereClauseToJSON(this.joinWhereClause);
        return jsonRelation;
    };
    QEntity.prototype.getEntityRelationJson = function (jsonRelation) {
        jsonRelation.relationType = Relation_1.JSONRelationType.ENTITY_SCHEMA_RELATION;
        jsonRelation.relationPropertyName = this.relationPropertyName;
        return jsonRelation;
    };
    QEntity.prototype.getRootRelationJson = function (jsonRelation) {
        jsonRelation.relationType = (this instanceof QView) ? Relation_1.JSONRelationType.SUB_QUERY_ROOT : Relation_1.JSONRelationType.ENTITY_ROOT;
        return jsonRelation;
    };
    QEntity.prototype.getQ = function () {
        return this;
    };
    QEntity.prototype.fields = function (fields) {
        throw "Not implemented";
    };
    QEntity.prototype.join = function (right, joinType) {
        var joinChild = right.getInstance();
        joinChild.currentChildIndex = 0;
        var nextChildPosition = Relation_1.QRelation.getNextChildJoinPosition(this);
        joinChild.fromClausePosition = nextChildPosition;
        joinChild.joinType = joinType;
        joinChild.rootEntityPrefix = this.rootEntityPrefix;
        return new Joins_1.JoinFields(right);
    };
    QEntity.prototype.fullJoin = function (right) {
        return this.join(right, Joins_1.JoinType.FULL_JOIN);
    };
    QEntity.prototype.innerJoin = function (right) {
        return this.join(right, Joins_1.JoinType.INNER_JOIN);
    };
    QEntity.prototype.leftJoin = function (right) {
        return this.join(right, Joins_1.JoinType.LEFT_JOIN);
    };
    QEntity.prototype.rightJoin = function (right) {
        return this.join(right, Joins_1.JoinType.RIGHT_JOIN);
    };
    return QEntity;
}());
exports.QEntity = QEntity;
var QView = (function (_super) {
    __extends(QView, _super);
    function QView(rootEntityPrefix, fromClausePosition, subQuery) {
        if (rootEntityPrefix === void 0) { rootEntityPrefix = Aliases_1.getNextRootEntityName(); }
        if (fromClausePosition === void 0) { fromClausePosition = []; }
        _super.call(this, QView, null, null, rootEntityPrefix, fromClausePosition, null, null);
        this.rootEntityPrefix = rootEntityPrefix;
        this.fromClausePosition = fromClausePosition;
        this.subQuery = subQuery;
    }
    QView.prototype.getInstance = function () {
        var instance = _super.prototype.getInstance.call(this);
        instance.subQuery = this.subQuery;
        return instance;
    };
    QView.prototype.getJoinRelationJson = function (jsonRelation) {
        jsonRelation = _super.prototype.getJoinRelationJson.call(this, jsonRelation);
        jsonRelation.relationType = Relation_1.JSONRelationType.SUB_QUERY_JOIN_ON;
        jsonRelation.subQuery = new PHMappedSQLQuery_1.PHMappedSQLQuery(this.subQuery).toJSON();
        return jsonRelation;
    };
    QView.prototype.getRootRelationJson = function (jsonRelation) {
        jsonRelation = _super.prototype.getJoinRelationJson.call(this, jsonRelation);
        jsonRelation.relationType = Relation_1.JSONRelationType.SUB_QUERY_ROOT;
        jsonRelation.subQuery = new PHMappedSQLQuery_1.PHMappedSQLQuery(this.subQuery).toJSON();
        return jsonRelation;
    };
    return QView;
}(QEntity));
exports.QView = QView;
//# sourceMappingURL=Entity.js.map