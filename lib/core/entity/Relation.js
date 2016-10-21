"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHSQLQuery_1 = require("../../query/sql/PHSQLQuery");
var FieldInOrderBy_1 = require("../field/FieldInOrderBy");
var Appliable_1 = require("../field/Appliable");
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
    QRelation.prototype.fullJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.FULL_JOIN);
    };
    QRelation.prototype.innerJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.INNER_JOIN);
    };
    QRelation.prototype.leftJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.LEFT_JOIN);
    };
    QRelation.prototype.rightJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.RIGHT_JOIN);
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
        _super.call(this, q, qConstructor, RelationType.MANY_TO_ONE, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor);
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.propertyName = propertyName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.appliedFunctions = [];
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
    QManyToOneRelation.prototype.applySqlFunction = function (sqlFunctionCall) {
        var appliedMtoRelation = new QManyToOneRelation(this.q, this.qConstructor, this.entityName, this.propertyName, this.relationEntityConstructor, this.relationQEntityConstructor);
        appliedMtoRelation.appliedFunctions = appliedMtoRelation.appliedFunctions.concat(this.appliedFunctions);
        appliedMtoRelation.appliedFunctions.push(sqlFunctionCall);
        return appliedMtoRelation;
    };
    QManyToOneRelation.prototype.toJSON = function () {
        return {
            appliedFunctions: this.appliedFunctions,
            propertyName: this.fieldName,
            tableAlias: QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition),
            type: Appliable_1.JSONClauseObjectType.MANY_TO_ONE_RELATION
        };
    };
    return QManyToOneRelation;
}(QRelation));
exports.QManyToOneRelation = QManyToOneRelation;
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
//# sourceMappingURL=Relation.js.map