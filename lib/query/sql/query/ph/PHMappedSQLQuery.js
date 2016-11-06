"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHNonEntitySQLQuery_1 = require("./PHNonEntitySQLQuery");
var Field_1 = require("../../../../core/field/Field");
var OneToManyRelation_1 = require("../../../../core/entity/OneToManyRelation");
exports.FIELD_IN_SELECT_CLAUSE_ERROR_MESSAGE = "Entity SELECT clauses can only contain fields assigned: null | undefined | boolean | Date | number | string | Relation SELECT";
/**
 * A query whose select object is a collection of properties.
 */
var PHMappableSQLQuery = (function (_super) {
    __extends(PHMappableSQLQuery, _super);
    function PHMappableSQLQuery() {
        _super.apply(this, arguments);
    }
    PHMappableSQLQuery.prototype.nonDistinctSelectClauseToJSON = function (rawSelect) {
        var select = {};
        for (var property in rawSelect) {
            var value = rawSelect[property];
            if (value instanceof Field_1.QField) {
                if (this.isEntityQuery) {
                    throw exports.FIELD_IN_SELECT_CLAUSE_ERROR_MESSAGE;
                }
                // The same value may appear in the select clause more than once.
                // In that case the last one will set the alias for all of them.
                // Because the alias only matters for GROUP BY and ORDER BY
                // that is OK.
                select[property] = value.toJSON(this.columnAliases, true);
            }
            else if (value instanceof OneToManyRelation_1.QOneToManyRelation) {
                throw "@OneToMany relation objects can cannot be used in SELECT clauses";
            } // Must be a primitive
            else {
                if (!this.isEntityQuery) {
                    throw PHNonEntitySQLQuery_1.NON_ENTITY_SELECT_ERROR_MESSAGE;
                }
                // Must be an entity query here
                switch (typeof value) {
                    case "boolean":
                    case "number":
                    case "string":
                    case "undefined":
                        continue;
                    case "object":
                        if (value instanceof Date) {
                            continue;
                        }
                        else if (value === null) {
                            continue;
                        }
                        else {
                            this.nonDistinctSelectClauseToJSON(value);
                        }
                }
            }
        }
        return select;
    };
    return PHMappableSQLQuery;
}(PHNonEntitySQLQuery_1.PHDistinguishableSQLQuery));
exports.PHMappableSQLQuery = PHMappableSQLQuery;
var PHMappedSQLQuery = (function (_super) {
    __extends(PHMappedSQLQuery, _super);
    function PHMappedSQLQuery(phRawQuery, entityAliases) {
        _super.call(this, entityAliases);
        this.phRawQuery = phRawQuery;
    }
    PHMappedSQLQuery.prototype.toJSON = function () {
        var select = this.selectClauseToJSON(this.phRawQuery.select);
        var jsonMappedQuery = {
            select: select
        };
        return this.getNonEntitySqlQuery(this.phRawQuery, jsonMappedQuery);
    };
    return PHMappedSQLQuery;
}(PHMappableSQLQuery));
exports.PHMappedSQLQuery = PHMappedSQLQuery;
//# sourceMappingURL=PHMappedSQLQuery.js.map