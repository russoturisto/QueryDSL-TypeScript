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
var Aliases_1 = require("./Aliases");
var STRING_MANY_TO_ONE_ALIASES = new Aliases_1.ColumnAliases('smp_');
var STRING_ENTITY_MANY_TO_ONE_ALIASES = new Aliases_1.ColumnAliases('sme_');
var QStringManyToOneRelation = (function (_super) {
    __extends(QStringManyToOneRelation, _super);
    function QStringManyToOneRelation(q, qConstructor, entityName, fieldName, relationEntityConstructor, relationQEntityConstructor, alias) {
        if (alias === void 0) { alias = STRING_ENTITY_MANY_TO_ONE_ALIASES.getNextAlias(); }
        _super.call(this, q, qConstructor, entityName, fieldName, alias);
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.relationType = Relation_1.EntityRelationType.MANY_TO_ONE;
    }
    QStringManyToOneRelation.prototype.getInstance = function () {
        return new QStringManyToOneRelation(this.q, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor, STRING_MANY_TO_ONE_ALIASES.getNextAlias());
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
    QStringManyToOneRelation.prototype.applySqlFunction = function (sqlFunctionCall) {
        var appliedMtoRelation = new QStringManyToOneRelation(this.q, this.qConstructor, this.entityName, this.fieldName, this.relationEntityConstructor, this.relationQEntityConstructor);
        appliedMtoRelation.__appliedFunctions__ = appliedMtoRelation.__appliedFunctions__.concat(this.__appliedFunctions__);
        appliedMtoRelation.__appliedFunctions__.push(sqlFunctionCall);
        return appliedMtoRelation;
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