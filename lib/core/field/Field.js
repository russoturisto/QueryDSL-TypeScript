"use strict";
var Relation_1 = require("../entity/Relation");
var FieldInOrderBy_1 = require("./FieldInOrderBy");
var Appliable_1 = require("./Appliable");
var PHFieldSQLQuery_1 = require("../../query/sql/query/ph/PHFieldSQLQuery");
(function (FieldType) {
    FieldType[FieldType["BOOLEAN"] = 0] = "BOOLEAN";
    FieldType[FieldType["DATE"] = 1] = "DATE";
    FieldType[FieldType["NUMBER"] = 2] = "NUMBER";
    FieldType[FieldType["STRING"] = 3] = "STRING";
})(exports.FieldType || (exports.FieldType = {}));
var FieldType = exports.FieldType;
var QField = (function () {
    function QField(q, qConstructor, entityName, fieldName, fieldType) {
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.__appliedFunctions__ = [];
    }
    QField.prototype.getFieldKey = function () {
        var key = Relation_1.QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition) + "." + this.fieldName;
        return key;
    };
    QField.prototype.objectEquals = function (otherField, checkValue) {
        if (this.q.constructor !== otherField.q.constructor) {
            return false;
        }
        if (this.constructor !== otherField.constructor) {
            return false;
        }
        if (this.fieldType !== otherField.fieldType) {
            return false;
        }
        if (this.fieldName !== otherField.fieldName) {
            return false;
        }
        return true;
    };
    QField.prototype.asc = function () {
        return new FieldInOrderBy_1.FieldInOrderBy(this, FieldInOrderBy_1.SortOrder.ASCENDING);
    };
    QField.prototype.desc = function () {
        return new FieldInOrderBy_1.FieldInOrderBy(this, FieldInOrderBy_1.SortOrder.DESCENDING);
    };
    QField.prototype.copyFunctions = function (field) {
        field.__appliedFunctions__ = this.__appliedFunctions__.slice();
        return field;
    };
    QField.prototype.applySqlFunction = function (sqlFunctionCall) {
        var appliedField = this.getInstance();
        appliedField.__appliedFunctions__.push(sqlFunctionCall);
        return appliedField;
    };
    QField.prototype.addSubQuery = function (subQuery) {
        var appliedField = this.getInstance();
        appliedField.__fieldSubQuery__ = subQuery;
        return appliedField;
    };
    QField.prototype.toJSON = function (columnAliases, forSelectClause) {
        var alias;
        if (forSelectClause) {
            alias = columnAliases.getNextAlias(this);
        }
        var jsonField = {
            __appliedFunctions__: this.appliedFunctionsToJson(this.__appliedFunctions__, columnAliases),
            entityName: this.q.__entityName__,
            fieldAlias: alias,
            propertyName: this.fieldName,
            tableAlias: Relation_1.QRelation.getPositionAlias(this.q.rootEntityPrefix, this.q.fromClausePosition),
            type: Appliable_1.JSONClauseObjectType.FIELD
        };
        if (this.__fieldSubQuery__) {
            var subSelectQuery = new PHFieldSQLQuery_1.PHFieldSQLQuery(this.__fieldSubQuery__, columnAliases.entityAliases).toJSON();
            jsonField.fieldSubQuery = subSelectQuery;
        }
        return jsonField;
    };
    QField.prototype.appliedFunctionsToJson = function (appliedFunctions, columnAliases) {
        var _this = this;
        if (!appliedFunctions) {
            return appliedFunctions;
        }
        return appliedFunctions.map(function (appliedFunction) {
            return _this.functionCallToJson(appliedFunction, columnAliases);
        });
    };
    QField.prototype.functionCallToJson = function (functionCall, columnAliases) {
        var _this = this;
        var parameters;
        if (functionCall.parameters) {
            parameters = functionCall.parameters.map(function (parameter) {
                return _this.valueToJSON(parameter, columnAliases, false);
            });
        }
        return {
            functionType: functionCall.functionType,
            parameters: parameters
        };
    };
    QField.prototype.valueToJSON = function (value, columnAliases, forSelectClause) {
        if (!value) {
            return value;
        }
        switch (typeof value) {
            case "boolean":
            case "number":
            case "string":
            case "undefined":
                return value;
        }
        if (value instanceof QField) {
            return value.toJSON(columnAliases, forSelectClause);
        }
        // must be a field sub-query
        var rawFieldQuery = value;
        var phFieldQuery = new PHFieldSQLQuery_1.PHFieldSQLQuery(rawFieldQuery, columnAliases.entityAliases);
        return phFieldQuery.toJSON();
    };
    QField.prototype.operableFunctionToJson = function (type, value, columnAliases, forSelectClause) {
        var alias;
        if (forSelectClause) {
            alias = columnAliases.getNextAlias(this);
        }
        return {
            __appliedFunctions__: this.appliedFunctionsToJson(this.__appliedFunctions__, columnAliases),
            fieldAlias: alias,
            type: type,
            value: this.valueToJSON(value, columnAliases, false)
        };
    };
    return QField;
}());
exports.QField = QField;
//# sourceMappingURL=Field.js.map