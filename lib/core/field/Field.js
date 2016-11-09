"use strict";
var Relation_1 = require("../entity/Relation");
var FieldInOrderBy_1 = require("./FieldInOrderBy");
var PHFieldSQLQuery_1 = require("../../query/sql/query/ph/PHFieldSQLQuery");
var QField = (function () {
    function QField(q, qConstructor, entityName, fieldName, objectType, dataType) {
        this.q = q;
        this.qConstructor = qConstructor;
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.objectType = objectType;
        this.dataType = dataType;
        this.__appliedFunctions__ = [];
    }
    /**
     protected getFieldKey() {
        let rootEntityPrefix = columnAliases.entityAliases.getExistingAlias(this.q.getRootJoinEntity());
        let key = `${QRelation.getPositionAlias(rootEntityPrefix, this.q.fromClausePosition)}.${this.fieldName}`;

        return key;
    }
     */
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
        var rootEntityPrefix = columnAliases.entityAliases.getExistingAlias(this.q.getRootJoinEntity());
        var jsonField = {
            __appliedFunctions__: this.appliedFunctionsToJson(this.__appliedFunctions__, columnAliases),
            entityName: this.q.__entityName__,
            fieldAlias: alias,
            propertyName: this.fieldName,
            tableAlias: Relation_1.QRelation.getPositionAlias(rootEntityPrefix, this.q.fromClausePosition),
            objectType: this.objectType,
            dataType: this.dataType
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
    QField.prototype.valueToJSON = function (functionObject, columnAliases, forSelectClause) {
        if (!functionObject) {
            throw "Function object must be provided to valueToJSON function.";
        }
        var value = functionObject.value;
        switch (typeof value) {
            case "boolean":
            case "number":
            case "string":
                return columnAliases.entityAliases.getParams().getNextAlias(functionObject);
            case "undefined":
                throw "Undefined is not allowed as a query parameter";
        }
        if (value instanceof Date) {
            return columnAliases.entityAliases.getParams().getNextAlias(functionObject);
        }
        if (value instanceof QField) {
            return value.toJSON(columnAliases, forSelectClause);
        }
        // must be a field sub-query
        var rawFieldQuery = value;
        var phFieldQuery = new PHFieldSQLQuery_1.PHFieldSQLQuery(rawFieldQuery, columnAliases.entityAliases);
        return phFieldQuery.toJSON();
    };
    QField.prototype.operableFunctionToJson = function (functionObject, columnAliases, forSelectClause) {
        var alias;
        if (forSelectClause) {
            alias = columnAliases.getNextAlias(this);
        }
        return {
            __appliedFunctions__: this.appliedFunctionsToJson(this.__appliedFunctions__, columnAliases),
            fieldAlias: alias,
            objectType: this.objectType,
            dataType: this.dataType,
            value: this.valueToJSON(functionObject, columnAliases, false)
        };
    };
    return QField;
}());
exports.QField = QField;
//# sourceMappingURL=Field.js.map