"use strict";
(function (JoinType) {
    JoinType[JoinType["INNER_JOIN"] = 0] = "INNER_JOIN";
    JoinType[JoinType["LEFT_JOIN"] = 1] = "LEFT_JOIN";
})(exports.JoinType || (exports.JoinType = {}));
var JoinType = exports.JoinType;
var PHSQLQuery = (function () {
    function PHSQLQuery(phRawQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phRawQuery = phRawQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHSQLQuery.prototype.toSQL = function () {
        var phJoin = [];
        this.phRawQuery.from.forEach(function (iEntity) {
            phJoin.push(iEntity.getRelationJson());
        });
        return {
            select: this.phRawQuery.select,
            from: phJoin,
            where: this.phRawQuery.where
        };
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