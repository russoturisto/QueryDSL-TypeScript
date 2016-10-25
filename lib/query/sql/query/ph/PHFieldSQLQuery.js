"use strict";
var Field_1 = require("../../../../core/field/Field");
var Relation_1 = require("../../../../core/entity/Relation");
var Entity_1 = require("../../../../core/entity/Entity");
var PHSQLQuery_1 = require("../../PHSQLQuery");
var Appliable_1 = require("../../../../core/field/Appliable");
var OneToManyRelation_1 = require("../../../../core/entity/OneToManyRelation");
var PHFieldSQLQuery = (function () {
    // private qEntityMap: {[entityName: string]: QEntity<any>},
    //	private entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
    //		private entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
    function PHFieldSQLQuery(phRawFieldSqlQuery) {
        this.phRawFieldSqlQuery = phRawFieldSqlQuery;
    }
    PHFieldSQLQuery.prototype.toJSON = function () {
        var select = this.phRawFieldSqlQuery.select.toJSON();
        var from = this.phRawFieldSqlQuery.from.map(function (fromEntity) {
            if (fromEntity instanceof Entity_1.QEntity) {
                return fromEntity.getRelationJson();
            }
            else {
                return getSubSelectInFromClause(fromEntity);
            }
        });
        return {
            from: from,
            type: Appliable_1.JSONClauseObjectType.FIELD_QUERY
        };
    };
    return PHFieldSQLQuery;
}());
exports.PHFieldSQLQuery = PHFieldSQLQuery;
function getSubSelectInFromClause(subSelectEntity) {
    var rawQuery = subSelectEntity[Relation_1.SUB_SELECT_QUERY];
    if (!rawQuery) {
        throw "Reference to own query is missing in sub-select entity";
    }
    var select = {};
    for (var property in rawQuery.select) {
        var value = rawQuery.select[property];
        if (value instanceof Field_1.QField) {
            select[property] = value.toJSON();
        }
        else if (value instanceof OneToManyRelation_1.QOneToManyRelation) {
            throw "@OneToMany relations can only be used in Entity Queries";
        } // Must be a Field query
        else {
            var rawFieldQuery = value;
            var phFieldQuery = new PHFieldSQLQuery(rawFieldQuery);
            select[property] = phFieldQuery.toJSON();
        }
    }
    var from = rawQuery.from.map(function (fromEntity) {
        if (fromEntity instanceof Entity_1.QEntity) {
            return fromEntity.getRelationJson();
        }
        else {
            return getSubSelectInFromClause(fromEntity);
        }
    });
    var jsonRelation = rawQuery;
    var jsomMappedQuery = {
        currentChildIndex: jsonRelation.currentChildIndex,
        fromClausePosition: jsonRelation.fromClausePosition,
        from: from,
        joinType: jsonRelation.joinType,
        relationType: jsonRelation.relationType,
        rootEntityPrefix: jsonRelation.rootEntityPrefix,
        select: select,
    };
    if (rawQuery.where) {
        jsomMappedQuery.where = PHSQLQuery_1.PHAbstractSQLQuery.whereClauseToJSON(rawQuery.where);
    }
    if (rawQuery.orderBy) {
        TODO: work;
        here;
        next;
    }
    return jsomMappedQuery;
}
exports.getSubSelectInFromClause = getSubSelectInFromClause;
//# sourceMappingURL=PHFieldSQLQuery.js.map