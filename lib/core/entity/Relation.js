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
var ColumnAliases = (function () {
    function ColumnAliases() {
        this.numFields = 0;
        this.lastAlias = [-1, -1];
        this.columnAliasMap = {};
    }
    ColumnAliases.prototype.addAlias = function (tableAlias, propertyName) {
        var aliasKey = this.getAliasKey(tableAlias, propertyName);
        var columnAlias = this.getNextAlias();
        this.columnAliasMap[aliasKey] = columnAlias;
        this.numFields++;
        return columnAlias;
    };
    ColumnAliases.prototype.getAlias = function (tableAlias, propertyName) {
        var aliasKey = this.getAliasKey(tableAlias, propertyName);
        return this.columnAliasMap[aliasKey];
    };
    ColumnAliases.prototype.getAliasKey = function (tableAlias, propertyName) {
        var aliasKey = tableAlias + "." + propertyName;
        return aliasKey;
    };
    ColumnAliases.prototype.getNextAlias = function () {
        var currentAlias = this.lastAlias;
        for (var i = 1; i >= 0; i--) {
            var currentIndex = currentAlias[i];
            currentIndex = (currentIndex + 1) % 26;
            currentAlias[i] = currentIndex;
            if (currentIndex !== 0) {
                break;
            }
        }
        var aliasString = '';
        for (var i = 0; i < 2; i++) {
            aliasString += ALIASES[currentAlias[i]];
        }
        return aliasString;
    };
    return ColumnAliases;
}());
exports.ColumnAliases = ColumnAliases;
var JoinTreeNode = (function () {
    function JoinTreeNode(jsonRelation, childNodes) {
        this.jsonRelation = jsonRelation;
        this.childNodes = childNodes;
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
            joinType: PHSQLQuery_1.JoinType.LEFT_JOIN,
            relationPropertyName: relationName
        }, []);
        this.addChildNode(childTreeNode);
        return childTreeNode;
    };
    return JoinTreeNode;
}());
exports.JoinTreeNode = JoinTreeNode;
(function (RelationType) {
    RelationType[RelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    RelationType[RelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.RelationType || (exports.RelationType = {}));
var RelationType = exports.RelationType;
exports.INNER_JOIN = 'INNER_JOIN';
exports.LEFT_JOIN = 'LEFT_JOIN';
exports.IS_ENTITY_PROPERTY_NAME = '.isEntity';
var QRelation = (function () {
    function QRelation(q, qConstructor, relationType, entityName, propertyName, relationEntityConstructor, relationQEntityConstructor) {
        this.q = q;
        this.qConstructor = qConstructor;
        this.relationType = relationType;
        this.entityName = entityName;
        this.propertyName = propertyName;
        this.relationEntityConstructor = relationEntityConstructor;
        this.relationQEntityConstructor = relationQEntityConstructor;
        this.q.addEntityRelation(propertyName, this);
    }
    QRelation.isStub = function (object) {
        return !object[exports.IS_ENTITY_PROPERTY_NAME];
    };
    QRelation.markAsEntity = function (object) {
        object[exports.IS_ENTITY_PROPERTY_NAME] = true;
    };
    QRelation.getPositionAlias = function (fromClausePosition) {
        return "rt_" + fromClausePosition.join('_');
    };
    QRelation.getAlias = function (jsonRelation) {
        return this.getPositionAlias(jsonRelation.fromClausePosition);
    };
    QRelation.getParentAlias = function (jsonRelation) {
        var position = jsonRelation.fromClausePosition;
        if (position.length === 0) {
            throw "Cannot find alias of a parent entity for the root entity";
        }
        return this.getPositionAlias(position.slice(0, position.length - 1));
    };
    QRelation.prototype.innerJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.INNER_JOIN);
    };
    QRelation.prototype.leftJoin = function () {
        return this.getNewQEntity(PHSQLQuery_1.JoinType.LEFT_JOIN);
    };
    QRelation.prototype.getNewQEntity = function (joinType) {
        return new this.relationQEntityConstructor(this.relationEntityConstructor, this.entityName, this.q.getNextChildJoinPosition(), this.propertyName, joinType);
    };
    return QRelation;
}());
exports.QRelation = QRelation;
//# sourceMappingURL=Relation.js.map