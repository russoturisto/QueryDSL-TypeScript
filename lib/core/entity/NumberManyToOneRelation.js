"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NumberField_1 = require("../field/NumberField");
var Relation_1 = require("./Relation");
var Appliable_1 = require("../field/Appliable");
var Joins_1 = require("./Joins");
var QNumberManyToOneRelation = (function (_super) {
    __extends(QNumberManyToOneRelation, _super);
    function QNumberManyToOneRelation(q, qConstructor, entityName, fieldName, relationEntityConstructor, relationQEntityConstructor) {
        _super.call(this, q, qConstructor, entityName, fieldName);
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.relationType = Relation_1.EntityRelationType.MANY_TO_ONE;
    }
    QNumberManyToOneRelation.prototype.innerJoin = function () {
        return this.getNewQEntity(Joins_1.JoinType.INNER_JOIN);
    };
    QNumberManyToOneRelation.prototype.leftJoin = function () {
        return this.getNewQEntity(Joins_1.JoinType.LEFT_JOIN);
    };
    QNumberManyToOneRelation.prototype.getNewQEntity = function (joinType) {
        return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, this.q.rootEntityPrefix, Relation_1.QRelation.getNextChildJoinPosition(this.q), this.fieldName, joinType);
    };
    QNumberManyToOneRelation.prototype.applySqlFunction = function (sqlFunctionCall) {
        var appliedMtoRelation = new QNumberManyToOneRelation(this.q, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor);
        appliedMtoRelation.__appliedFunctions__ = appliedMtoRelation.__appliedFunctions__.concat(this.__appliedFunctions__);
        appliedMtoRelation.__appliedFunctions__.push(sqlFunctionCall);
        return appliedMtoRelation;
    };
    QNumberManyToOneRelation.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.type = Appliable_1.JSONClauseObjectType.MANY_TO_ONE_RELATION;
        return json;
    };
    return QNumberManyToOneRelation;
}(NumberField_1.QNumberField));
exports.QNumberManyToOneRelation = QNumberManyToOneRelation;
//# sourceMappingURL=NumberManyToOneRelation.js.map