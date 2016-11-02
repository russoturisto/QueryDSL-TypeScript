/**
 * Created by Papa on 10/28/2016.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    MappedSQLStringQuery.prototype.getSELECTFragment = function (entityName, selectSqlFragment, selectClauseFragment, joinTree, entityDefaults) {
        var _this = this;
        if (entityName) {
            throw "Entity references cannot be used in SELECT clause of mapped queries";
        }
        if (entityDefaults) {
            throw "Entity defaults cannot be used in SELECT clause of mapped queries";
        }
        {
            var distinctClause = selectClauseFragment;
            if (distinctClause.type == Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION) {
                var distinctSelect = this.getSELECTFragment(entityName, selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0], null, entityDefaults);
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
            throw "'*' operator isn't yet implemented in mapped queries";
        }
        var _loop_1 = function(propertyName) {
            var value = selectClauseFragment[propertyName];
            // Skip undefined values
            if (value === undefined) {
                return "continue";
            }
            var columnSelectSqlFragment = this_1.getFieldValue(value, true, 
            // Nested object processing
            function () {
                return _this.getSELECTFragment(null, selectSqlFragment, selectClauseFragment[propertyName], null, null);
            });
            columnSelectSqlFragment += " as " + value.fieldAlias + "\n";
            if (selectSqlFragment) {
                selectSqlFragment += "\t, " + columnSelectSqlFragment;
            }
            else {
                selectSqlFragment += "\t" + columnSelectSqlFragment;
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