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
(function (RelationType) {
    RelationType[RelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    RelationType[RelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.RelationType || (exports.RelationType = {}));
var RelationType = exports.RelationType;
var QRelation = (function (_super) {
    __extends(QRelation, _super);
    function QRelation(q, qConstructor, relationType, relationPropertyName, relationEntityConstructor, relationQEntityConstructor) {
        _super.call(this);
        this.q = q;
        this.qConstructor = qConstructor;
        this.relationType = relationType;
        this.relationPropertyName = relationPropertyName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.q.addEntityRelation(this);
    }
    return QRelation;
}(QueryFragment_1.QueryFragment));
exports.QRelation = QRelation;
//# sourceMappingURL=Relation.js.map