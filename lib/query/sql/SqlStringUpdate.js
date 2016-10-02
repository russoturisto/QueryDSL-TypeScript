"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringNoJoinQuery_1 = require("./SQLStringNoJoinQuery");
/**
 * Created by Papa on 10/2/2016.
 */
var SQLStringUpdate = (function (_super) {
    __extends(SQLStringUpdate, _super);
    function SQLStringUpdate(phJsonUpdate, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
        this.phJsonUpdate = phJsonUpdate;
    }
    SQLStringUpdate.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        if (!this.phJsonUpdate.update) {
            throw "Expecting exactly one table in FROM clause";
        }
        var entityName = this.qEntity.__entityName__;
        var joinQEntityMap = {};
        var updateFragment = this.getTableFragment(this.phJsonUpdate.update);
        var setFragment = this.getSetFragment(entityName, this.phJsonUpdate.set, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonUpdate.where, 0, joinQEntityMap, embedParameters, parameters);
        return "update\n" + updateFragment + "\nSET\n" + setFragment + "\nWHERE\n" + whereFragment;
    };
    SQLStringUpdate.prototype.getSetFragment = function (entityName, setClauseFragment, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var qEntity = this.qEntityMap[entityName];
        var entityMetadata = qEntity.__entityConstructor__;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var tableAlias = joinAliasMap[entityName];
        if (!tableAlias) {
            throw "Alias for entity " + entityName + " is not defined in the From clause.";
        }
        var retrieveAllOwnFields = false;
        var numProperties = 0;
        for (var propertyName in selectClauseFragment) {
            if (propertyName === '*') {
                retrieveAllOwnFields = true;
                delete selectClauseFragment['*'];
            }
            numProperties++;
        }
        //  For {} select causes or if __allOwnFields__ is present, retrieve the entire object
        if (numProperties === 0 || retrieveAllOwnFields) {
            selectClauseFragment = {};
            for (var propertyName in entityPropertyTypeMap) {
                selectClauseFragment[propertyName] = null;
            }
        }
        for (var propertyName in selectClauseFragment) {
            var value = selectClauseFragment[propertyName];
            // Skip undefined values
            if (value === undefined) {
                continue;
            }
            else if (value !== null) {
                entityDefaultsMap[propertyName] = value;
            }
            if (entityPropertyTypeMap[propertyName]) {
                var columnName = this.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
                var columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, columnAliasMap, selectFragment);
                selectFragment += columnSelect;
            }
            else if (entityRelationMap[propertyName]) {
                var defaultsChildMap = {};
                entityDefaultsMap[propertyName] = defaultsChildMap;
                var subSelectClauseFragment = selectClauseFragment[propertyName];
                if (subSelectClauseFragment == null) {
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var columnName = this.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
                        var columnSelect = this.getColumnSelectFragment(propertyName, tableAlias, columnName, columnAliasMap, selectFragment);
                        selectFragment += columnSelect;
                        continue;
                    }
                    else {
                        // Do not retrieve @OneToMay set to null
                        continue;
                    }
                }
                selectFragment = this.getSelectFragment(entityRelationMap[propertyName].entityName, selectFragment, selectClauseFragment[propertyName], joinAliasMap, columnAliasMap, defaultsChildMap);
            }
            else {
                throw "Unexpected property '" + propertyName + "' on entity '" + entityName + "' (alias '" + tableAlias + "') in SELECT clause.";
            }
        }
        return selectFragment;
    };
    return SQLStringUpdate;
}(SQLStringNoJoinQuery_1.SQLStringNoJoinQuery));
exports.SQLStringUpdate = SQLStringUpdate;
//# sourceMappingURL=SQLStringUpdate.js.map