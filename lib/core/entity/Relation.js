"use strict";
var QRelation = (function () {
    function QRelation(targetEntityConstructor, foreignKeyProperty) {
        this.targetEntityConstructor = targetEntityConstructor;
        this.foreignKeyProperty = foreignKeyProperty;
    }
    return QRelation;
}());
exports.QRelation = QRelation;
//# sourceMappingURL=Relation.js.map