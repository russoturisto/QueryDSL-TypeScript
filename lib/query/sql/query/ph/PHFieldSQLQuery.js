"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHNonEntitySQLQuery_1 = require("./PHNonEntitySQLQuery");
var Appliable_1 = require("../../../../core/field/Appliable");
var Field_1 = require("../../../../core/field/Field");
var PHFieldSQLQuery = (function (_super) {
    __extends(PHFieldSQLQuery, _super);
    // private qEntityMap: {[entityName: string]: QEntity<any>},
    //	private entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
    //		private entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
    function PHFieldSQLQuery(phRawQuery) {
        _super.call(this);
        this.phRawQuery = phRawQuery;
    }
    PHFieldSQLQuery.prototype.nonDistinctSelectClauseToJSON = function (rawSelect) {
        if (!(this.phRawQuery.select instanceof Field_1.QField)) {
            throw PHNonEntitySQLQuery_1.NON_ENTITY_SELECT_ERROR_MESSAGE;
        }
        return this.phRawQuery.select.toJSON(this.columnAliases);
    };
    PHFieldSQLQuery.prototype.toJSON = function () {
        var select = this.selectClauseToJSON(this.phRawQuery.select);
        var jsonFieldQuery = {
            select: select,
            type: Appliable_1.JSONClauseObjectType.FIELD_QUERY
        };
        return this.getNonEntitySqlQuery(this.phRawQuery, jsonFieldQuery);
    };
    return PHFieldSQLQuery;
}(PHNonEntitySQLQuery_1.PHDistinguishableSQLQuery));
exports.PHFieldSQLQuery = PHFieldSQLQuery;
//# sourceMappingURL=PHFieldSQLQuery.js.map