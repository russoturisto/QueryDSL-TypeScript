"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHSQLQuery_1 = require("../../query/sql/PHSQLQuery");
var FieldInOrderBy_1 = require("../field/FieldInOrderBy");
(function (RelationType) {
    RelationType[RelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    RelationType[RelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.RelationType || (exports.RelationType = {}));
var RelationType = exports.RelationType;
exports.IS_ENTITY_PROPERTY_NAME = '.isEntity';
var QRelation = (function () {
    function QRelation(q, qConstructor, relationType, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) {
        this.q = q;
        this.qConstructor = qConstructor;
        this.relationType = relationType;
        this.entityName = entityName;
        this.propertyName = propertyName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.q.addEntityRelation(propertyName, this);
    }
    /*
     static isStub(object:any) {
     return !object[IS_ENTITY_PROPERTY_NAME];
     }

     static markAsEntity(object:any) {
     object[IS_ENTITY_PROPERTY_NAME] = true;
     }
     */
    QRelation.getPositionAlias = function (fromClausePosition) {
        return "rt_" + fromClausePosition.join('_');
    };
    QRelation.getAlias = function (jsonRelation) {
        return this.getPositionAlias(jsonRelation.fromClausePosition);
    };
    QRelation.getParentAlias = function (jsonRelation) {
        var position = jsonRelation.fromClausePosition;
        if (position.length === 0) {
            throw "Cannot find alias of a parent entity for the root entity";
        }
        return this.getPositionAlias(position.slice(0, position.length - 1));
    };
    QRelation.prototype.innerJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.INNER_JOIN);
    };
    QRelation.prototype.leftJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.LEFT_JOIN);
    };
    QRelation.prototype.getNewQEntity = function (joinType) {
        return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, this.q.getNextChildJoinPosition(), this.propertyName, joinType);
    };
    QRelation.createRelatedQEntity = function (joinRelation, entityMapByName) {
        var genericIQEntity = entityMapByName[joinRelation.entityName];
        return new genericIQEntity.__qEntityConstructor__(genericIQEntity.__qEntityConstructor__, genericIQEntity.__entityConstructor__, joinRelation.entityName, joinRelation.fromClausePosition, joinRelation.relationPropertyName, joinRelation.joinType);
    };
    return QRelation;
}());
exports.QRelation = QRelation;
var QManyToOneRelation = (function (_super) {
    __extends(QManyToOneRelation, _super);
    function QManyToOneRelation(q, qConstructor, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) {
        var _this = _super.call(this, q, qConstructor, RelationType.MANY_TO_ONE, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) || this;
        _this.q = q;
        _this.qConstructor = qConstructor;
        _this.entityName = entityName;
        _this.propertyName = propertyName;
        _this.relationEntityConstructor = relationEntityConstructor;
        _this.relationQEntityConstructor = relationQEntityConstructor;
        return _this;
    }
    Object.defineProperty(QManyToOneRelation.prototype, "fieldName", {
        get: function () {
            return this.propertyName;
        },
        enumerable: true,
        configurable: true
    });
    QManyToOneRelation.prototype.asc = function () {
        return new FieldInOrderBy_1.FieldInOrderBy(this, FieldInOrderBy_1.SortOrder.ASCENDING).toJSON();
    };
    QManyToOneRelation.prototype.desc = function () {
        return new FieldInOrderBy_1.FieldInOrderBy(this, FieldInOrderBy_1.SortOrder.DESCENDING).toJSON();
    };
    return QManyToOneRelation;
}(QRelation));
exports.QManyToOneRelation = QManyToOneRelation;
var QOneToManyRelation = (function (_super) {
    __extends(QOneToManyRelation, _super);
    function QOneToManyRelation(q, qConstructor, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) {
        var _this = _super.call(this, q, qConstructor, RelationType.ONE_TO_MANY, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) || this;
        _this.q = q;
        _this.qConstructor = qConstructor;
        _this.entityName = entityName;
        _this.propertyName = propertyName;
        _this.relationEntityConstructor = relationEntityConstructor;
        _this.relationQEntityConstructor = relationQEntityConstructor;
        return _this;
    }
    return QOneToManyRelation;
}(QRelation));
exports.QOneToManyRelation = QOneToManyRelation;
//# sourceMappingURL=Relation.js.map