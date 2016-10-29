"use strict";
var Relation_1 = require("./Relation");
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
    JoinTreeNode.prototype.getEntityRelationChildNode = function (entityName, relationName) {
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
        // No node matched, this must be reference to a sub-entity in select clause (in a Entity query)
        var childPosition = this.jsonRelation.fromClausePosition.slice();
        childPosition.push(this.childNodes.length);
        var jsonEntityRelation = {
            currentChildIndex: 0,
            fromClausePosition: childPosition,
            entityName: entityName,
            joinType: Joins_1.JoinType.LEFT_JOIN,
            relationType: Relation_1.JSONRelationType.ENTITY_SCHEMA_RELATION,
            rootEntityPrefix: this.parentNode.jsonRelation.rootEntityPrefix,
            relationPropertyName: relationName
        };
        var childTreeNode = new JoinTreeNode(jsonEntityRelation, [], this);
        this.addChildNode(childTreeNode);
        return childTreeNode;
    };
    return JoinTreeNode;
}());
exports.JoinTreeNode = JoinTreeNode;
//# sourceMappingURL=JoinTreeNode.js.map