"use strict";
/**
 * Created by Papa on 8/23/2016.
 */
(function (RelationType) {
    RelationType[RelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    RelationType[RelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.RelationType || (exports.RelationType = {}));
var RelationType = exports.RelationType;
var QueryTreeNode = (function () {
    function QueryTreeNode(qEntity, relationToParent, relationToParentType) {
        this.qEntity = qEntity;
        this.relationToParent = relationToParent;
        this.relationToParentType = relationToParentType;
        this.children = [];
    }
    return QueryTreeNode;
}());
exports.QueryTreeNode = QueryTreeNode;
//# sourceMappingURL=QueryTreeNode.js.map