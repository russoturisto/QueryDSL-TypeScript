"use strict";
var PHSQLQuery_1 = require("../../query/sql/PHSQLQuery");
/**
 * Created by Papa on 4/26/2016.
 */
var ALIASES = ['a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'];
var currentAlias = [0, 0, 0, 0, 0];
function getNextAlias() {
    for (var i = 4; i >= 0; i--) {
        var currentIndex = currentAlias[i];
        currentIndex = (currentIndex + 1) % 26;
        currentAlias[i] = currentIndex;
        if (currentIndex !== 0) {
            break;
        }
    }
    var aliasString = '';
    for (var i = 0; i < 5; i++) {
        aliasString += ALIASES[currentAlias[i]];
    }
    return aliasString;
}
(function (RelationType) {
    RelationType[RelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    RelationType[RelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.RelationType || (exports.RelationType = {}));
var RelationType = exports.RelationType;
exports.INNER_JOIN = 'INNER_JOIN';
exports.LEFT_JOIN = 'LEFT_JOIN';
var QRelation = (function () {
    function QRelation(q, qConstructor, relationType, fieldClass, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) {
        this.q = q;
        this.qConstructor = qConstructor;
        this.relationType = relationType;
        this.fieldClass = fieldClass;
        this.entityName = entityName;
        this.propertyName = propertyName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.q.addEntityRelation(propertyName, this);
    }
    QRelation.prototype.innerJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.INNER_JOIN);
    };
    QRelation.prototype.leftJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.LEFT_JOIN);
    };
    QRelation.prototype.getNewQEntity = function (joinType) {
        return new this.relationQEntityConstructor(this.relationEntityConstructor, this.entityName, getNextAlias(), this.q.alias, this.propertyName, joinType);
    };
    return QRelation;
}());
exports.QRelation = QRelation;
//# sourceMappingURL=Relation.js.map