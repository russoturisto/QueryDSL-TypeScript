"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NonEntitySQLStringQuery_1 = require("./NonEntitySQLStringQuery");
var SQLStringQuery_1 = require("../../SQLStringQuery");
var Appliable_1 = require("../../../../core/field/Appliable");
var SQLStringWhereBase_1 = require("../../SQLStringWhereBase");
var ExactOrderByParser_1 = require("../orderBy/ExactOrderByParser");
/**
 * Created by Papa on 10/29/2016.
 */
var FieldSQLStringQuery = (function (_super) {
    __extends(FieldSQLStringQuery, _super);
    function FieldSQLStringQuery(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, SQLStringQuery_1.QueryResultType.FIELD);
        this.orderByParser = new ExactOrderByParser_1.ExactOrderByParser(this.validator);
    }
    FieldSQLStringQuery.prototype.getSELECTFragment = function (selectSqlFragment, selectClauseFragment) {
        if (!selectClauseFragment) {
            throw "SELECT clause is not defined for a Field Query";
        }
        {
            var distinctClause = selectClauseFragment;
            if (distinctClause.objectType == Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION) {
                var distinctSelect = this.getSELECTFragment(selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0]);
                return "DISTINCT " + distinctSelect;
            }
        }
        var field = selectClauseFragment;
        selectSqlFragment += this.getFieldSelectFragment(field, SQLStringWhereBase_1.ClauseType.NON_MAPPED_SELECT_CLAUSE, null, selectSqlFragment);
        return selectSqlFragment;
    };
    FieldSQLStringQuery.prototype.parseQueryResults = function (results) {
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
    FieldSQLStringQuery.prototype.parseQueryResult = function (selectClauseFragment, resultRow, nextFieldIndex) {
        var field = selectClauseFragment;
        var propertyValue = this.sqlAdaptor.getResultCellValue(resultRow, field.fieldAlias, nextFieldIndex[0], field.dataType, null);
        nextFieldIndex[0]++;
        return propertyValue;
    };
    return FieldSQLStringQuery;
}(NonEntitySQLStringQuery_1.NonEntitySQLStringQuery));
exports.FieldSQLStringQuery = FieldSQLStringQuery;
//# sourceMappingURL=FieldSQLStringQuery.js.map