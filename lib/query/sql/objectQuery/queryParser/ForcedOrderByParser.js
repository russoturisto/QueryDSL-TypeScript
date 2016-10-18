"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FieldInOrderBy_1 = require("../../../../core/field/FieldInOrderBy");
var IOrderByParser_1 = require("./IOrderByParser");
var Relation_1 = require("../../../../core/entity/Relation");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Will hierarchically order the results of the query using breadth-first procesing. Within a given entity will take
 * into account the sort order specified in the Order By clause.
 */
var ForcedOrderByParser = (function (_super) {
    __extends(ForcedOrderByParser, _super);
    function ForcedOrderByParser() {
        return _super.apply(this, arguments) || this;
    }
    /**
     * Using the following algorithm
     * http://stackoverflow.com/questions/2549541/performing-breadth-first-search-recursively
     * :
     BinarySearchTree.prototype.breadthFirst = function() {
      var result = '',
      queue = [],
      current = this.root;

      if (!current) return null;
      queue.push(current);

      while (current = queue.shift()) {
            result += current.value + ' ';
            current.left && queue.push(current.left);
            current.right && queue.push(current.right);
        }
      return result;
     }
     *
     * @param joinTree
     * @param qEntityMapByAlias
     * @returns {string}
     */
    ForcedOrderByParser.prototype.getOrderByFragment = function (joinTree, qEntityMapByAlias) {
        var _this = this;
        var orderByFragments;
        var orderBy = [];
        if (this.orderBy) {
            orderBy = this.orderBy.slice();
        }
        var selectFragmentQueue = [];
        var currentSelectFragment = this.rootSelectClauseFragment;
        selectFragmentQueue.push(currentSelectFragment);
        var joinNodeQueue = [];
        var currentJoinNode = joinTree;
        joinNodeQueue.push(currentJoinNode);
        var _loop_1 = function () {
            var tableAlias = Relation_1.QRelation.getAlias(currentJoinNode.jsonRelation);
            var qEntity = qEntityMapByAlias[tableAlias];
            var entityMetadata = qEntity.__entityConstructor__;
            var entityName = qEntity.__entityName__;
            var entityPropertyTypeMap = this_1.entitiesPropertyTypeMap[entityName];
            var entityRelationMap = this_1.entitiesRelationPropertyMap[entityName];
            var currentEntityOrderBy = [];
            var parentNodeFound;
            orderBy = orderBy.filter(function (orderByField) {
                if (parentNodeFound) {
                    return true;
                }
                if (_this.isForParentNode(currentJoinNode, orderByField)) {
                    throw "Found out of order entry in Order By [" + orderByField.alias + "." + orderByField.propertyName + "].  Entries must be ordered hierarchically, in breadth-first order.";
                }
                if (orderByField.alias !== tableAlias) {
                    return true;
                }
                currentEntityOrderBy.push(orderByField);
                return false;
            });
            var propertyNamesToSortBy = [];
            var manyToOneRelationNamesToSortBy = [];
            var idColumnToSortBy = null;
            for (var propertyName in this_1.rootSelectClauseFragment) {
                if (entityPropertyTypeMap[propertyName]) {
                    propertyNamesToSortBy.push(propertyName);
                    // Tentatively add column to the list of columns to sort by
                    if (entityMetadata.idProperty === propertyName) {
                        idColumnToSortBy = propertyName;
                    }
                }
                else if (entityRelationMap[propertyName]) {
                    var subSelectClauseFragment = this_1.rootSelectClauseFragment[propertyName];
                    if (subSelectClauseFragment === null) {
                        // Tentatively add many-to-one key column to the list of columns to sort by
                        if (entityMetadata.manyToOneMap[propertyName]) {
                            manyToOneRelationNamesToSortBy.push(propertyName);
                        }
                    }
                    else if (subSelectClauseFragment) {
                        selectFragmentQueue.push(subSelectClauseFragment);
                        var childEntityName = entityRelationMap[propertyName].entityName;
                        var childJoinNode = currentJoinNode.getChildNode(childEntityName, propertyName);
                        joinNodeQueue.push(childJoinNode);
                    }
                }
            }
            var entityOrderByFragments = this_1.buildOrderByFragmentForEntity(tableAlias, qEntity, entityMetadata, propertyNamesToSortBy, manyToOneRelationNamesToSortBy, idColumnToSortBy, currentEntityOrderBy, qEntityMapByAlias);
            orderByFragments = orderByFragments.concat(entityOrderByFragments);
        };
        var this_1 = this;
        while ((currentSelectFragment = selectFragmentQueue.shift())
            && (currentJoinNode = joinNodeQueue.shift())) {
            _loop_1();
        }
        if (orderBy.length) {
            throw "Found entries in Order By for tables not found in select clause.  Entries must be ordered hierarchically, in breadth-first order.";
        }
        return orderByFragments.join(', ');
    };
    ForcedOrderByParser.prototype.buildOrderByFragmentForEntity = function (tableAlias, qEntity, entityMetadata, propertyNamesToSortBy, manyToOneRelationNamesToSortBy, idColumnToSortBy, currentEntityOrderBy, qEntityMapByAlias) {
        var finalOrderByColumnsFragments = [];
        var inputOrderByPropertyNameSet = {};
        currentEntityOrderBy.forEach(function (orderByField) {
            finalOrderByColumnsFragments.push(orderByField);
            inputOrderByPropertyNameSet[orderByField.propertyName] = true;
        });
        if (idColumnToSortBy) {
            if (!inputOrderByPropertyNameSet[idColumnToSortBy]) {
                finalOrderByColumnsFragments.push({
                    alias: null,
                    propertyName: idColumnToSortBy,
                    sortOrder: FieldInOrderBy_1.SortOrder.ASCENDING
                });
            }
        }
        else {
            propertyNamesToSortBy.forEach(function (propertyName) {
                if (!inputOrderByPropertyNameSet[propertyName]) {
                    finalOrderByColumnsFragments.push({
                        alias: null,
                        propertyName: propertyName,
                        sortOrder: FieldInOrderBy_1.SortOrder.ASCENDING
                    });
                }
            });
            manyToOneRelationNamesToSortBy.forEach(function (manyToOneRelationName) {
                if (!inputOrderByPropertyNameSet[manyToOneRelationName]) {
                    finalOrderByColumnsFragments.push({
                        alias: null,
                        isManyToOneReference: true,
                        propertyName: manyToOneRelationName,
                        sortOrder: FieldInOrderBy_1.SortOrder.ASCENDING
                    });
                }
            });
        }
        return this.getCommonOrderByFragment(qEntityMapByAlias, finalOrderByColumnsFragments);
    };
    ForcedOrderByParser.prototype.isForParentNode = function (joinTreeNode, orderByField) {
        do {
            joinTreeNode = joinTreeNode.parentNode;
            if (!joinTreeNode) {
                return false;
            }
            if (orderByField.alias === Relation_1.QRelation.getAlias(joinTreeNode.jsonRelation)) {
                return true;
            }
        } while (joinTreeNode.parentNode);
        return false;
    };
    return ForcedOrderByParser;
}(IOrderByParser_1.AbstractOrderByParser));
exports.ForcedOrderByParser = ForcedOrderByParser;
//# sourceMappingURL=ForcedOrderByParser.js.map