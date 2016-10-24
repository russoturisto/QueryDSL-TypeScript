"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Entity_1 = require("./Entity");
var Aliases_1 = require("./Aliases");
(function (RelationType) {
    RelationType[RelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    RelationType[RelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.RelationType || (exports.RelationType = {}));
var RelationType = exports.RelationType;
(function (JoinType) {
    JoinType[JoinType["FULL_JOIN"] = 0] = "FULL_JOIN";
    JoinType[JoinType["INNER_JOIN"] = 1] = "INNER_JOIN";
    JoinType[JoinType["LEFT_JOIN"] = 2] = "LEFT_JOIN";
    JoinType[JoinType["RIGHT_JOIN"] = 3] = "RIGHT_JOIN";
})(exports.JoinType || (exports.JoinType = {}));
var JoinType = exports.JoinType;
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
    QRelation.getPositionAlias = function (rootEntityName, fromClausePosition) {
        return rootEntityName + "_" + fromClausePosition.join('_');
    };
    QRelation.getAlias = function (jsonRelation) {
        return this.getPositionAlias(jsonRelation.rootEntityName, jsonRelation.fromClausePosition);
    };
    QRelation.getParentAlias = function (jsonRelation) {
        var position = jsonRelation.fromClausePosition;
        if (position.length === 0) {
            throw "Cannot find alias of a parent entity for the root entity";
        }
        return this.getPositionAlias(jsonRelation.rootEntityName, position.slice(0, position.length - 1));
    };
    QRelation.prototype.innerJoin = function () {
        return this.getNewQEntity(JoinType.INNER_JOIN);
    };
    QRelation.prototype.leftJoin = function () {
        return this.getNewQEntity(JoinType.LEFT_JOIN);
    };
    QRelation.prototype.getNewQEntity = function (joinType) {
        return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, QRelation.getNextChildJoinPosition(this.q), this.propertyName, joinType);
    };
    QRelation.createRelatedQEntity = function (joinRelation, entityMapByName) {
        var genericIQEntity = entityMapByName[joinRelation.entityName];
        return new genericIQEntity.__qEntityConstructor__(genericIQEntity.__qEntityConstructor__, genericIQEntity.__entityConstructor__, joinRelation.entityName, joinRelation.fromClausePosition, joinRelation.relationPropertyName, joinRelation.joinType);
    };
    QRelation.getNextChildJoinPosition = function (joinParent) {
        var nextChildJoinPosition = joinParent.fromClausePosition.slice();
        nextChildJoinPosition.push(++joinParent.currentChildIndex);
        return nextChildJoinPosition;
    };
    return QRelation;
}());
exports.QRelation = QRelation;
var QOneToManyRelation = (function (_super) {
    __extends(QOneToManyRelation, _super);
    function QOneToManyRelation(q, qConstructor, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) {
        _super.call(this, q, qConstructor, RelationType.ONE_TO_MANY, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor);
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.propertyName = propertyName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
    }
    return QOneToManyRelation;
}(QRelation));
exports.QOneToManyRelation = QOneToManyRelation;
var JoinFields = (function () {
    function JoinFields(joinTo) {
        this.joinTo = joinTo;
    }
    JoinFields.prototype.on = function (joinOperation) {
        var entity;
        var joinChild;
        if (this.joinTo instanceof Entity_1.QEntity) {
            entity = this.joinTo;
            joinChild = this.joinTo;
        }
        else {
            var joinChild_1 = this.joinTo;
            entity = joinChild_1.select;
        }
        joinChild.joinWhereClause = joinOperation(entity);
        return entity;
    };
    return JoinFields;
}());
exports.JoinFields = JoinFields;
function join(left, right, joinType) {
    var nextChildPosition;
    var joinParent = left;
    // If left is a Raw Mapped Query
    if (!(left instanceof Entity_1.QEntity)) {
        // If this is a root entity
        if (!joinParent.currentChildIndex) {
            joinParent.currentChildIndex = 0;
            joinParent.fromClausePosition = [];
            joinParent.rootEntityPrefix = Aliases_1.getNextRootEntityName();
        }
    }
    nextChildPosition = QRelation.getNextChildJoinPosition(joinParent);
    var joinChild = right;
    joinParent.currentChildIndex = 0;
    joinChild.fromClausePosition = nextChildPosition;
    joinChild.joinType = joinType;
    joinChild.rootEntityPrefix = joinParent.rootEntityPrefix;
    return new JoinFields(right);
}
function fullJoin(left, right) {
    return join(left, right, JoinType.FULL_JOIN);
}
exports.fullJoin = fullJoin;
function innerJoin(left, right) {
    return join(left, right, JoinType.INNER_JOIN);
}
exports.innerJoin = innerJoin;
function leftJoin(left, right) {
    return join(left, right, JoinType.LEFT_JOIN);
}
exports.leftJoin = leftJoin;
function rightJoin(left, right) {
    return join(left, right, JoinType.RIGHT_JOIN);
}
exports.rightJoin = rightJoin;
//# sourceMappingURL=Relation.js.map