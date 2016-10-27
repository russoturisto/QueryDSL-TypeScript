"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHNonEntitySQLQuery_1 = require("./PHNonEntitySQLQuery");
var Field_1 = require("../../../../core/field/Field");
var OneToManyRelation_1 = require("../../../../core/entity/OneToManyRelation");
var PHMappedSQLQuery = (function (_super) {
    __extends(PHMappedSQLQuery, _super);
    function PHMappedSQLQuery(phRawQuery) {
        _super.call(this);
        this.phRawQuery = phRawQuery;
    }
    PHMappedSQLQuery.prototype.nonDistinctSelectClauseToJSON = function (rawSelect) {
        var select = {};
        for (var property in rawSelect) {
            var value = this.phRawQuery.select[property];
            if (value instanceof Field_1.QField) {
                select[property] = value.toJSON();
            }
            else if (value instanceof OneToManyRelation_1.QOneToManyRelation) {
                throw "@OneToMany relations can only be used in Entity Queries";
            } // Must be a primitive
            else {
                throw PHNonEntitySQLQuery_1.SELECT_ERROR_MESSAGE;
            }
        }
        return select;
    };
    PHMappedSQLQuery.prototype.toJSON = function () {
        var select = this.selectClauseToJSON(this.phRawQuery.select);
        var jsonRelation = this.phRawQuery;
        var jsonMappedQuery = {
            currentChildIndex: jsonRelation.currentChildIndex,
            fromClausePosition: jsonRelation.fromClausePosition,
            joinType: jsonRelation.joinType,
            relationType: jsonRelation.relationType,
            rootEntityPrefix: jsonRelation.rootEntityPrefix,
            select: select,
        };
        return this.getNonEntitySqlQuery(this.phRawQuery, jsonMappedQuery);
    };
    return PHMappedSQLQuery;
}(PHNonEntitySQLQuery_1.PHNonEntitySQLQuery));
exports.PHMappedSQLQuery = PHMappedSQLQuery;
//# sourceMappingURL=PHMappedSQLQuery.js.map