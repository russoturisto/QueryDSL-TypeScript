"use strict";
var Relation_1 = require("./Relation");
/**
 * Created by Papa on 10/25/2016.
 */
var QOneToManyRelation = (function () {
    function QOneToManyRelation(q, qConstructor, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) {
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.propertyName = propertyName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.relationType = Relation_1.EntityRelationType.ONE_TO_MANY;
        this.q.addEntityRelation(propertyName, this);
    }
    QOneToManyRelation.prototype.innerJoin = function () {
        return this.getNewQEntity(JoinType.INNER_JOIN);
    };
    QOneToManyRelation.prototype.leftJoin = function () {
        return this.getNewQEntity(JoinType.LEFT_JOIN);
    };
    QOneToManyRelation.prototype.getNewQEntity = function (joinType) {
        return new this.relationQEntityConstructor(this.relationQEntityConstructor, this.relationEntityConstructor, this.entityName, Relation_1.QRelation.getNextChildJoinPosition(this.q), this.propertyName, joinType);
    };
    return QOneToManyRelation;
}());
exports.QOneToManyRelation = QOneToManyRelation;
//# sourceMappingURL=QOneToManyRelation.js.map