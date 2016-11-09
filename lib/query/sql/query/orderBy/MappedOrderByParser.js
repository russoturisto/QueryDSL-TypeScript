/**
 * Created by Papa on 11/8/2016.
 */
"use strict";
var FieldInOrderBy_1 = require("../../../../core/field/FieldInOrderBy");
/**
 * Will hierarchically order the results of the query using breadth-first processing.
 * Within a given sub-select object will take into account the sort order specified in the Order By clause.
 */
var MappedOrderByParser = (function () {
    function MappedOrderByParser(validator) {
        this.validator = validator;
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
    MappedOrderByParser.prototype.getOrderByFragment = function (rootSelectClauseFragment, originalOrderBy) {
        var orderByFragments;
        var orderBy = [];
        if (originalOrderBy) {
            orderBy = originalOrderBy.slice();
        }
        var selectFragmentQueue = [];
        var currentSelectFragment = rootSelectClauseFragment;
        selectFragmentQueue.push(currentSelectFragment);
        var _loop_1 = function() {
            var currentSelectFragmentFieldSet = {};
            for (var propertyName in currentSelectFragment) {
                var field = currentSelectFragment[propertyName];
                if (!field.__appliedFunctions__) {
                    selectFragmentQueue.push(field);
                    continue;
                }
                currentSelectFragmentFieldSet[field.fieldAlias] = true;
            }
            var currentEntityOrderBy = [];
            orderBy = orderBy.filter(function (orderByField) {
                if (!currentSelectFragmentFieldSet[orderByField.fieldAlias]) {
                    return true;
                }
                delete currentSelectFragmentFieldSet[orderByField.fieldAlias];
                currentEntityOrderBy.push(orderByField);
                return false;
            });
            for (var alias in currentSelectFragmentFieldSet) {
                currentEntityOrderBy.push({
                    fieldAlias: alias,
                    sortOrder: FieldInOrderBy_1.SortOrder.ASCENDING
                });
            }
            var entityOrderByFragments = this_1.buildOrderByFragmentForEntity(currentEntityOrderBy);
            orderByFragments = orderByFragments.concat(entityOrderByFragments);
        };
        var this_1 = this;
        while (currentSelectFragment = selectFragmentQueue.shift()) {
            _loop_1();
        }
        if (orderBy.length) {
            throw "Found entries in Order By for tables not found in select clause.  Entries must be ordered hierarchically, in breadth-first order.";
        }
        return orderByFragments.join(', ');
    };
    MappedOrderByParser.prototype.buildOrderByFragmentForEntity = function (orderByFields) {
        var _this = this;
        return orderByFields.map(function (orderByField) {
            _this.validator.validateAliasedFieldAccess(orderByField.fieldAlias);
            switch (orderByField.sortOrder) {
                case FieldInOrderBy_1.SortOrder.ASCENDING:
                    return orderByField.fieldAlias + " ASC";
                case FieldInOrderBy_1.SortOrder.DESCENDING:
                    return orderByField.fieldAlias + " DESC";
            }
        });
    };
    return MappedOrderByParser;
}());
exports.MappedOrderByParser = MappedOrderByParser;
//# sourceMappingURL=MappedOrderByParser.js.map