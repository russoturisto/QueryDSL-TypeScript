"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHNonEntitySQLQuery_1 = require("./PHNonEntitySQLQuery");
var Appliable_1 = require("../../../../core/field/Appliable");
var Field_1 = require("../../../../core/field/Field");
var Functions_1 = require("../../../../core/field/Functions");
var BooleanField_1 = require("../../../../core/field/BooleanField");
var DateField_1 = require("../../../../core/field/DateField");
var NumberField_1 = require("../../../../core/field/NumberField");
var StringField_1 = require("../../../../core/field/StringField");
var PHFieldSQLQuery = (function (_super) {
    __extends(PHFieldSQLQuery, _super);
    // private qEntityMap: {[entityName: string]: QEntity<any>},
    //	private entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
    //		private entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
    function PHFieldSQLQuery(phRawQuery, entityAliases) {
        _super.call(this, entityAliases);
        this.phRawQuery = phRawQuery;
    }
    PHFieldSQLQuery.prototype.nonDistinctSelectClauseToJSON = function (rawSelect) {
        if (!(this.phRawQuery.select instanceof Field_1.QField)) {
            throw PHNonEntitySQLQuery_1.NON_ENTITY_SELECT_ERROR_MESSAGE;
        }
        return this.phRawQuery.select.toJSON(this.columnAliases, true);
    };
    PHFieldSQLQuery.prototype.toJSON = function () {
        var select = this.selectClauseToJSON(this.phRawQuery.select);
        var jsonFieldQuery = {
            select: select,
            objectType: Appliable_1.JSONClauseObjectType.FIELD_QUERY,
            dataType: this.getClauseDataType()
        };
        return this.getNonEntitySqlQuery(this.phRawQuery, jsonFieldQuery);
    };
    PHFieldSQLQuery.prototype.getClauseDataType = function () {
        var selectField = this.phRawQuery.select;
        if (selectField instanceof Functions_1.QDistinctFunction) {
            selectField = selectField.getSelectClause();
        }
        if (selectField instanceof BooleanField_1.QBooleanField) {
            return Appliable_1.SQLDataType.BOOLEAN;
        }
        else if (selectField instanceof DateField_1.QDateField) {
            return Appliable_1.SQLDataType.DATE;
        }
        else if (selectField instanceof NumberField_1.QNumberField) {
            return Appliable_1.SQLDataType.NUMBER;
        }
        else if (selectField instanceof StringField_1.QStringField) {
            return Appliable_1.SQLDataType.STRING;
        }
        else {
            throw "Unsupported type of select field in Field Query";
        }
    };
    return PHFieldSQLQuery;
}(PHNonEntitySQLQuery_1.PHDistinguishableSQLQuery));
exports.PHFieldSQLQuery = PHFieldSQLQuery;
//# sourceMappingURL=PHFieldSQLQuery.js.map