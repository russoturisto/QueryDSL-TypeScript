"use strict";
var PHSQLQuery = (function () {
    function PHSQLQuery(phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phJsonQuery = phJsonQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHSQLQuery.prototype.toSQL = function () {
        var phWhere = this.phJsonQuery.where;
        return null;
    };
    PHSQLQuery.prototype.toWhereFragment = function (operation) {
        var sqlLogicalOperator = this.getLogicalOperator(operation);
        if (sqlLogicalOperator) {
            this.toLogicalWhereFragment(operation);
        }
        return null;
    };
    PHSQLQuery.prototype.toLogicalWhereFragment = function (logicalOperation) {
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
    PHSQLQuery.prototype.toAndOrWhereFragment = function (operations, sqlLogicalOperator) {
        return null;
    };
    PHSQLQuery.prototype.getLogicalOperator = function (logicalOperation) {
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
    return PHSQLQuery;
}());
exports.PHSQLQuery = PHSQLQuery;
//# sourceMappingURL=PHSQLQuery.js.map