"use strict";
(function (RelationType) {
    RelationType[RelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    RelationType[RelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.RelationType || (exports.RelationType = {}));
var RelationType = exports.RelationType;
var QRelation = (function () {
    function QRelation(q, qConstructor, relationType, propertyName, relationPropertyName, relationEntityConstructor, relationQEntityConstructor) {
        this.q = q;
        this.qConstructor = qConstructor;
        this.relationType = relationType;
        this.propertyName = propertyName;
        this.relationPropertyName = relationPropertyName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.q.addEntityRelation(this);
    }
    return QRelation;
}());
exports.QRelation = QRelation;
//# sourceMappingURL=Relation.js.map