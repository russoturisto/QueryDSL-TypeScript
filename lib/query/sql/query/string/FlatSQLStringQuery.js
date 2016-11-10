"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringQuery_1 = require("../../SQLStringQuery");
var NonEntitySQLStringQuery_1 = require("./NonEntitySQLStringQuery");
var Appliable_1 = require("../../../../core/field/Appliable");
var SQLStringWhereBase_1 = require("../../SQLStringWhereBase");
var ExactOrderByParser_1 = require("../orderBy/ExactOrderByParser");
/**
 * Represents SQL String query with flat (aka traditional) Select clause.
 */
var FlatSQLStringQuery = (function (_super) {
    __extends(FlatSQLStringQuery, _super);
    function FlatSQLStringQuery(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, SQLStringQuery_1.QueryResultType.FLAT);
        this.orderByParser = new ExactOrderByParser_1.ExactOrderByParser(this.validator);
    }
    FlatSQLStringQuery.prototype.getSELECTFragment = function (selectSqlFragment, selectClauseFragment) {
        var _this = this;
        if (!selectClauseFragment) {
            throw "SELECT clause is not defined for a Flat Query";
        }
        {
            var distinctClause = selectClauseFragment;
            if (distinctClause.objectType == Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION) {
                var distinctSelect = this.getSELECTFragment(selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0]);
                return "DISTINCT " + distinctSelect;
            }
        }
        if (!(selectClauseFragment instanceof Array)) {
            throw "SELECT clause for a Flat Query must be an Array";
        }
        selectSqlFragment += selectClauseFragment.map(function (field) {
            return _this.getFieldSelectFragment(field, SQLStringWhereBase_1.ClauseType.NON_MAPPED_SELECT_CLAUSE, null, selectSqlFragment);
        }).join('');
        return selectSqlFragment;
    };
    FlatSQLStringQuery.prototype.parseQueryResults = function (results) {
        var _this = this;
        var parsedResults = [];
        if (!results || !results.length) {
            return parsedResults;
        }
        parsedResults = [];
        var lastResult;
        results.forEach(function (result) {
            var parsedResult = _this.parseQueryResult(_this.phJsonQuery.select, result, [0]);
            parsedResults.push(parsedResult);
        });
        return parsedResults;
    };
    FlatSQLStringQuery.prototype.parseQueryResult = function (selectClauseFragment, resultRow, nextFieldIndex) {
        var _this = this;
        return selectClauseFragment.map(function (field) {
            var propertyValue = _this.sqlAdaptor.getResultCellValue(resultRow, field.fieldAlias, nextFieldIndex[0], field.dataType, null);
            nextFieldIndex[0]++;
            return propertyValue;
        });
    };
    return FlatSQLStringQuery;
}(NonEntitySQLStringQuery_1.NonEntitySQLStringQuery));
exports.FlatSQLStringQuery = FlatSQLStringQuery;
//# sourceMappingURL=FlatSQLStringQuery.js.map