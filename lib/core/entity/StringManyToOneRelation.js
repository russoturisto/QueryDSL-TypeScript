"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StringField_1 = require("../field/StringField");
var Relation_1 = require("./Relation");
var Appliable_1 = require("../field/Appliable");
var Joins_1 = require("./Joins");
var QStringManyToOneRelation = (function (_super) {
    __extends(QStringManyToOneRelation, _super);
    function QStringManyToOneRelation(q, qConstructor, entityName, fieldName, relationEntityConstructor, relationQEntityConstructor) {
        _super.call(this, q, qConstructor, entityName, fieldName);
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.relationType = Relation_1.EntityRelationType.MANY_TO_ONE;
    }
    QStringManyToOneRelation.prototype.getInstance = function (qEntity) {
        if (qEntity === void 0) { qEntity = this.q; }
        return this.copyFunctions(new QStringManyToOneRelation(qEntity, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor));
    };
    QStringManyToOneRelation.prototype.innerJoin = function () {
        return this.getNewQEntity(Joins_1.JoinType.INNER_JOIN);
    };
    QStringManyToOneRelation.prototype.leftJoin = function () {
        return this.getNewQEntity(Joins_1.JoinType.LEFT_JOIN);
    };
    QStringManyToOneRelation.prototype.getNewQEntity = function (joinType) {
        return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, this.q.rootEntityPrefix, Relation_1.QRelation.getNextChildJoinPosition(this.q), this.fieldName, joinType);
    };
    QStringManyToOneRelation.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.type = Appliable_1.JSONClauseObjectType.MANY_TO_ONE_RELATION;
        return json;
    };
    return QStringManyToOneRelation;
}(StringField_1.QStringField));
exports.QStringManyToOneRelation = QStringManyToOneRelation;
//# sourceMappingURL=StringManyToOneRelation.js.map