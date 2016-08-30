"use strict";
var QueryTreeNode_1 = require("./QueryTreeNode");
/**
 * Created by Papa on 8/20/2016.
 */
var ALIASES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var SQLQuery = (function () {
    function SQLQuery(phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phJsonQuery = phJsonQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.aliasMap = {};
        this.currentAliasIndex = 0;
    }
    SQLQuery.prototype.toSQL = function () {
        var entityName = this.qEntity.__entityName__;
        var selectFragment = "SELECT\n" + this.getSelectFragment(entityName, null, this.phJsonQuery.select);
        var fromFragment = this.getFromFragment();
        return selectFragment;
    };
    SQLQuery.prototype.getSelectFragment = function (entityMapping, existingSelectFragment, selectClauseFragment) {
        var entityMetadata = this.qEntity.__entityConstructor__;
        var columnMap = entityMetadata.columnMap;
        var entityName = this.qEntity.__entityName__;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        if (!this.aliasMap[entityMapping]) {
            this.aliasMap[entityMapping] = ALIASES[this.currentAliasIndex++];
        }
        var tableAlias = this.aliasMap[entityMapping];
        var selectFragment = '';
        for (var property in selectClauseFragment) {
            if (entityPropertyTypeMap[property]) {
                var columnName = void 0;
                if (columnMap[property]) {
                    columnName = columnMap[property].name;
                }
                else {
                    columnName = property;
                }
                var columnSelect = '${tableAlias}.${columnName}\n';
                if (existingSelectFragment) {
                    columnSelect = "\t, " + columnSelect;
                }
                else {
                    columnSelect = "\t" + columnSelect;
                }
                selectFragment += columnSelect;
            }
            else if (entityRelationMap[property]) {
                selectFragment += this.getSelectFragment(entityName + "." + property, existingSelectFragment + selectFragment, selectClauseFragment[property]);
            }
            else {
                throw "Unexpected property '" + property + "' on entity '" + entityName + "'";
            }
        }
        return selectFragment;
    };
    SQLQuery.prototype.getFromFragment = function () {
        var queryRoot = this.getQueryTree();
        var joinRelations = this.phJsonQuery.from;
        if (joinRelations.length < 1) {
            throw "Expecting at least one table in FROM clause";
        }
        var firstRelation = joinRelations[0];
        var fromFragment = 'FROM\t';
        if (firstRelation.relationPropertyName || firstRelation.joinType || firstRelation.parentEntityAlias) {
            throw "First table in FROM clause cannot be joined";
        }
        var firstEntity = this.qEntityMap[firstRelation.entityName];
        if (firstEntity != this.qEntity) {
            throw "Unexpected first table in FROM clause: " + firstRelation.entityName + ", expecting: " + this.qEntity.__entityName__;
        }
        var firstEntityMetadata = firstEntity.__entityConstructor__;
        var tableName = firstEntity.__entityName__;
        if (firstEntityMetadata.table && firstEntityMetadata.table.name) {
            tableName = firstEntityMetadata.table.name;
        }
        if (!firstRelation.alias) {
            throw "Missing an alias for the first table in the FROM clause.";
        }
        fromFragment += tableName + " " + firstRelation.alias;
        for (var i = 1; i < joinRelations.length; i++) {
            if (!firstRelation.relationPropertyName) {
                throw "Table " + (i + 1) + " in FROM clause is missing relationPropertyName";
            }
            if (!firstRelation.joinType) {
                throw "Table " + (i + 1) + " in FROM clause is missing joinType";
            }
            if (!firstRelation.parentEntityAlias) {
                throw "Table " + (i + 1) + " in FROM clause is missing parentEntityAlias";
            }
            var firstEntity_1 = this.qEntityMap[firstRelation.entityName];
            if (firstEntity_1 != this.qEntity) {
                throw "Unexpected first table in FROM clause: " + firstRelation.entityName + ", expecting: " + this.qEntity.__entityName__;
            }
            var firstEntityMetadata_1 = firstEntity_1.__entityConstructor__;
            var tableName_1 = firstEntity_1.__entityName__;
            if (firstEntityMetadata_1.table && firstEntityMetadata_1.table.name) {
                tableName_1 = firstEntityMetadata_1.table.name;
            }
            if (!firstRelation.alias) {
                throw "Missing an alias for the first table in the FROM clause.";
            }
            fromFragment += tableName_1 + " " + firstRelation.alias;
        }
        var entityRelations = this.entitiesRelationPropertyMap[this.qEntity.__entityName__];
        if (queryRoot.relationToParent) {
            var joinTypeString = void 0;
            for (var joinProperty in queryRoot.relationToParent) {
                if (joinTypeString) {
                    throw "More than one join defined in '" + JSON.stringify(queryRoot.relationToParent) + "'";
                }
                switch (joinProperty) {
                    case 'INNER_JOIN':
                        joinTypeString = 'INNER JOIN';
                    case 'LEFT_JOIN':
                        joinTypeString = 'LEFT JOIN';
                    case 'RIGHT_JOIN':
                        joinTypeString = 'RIGHT JOIN';
                    case 'FULL_OUTER_JOIN':
                        joinTypeString = 'FULL OUTER JOIN';
                }
            }
            fromFragment += '${joinTypeString} ';
        }
        var entityMetadata = this.qEntity.__entityConstructor__;
        tableName;
        if (entityMetadata.table) {
            tableName = entityMetadata.table.name;
        }
        else {
            tableName = this.qEntity.__entityName__;
        }
        fromFragment += tableName;
        if (queryRoot.relationToParent) {
            fromFragment += '\t\tON ';
            switch (queryRoot.relationToParentType) {
                case QueryTreeNode_1.RelationType.MANY_TO_ONE:
                    break;
                case QueryTreeNode_1.RelationType.ONE_TO_MANY:
                    break;
            }
        }
        return '';
    };
    SQLQuery.prototype.getQueryTree = function () {
        this.e;
        return {};
    };
    SQLQuery.prototype.parseSQL = function () {
        return {};
    };
    return SQLQuery;
}());
exports.SQLQuery = SQLQuery;
//# sourceMappingURL=SQLQuery.js.map