/**
 * Created by Papa on 10/28/2016.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relation_1 = require("../../../../core/entity/Relation");
var NonEntitySQLStringQuery_1 = require("./NonEntitySQLStringQuery");
var Appliable_1 = require("../../../../core/field/Appliable");
/**
 *
 */
var MappedSQLStringQuery = (function (_super) {
    __extends(MappedSQLStringQuery, _super);
    function MappedSQLStringQuery(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType) {
        _super.call(this, phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType);
    }
    MappedSQLStringQuery.prototype.getSELECTFragment = function (entityName, selectSqlFragment, selectClauseFragment, joinTree, entityDefaults, embedParameters, parameters) {
        var _this = this;
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        if (entityName) {
            throw "Entity references cannot be used in SELECT clause of mapped queries";
        }
        if (entityDefaults) {
            throw "Entity defaults cannot be used in SELECT clause of mapped queries";
        }
        {
            var distinctClause = selectClauseFragment;
            if (distinctClause.type == Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION) {
                var distinctSelect = this.getSELECTFragment(entityName, selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0], joinTree, entityDefaults, embedParameters, parameters);
                return "DISTINCT " + distinctSelect;
            }
        }
        var retrieveAllOwnFields = false;
        var numProperties = 0;
        for (var propertyName in selectClauseFragment) {
            if (propertyName === '*') {
                retrieveAllOwnFields = true;
                delete selectClauseFragment['*'];
                throw "'*' operator isn't yet implemented in mapped queries";
            }
            numProperties++;
        }
        if (numProperties === 0) {
            throw "Mapped query must have fields in select clause";
        }
        //  For {} select causes or if '*' is present, retrieve the entire object
        if (retrieveAllOwnFields) {
            selectClauseFragment = {};
            var tableAlias = Relation_1.QRelation.getAlias(joinTree.jsonRelation);
            var qEntity = this.qEntityMapByAlias[tableAlias];
            var entityMetadata = qEntity.__entityConstructor__;
            var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
            var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
            for (var propertyName in entityPropertyTypeMap) {
                selectClauseFragment[propertyName] = entityPropertyTypeMap[propertyName];
            }
            throw "'*' operator isn't yet implemented in mapped queries";
        }
        var _loop_1 = function(propertyName) {
            var value = selectClauseFragment[propertyName];
            // Skip undefined values
            if (value === undefined) {
                return "continue";
            }
            selectSqlFragment += this_1.getFieldValue(value, selectSqlFragment, true, 
            // Nested object processing
            function () {
                return _this.getSELECTFragment(null, selectSqlFragment, selectClauseFragment[propertyName], joinTree.getEntityRelationChildNode(childEntityName, propertyName), null, embedParameters, parameters);
            });
            var fieldKey = tableAlias + "." + propertyName;
            if (entityPropertyTypeMap[propertyName]) {
                var columnName = this_1.getEntityPropertyColumnName(qEntity, propertyName, tableAlias);
                var columnSelect = this_1.getSimpleColumnSelectFragment(propertyName, tableAlias, columnName, selectSqlFragment);
                selectSqlFragment += columnSelect;
            }
            else if (entityRelationMap[propertyName]) {
                var subSelectClauseFragment = selectClauseFragment[propertyName];
                if (subSelectClauseFragment == null) {
                    // For null entity reference, retrieve just the id
                    if (entityMetadata.manyToOneMap[propertyName]) {
                        var columnName = this_1.getEntityManyToOneColumnName(qEntity, propertyName, tableAlias);
                        var columnSelect = this_1.getSimpleColumnSelectFragment(propertyName, tableAlias, columnName, selectSqlFragment);
                        selectSqlFragment += columnSelect;
                        return "continue";
                    }
                    else {
                        // Do not retrieve @OneToMay set to null
                        return "continue";
                    }
                }
                var childEntityName = entityRelationMap[propertyName].entityName;
            }
            else {
                throw "Unexpected property '" + propertyName + "' on entity '" + entityName + "' (alias '" + tableAlias + "') in SELECT clause.";
            }
        };
        var this_1 = this;
        for (var propertyName in selectClauseFragment) {
            _loop_1(propertyName);
        }
        return selectSqlFragment;
    };
    return MappedSQLStringQuery;
}(NonEntitySQLStringQuery_1.NonEntitySQLStringQuery));
exports.MappedSQLStringQuery = MappedSQLStringQuery;
//# sourceMappingURL=MappedSQLStringQuery.js.map