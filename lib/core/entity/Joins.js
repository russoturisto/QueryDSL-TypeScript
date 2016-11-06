"use strict";
var Aliases_1 = require("./Aliases");
var Entity_1 = require("./Entity");
var Field_1 = require("../field/Field");
/**
 * Created by Papa on 10/25/2016.
 */
function view(query) {
    var queryDefinition;
    if (query instanceof Function) {
        queryDefinition = query();
    }
    else {
        queryDefinition = query;
    }
    // When retrieved via the view() function the query is the first one in the list
    var rootQuery = queryDefinition;
    // By default treat the view as the first table in the join, this will be overwritten if it becomes
    // the right entry in the join
    rootQuery.currentChildIndex = 0;
    rootQuery.fromClausePosition = [];
    rootQuery.rootEntityPrefix = Aliases_1.getNextRootEntityName();
    var view = new Entity_1.QView(rootQuery.rootEntityPrefix, rootQuery.fromClausePosition, queryDefinition);
    var customEntity = queryDefinition.select;
    view = convertMappedEntitySelect(customEntity, queryDefinition, view, view, 'f');
    return view;
}
exports.view = view;
function convertMappedEntitySelect(customEntity, queryDefinition, view, selectProxy, fieldPrefix) {
    var fieldIndex = 0;
    for (var property in customEntity) {
        var alias = "" + fieldPrefix + ++fieldIndex;
        var value = customEntity[property];
        if (value instanceof Field_1.QField) {
            var field_1 = value.getInstance(view);
            field_1.fieldName = alias;
            field_1.q = view;
            selectProxy[property] = field_1;
        }
        else {
            if (value instanceof Object && !(value instanceof Date)) {
                selectProxy[value] = convertMappedEntitySelect(value, queryDefinition, view, {}, alias + "_");
            }
            else {
                throw "All SELECT clause entries of a Mapped query must be Fields or Functions";
            }
        }
    }
    return view;
}
/**
 * Sub-queries in select clause
 * @param query
 * @returns {IQF}
 */
function field(query) {
    var queryDefinition;
    if (query instanceof Function) {
        queryDefinition = query();
    }
    else {
        queryDefinition = query;
    }
    var customField = queryDefinition.select;
    customField = customField.addSubQuery(queryDefinition);
    // Field query cannot be joined to any other query so don't have set the positional fields
    return customField;
}
exports.field = field;
(function (JoinType) {
    JoinType[JoinType["FULL_JOIN"] = 0] = "FULL_JOIN";
    JoinType[JoinType["INNER_JOIN"] = 1] = "INNER_JOIN";
    JoinType[JoinType["LEFT_JOIN"] = 2] = "LEFT_JOIN";
    JoinType[JoinType["RIGHT_JOIN"] = 3] = "RIGHT_JOIN";
})(exports.JoinType || (exports.JoinType = {}));
var JoinType = exports.JoinType;
var JoinFields = (function () {
    function JoinFields(joinTo) {
        this.joinTo = joinTo;
        if (!(this.joinTo instanceof Entity_1.QEntity)) {
            throw "Right value in join must be a View or an Entity";
        }
    }
    JoinFields.prototype.on = function (joinOperation) {
        var joinChild = this.joinTo;
        joinChild.joinWhereClause = joinOperation(this.joinTo);
        return this.joinTo;
    };
    return JoinFields;
}());
exports.JoinFields = JoinFields;
//# sourceMappingURL=Joins.js.map