"use strict";
/**
 * Created by Papa on 4/26/2016.
 */
(function (QRelationType) {
    QRelationType[QRelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    QRelationType[QRelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.QRelationType || (exports.QRelationType = {}));
var QRelationType = exports.QRelationType;
var QRelation = (function () {
    function QRelation(relationPropertyName, relationType, targetEntityConstructor, targetQEntity) {
        this.relationPropertyName = relationPropertyName;
        this.relationType = relationType;
        this.targetEntityConstructor = targetEntityConstructor;
        this.targetQEntity = targetQEntity;
    }
    return QRelation;
}());
exports.QRelation = QRelation;
//# sourceMappingURL=Relation.js.map