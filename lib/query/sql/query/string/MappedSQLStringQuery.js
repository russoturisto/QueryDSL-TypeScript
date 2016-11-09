/**
 * Created by Papa on 10/28/2016.
 */
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
var MappedOrderByParser_1 = require("../orderBy/MappedOrderByParser");
var MappedQueryResultParser_1 = require("../result/MappedQueryResultParser");
var Aliases_1 = require("../../../../core/entity/Aliases");
/**
 *
 */
var MappedSQLStringQuery = (function (_super) {
    __extends(MappedSQLStringQuery, _super);
    function MappedSQLStringQuery(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, SQLStringQuery_1.QueryResultType.MAPPED_HIERARCHICAL);
        this.queryParser = new MappedQueryResultParser_1.MappedQueryResultParser();
        this.orderByParser = new MappedOrderByParser_1.MappedOrderByParser(this.validator);
    }
    MappedSQLStringQuery.prototype.getSELECTFragment = function (selectSqlFragment, selectClauseFragment) {
        var _this = this;
        {
            var distinctClause = selectClauseFragment;
            if (distinctClause.objectType == Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION) {
                var distinctSelect = this.getSELECTFragment(selectSqlFragment, distinctClause.__appliedFunctions__[0].parameters[0]);
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
            if (selectSqlFragment) {
                throw "Mapped query must have fields in sub-select clause";
            }
            else {
                return '*';
            }
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
            selectSqlFragment += this_1.getFieldSelectFragment(value, SQLStringWhereBase_1.ClauseType.MAPPED_SELECT_CLAUSE, function () {
                return _this.getSELECTFragment(selectSqlFragment, selectClauseFragment[propertyName]);
            }, selectSqlFragment);
        };
        var this_1 = this;
        for (var propertyName in selectClauseFragment) {
            _loop_1(propertyName);
        }
        return selectSqlFragment;
    };
    /**
     * Entities get merged if they are right next to each other in the result set.  If they are not, they are
     * treated as separate entities - hence, your sort order matters.
     *
     * @param results
     * @returns {any[]}
     */
    MappedSQLStringQuery.prototype.parseQueryResults = function (results) {
        var _this = this;
        var parsedResults = [];
        if (!results || !results.length) {
            return parsedResults;
        }
        parsedResults = [];
        var lastResult;
        results.forEach(function (result) {
            var aliasCache = new Aliases_1.AliasCache();
            var parsedResult = _this.parseQueryResult(_this.phJsonQuery.select, result, [0], aliasCache, aliasCache.getFollowingAlias());
            if (!lastResult) {
                parsedResults.push(parsedResult);
            }
            else if (lastResult !== parsedResult) {
                lastResult = parsedResult;
                parsedResults.push(parsedResult);
            }
            _this.queryParser.flushRow();
        });
        return parsedResults;
    };
    MappedSQLStringQuery.prototype.parseQueryResult = function (selectClauseFragment, resultRow, nextFieldIndex, aliasCache, entityAlias) {
        // Return blanks, primitives and Dates directly
        if (!resultRow || !(resultRow instanceof Object) || resultRow instanceof Date) {
            return resultRow;
        }
        {
            var distinctClause = selectClauseFragment;
            if (distinctClause.objectType == Appliable_1.JSONClauseObjectType.DISTINCT_FUNCTION) {
                return this.parseQueryResult(distinctClause.__appliedFunctions__[0].parameters[0], resultRow, nextFieldIndex, aliasCache, entityAlias);
            }
        }
        var resultObject = this.queryParser.addEntity(entityAlias);
        for (var propertyName in selectClauseFragment) {
            if (selectClauseFragment[propertyName] === undefined) {
                continue;
            }
            var jsonClauseField = selectClauseFragment[propertyName];
            var dataType = jsonClauseField.dataType;
            // Must be a sub-query
            if (!dataType) {
                var childResultObject = this.parseQueryResult(jsonClauseField, resultRow, nextFieldIndex, aliasCache, aliasCache.getFollowingAlias());
                this.queryParser.bufferOneToManyCollection(entityAlias, resultObject, propertyName, childResultObject);
            }
            else {
                var propertyValue = this.sqlAdaptor.getResultCellValue(resultRow, jsonClauseField.fieldAlias, nextFieldIndex[0], dataType, null);
                this.queryParser.addProperty(entityAlias, resultObject, dataType, propertyName, propertyValue);
            }
            nextFieldIndex[0]++;
        }
        return this.queryParser.flushEntity(entityAlias, resultObject);
    };
    return MappedSQLStringQuery;
}(NonEntitySQLStringQuery_1.NonEntitySQLStringQuery));
exports.MappedSQLStringQuery = MappedSQLStringQuery;
//# sourceMappingURL=MappedSQLStringQuery.js.map