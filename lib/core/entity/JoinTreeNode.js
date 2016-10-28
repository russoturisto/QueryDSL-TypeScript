"use strict";
var Joins_1 = require("./Joins");
/**
 * Created by Papa on 10/18/2016.
 */
var JoinTreeNode = (function () {
    function JoinTreeNode(jsonRelation, childNodes, parentNode) {
        this.jsonRelation = jsonRelation;
        this.childNodes = childNodes;
        this.parentNode = parentNode;
    }
    JoinTreeNode.prototype.addChildNode = function (joinTreeNode) {
        var childPositionArray = joinTreeNode.jsonRelation.fromClausePosition;
        var childPosition = childPositionArray[childPositionArray.length - 1];
        this.childNodes[childPosition] = joinTreeNode;
    };
    JoinTreeNode.prototype.getChildNode = function (entityName, relationName) {
        var matchingNodes = this.childNodes.filter(function (childNode) {
            return childNode.jsonRelation.relationPropertyName === relationName;
        });
        switch (matchingNodes.length) {
            case 0:
                break;
            case 1:
                return matchingNodes[0];
            default:
                throw "More than one child node matched relation property name '" + relationName + "'";
        }
        var childPosition = this.jsonRelation.fromClausePosition.slice();
        childPosition.push(this.childNodes.length);
        var childTreeNode = new JoinTreeNode({
            fromClausePosition: childPosition,
            entityName: entityName,
            joinType: Joins_1.JoinType.LEFT_JOIN,
            relationPropertyName: relationName
        }, [], this);
        this.addChildNode(childTreeNode);
        return childTreeNode;
    };
    return JoinTreeNode;
}());
exports.JoinTreeNode = JoinTreeNode;
//# sourceMappingURL=JoinTreeNode.js.map