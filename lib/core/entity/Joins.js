"use strict";
var Relation_1 = require("./Relation");
var Aliases_1 = require("./Aliases");
var Entity_1 = require("./Entity");
/**
 * Created by Papa on 10/25/2016.
 */
exports.SUB_SELECT_QUERY = '.subSelect';
function view(query) {
    var queryDefinition;
    if (query instanceof Function) {
        queryDefinition = query();
    }
    else {
        queryDefinition = query;
    }
    var customEntity = queryDefinition.select;
    // When retrieved via the view() function the query is the first one in the list
    var rootQuery = queryDefinition;
    rootQuery.currentChildIndex = 0;
    rootQuery.fromClausePosition = [];
    rootQuery.rootEntityPrefix = Aliases_1.getNextRootEntityName();
    customEntity[exports.SUB_SELECT_QUERY] = queryDefinition;
    return customEntity;
}
exports.view = view;
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
    }
    JoinFields.prototype.on = function (joinOperation) {
        var entity;
        var joinChild = this.joinTo;
        if (this.joinTo instanceof Entity_1.QEntity) {
            entity = this.joinTo;
        }
        else {
            entity = this.joinTo.select;
            entity[exports.SUB_SELECT_QUERY] = joinChild;
        }
        joinChild.joinWhereClause = joinOperation(entity);
        return entity;
    };
    return JoinFields;
}());
exports.JoinFields = JoinFields;
function join(left, right, joinType) {
    var nextChildPosition;
    var joinParent;
    // If left is a Raw Mapped Query
    if (!(left instanceof Entity_1.QEntity)) {
        joinParent = left[exports.SUB_SELECT_QUERY];
    }
    else {
        joinParent = left;
    }
    var joinChild = right;
    joinChild.currentChildIndex = 0;
    nextChildPosition = Relation_1.QRelation.getNextChildJoinPosition(joinParent);
    joinChild.fromClausePosition = nextChildPosition;
    joinChild.joinType = joinType;
    joinChild.rootEntityPrefix = joinParent.rootEntityPrefix;
    return new JoinFields(right);
}
function fullJoin(left, right) {
    return join(left, right, JoinType.FULL_JOIN);
}
exports.fullJoin = fullJoin;
function innerJoin(left, right) {
    return join(left, right, JoinType.INNER_JOIN);
}
exports.innerJoin = innerJoin;
function leftJoin(left, right) {
    return join(left, right, JoinType.LEFT_JOIN);
}
exports.leftJoin = leftJoin;
function rightJoin(left, right) {
    return join(left, right, JoinType.RIGHT_JOIN);
}
exports.rightJoin = rightJoin;
//# sourceMappingURL=Joins.js.map