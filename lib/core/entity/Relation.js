"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueryFragment_1 = require("../QueryFragment");
/**
 * Created by Papa on 4/26/2016.
 */
(function (QRelationType) {
    QRelationType[QRelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    QRelationType[QRelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.QRelationType || (exports.QRelationType = {}));
var QRelationType = exports.QRelationType;
var QRelation = (function (_super) {
    __extends(QRelation, _super);
    function QRelation(owningQEntity, relationPropertyName, relationType, relationEntityConstructor, relationQEntityConstructor) {
        _super.call(this);
        this.owningQEntity = owningQEntity;
        this.relationPropertyName = relationPropertyName;
        this.relationType = relationType;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        owningQEntity.addEntityRelation(this);
    }
    return QRelation;
}(QueryFragment_1.QueryFragment));
exports.QRelation = QRelation;
//# sourceMappingURL=Relation.js.map