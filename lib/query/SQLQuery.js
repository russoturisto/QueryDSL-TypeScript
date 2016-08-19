"use strict";
/**
 * Created by Papa on 8/12/2016.
 */
var SQLQuery = (function () {
    function SQLQuery(phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phJsonQuery = phJsonQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    SQLQuery.prototype.toSQL = function () {
        var phWhere = this.phJsonQuery.where;
        return null;
    };
    SQLQuery.prototype.toWhereFragment = function (operation) {
        var sqlLogicalOperator = this.getLogicalOperator(operation);
        if (sqlLogicalOperator) {
            this.toLogicalWhereFragment(operation);
        }
        return null;
    };
    SQLQuery.prototype.toLogicalWhereFragment = function (logicalOperation) {
        var sqlLogicalOperator;
        for (var operator in logicalOperation) {
            if (sqlLogicalOperator) {
                throw 'Logical operator is already defined';
            }
            switch (operator) {
                case '$and':
                    sqlLogicalOperator = 'AND';
                    break;
                case '$not':
                    sqlLogicalOperator = 'NOT';
                    break;
                case '$or':
                    sqlLogicalOperator = 'OR';
                    break;
            }
        }
        return null;
    };
    SQLQuery.prototype.toAndOrWhereFragment = function (operations, sqlLogicalOperator) {
        return null;
    };
    SQLQuery.prototype.getLogicalOperator = function (logicalOperation) {
        var sqlLogicalOperator;
        for (var operator in logicalOperation) {
            if (sqlLogicalOperator) {
                throw 'Logical operator is already defined';
            }
            switch (operator) {
                case '$and':
                    sqlLogicalOperator = 'AND';
                    break;
                case '$not':
                    sqlLogicalOperator = 'NOT';
                    break;
                case '$or':
                    sqlLogicalOperator = 'OR';
                    break;
            }
        }
        return sqlLogicalOperator;
    };
    return SQLQuery;
}());
exports.SQLQuery = SQLQuery;
//# sourceMappingURL=SQLQuery.js.map