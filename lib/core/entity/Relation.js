"use strict";
(function (EntityRelationType) {
    EntityRelationType[EntityRelationType["ONE_TO_MANY"] = 0] = "ONE_TO_MANY";
    EntityRelationType[EntityRelationType["MANY_TO_ONE"] = 1] = "MANY_TO_ONE";
})(exports.EntityRelationType || (exports.EntityRelationType = {}));
var EntityRelationType = exports.EntityRelationType;
(function (JSONRelationType) {
    // Join of an entity with the ON clause
    JSONRelationType[JSONRelationType["ENTITY_JOIN_ON"] = 0] = "ENTITY_JOIN_ON";
    // Join of an entity via a schema relation
    JSONRelationType[JSONRelationType["ENTITY_SCHEMA_RELATION"] = 1] = "ENTITY_SCHEMA_RELATION";
    // The root entity in a join
    JSONRelationType[JSONRelationType["ENTITY_ROOT"] = 2] = "ENTITY_ROOT";
    // Join of a sub-query (with the ON clause)
    JSONRelationType[JSONRelationType["SUB_QUERY_JOIN_ON"] = 3] = "SUB_QUERY_JOIN_ON";
    // The root sub-query in a join
    JSONRelationType[JSONRelationType["SUB_QUERY_ROOT"] = 4] = "SUB_QUERY_ROOT";
})(exports.JSONRelationType || (exports.JSONRelationType = {}));
var JSONRelationType = exports.JSONRelationType;
var QRelation = (function () {
    function QRelation() {
    }
    QRelation.getPositionAlias = function (rootEntityPrefix, fromClausePosition) {
        return rootEntityPrefix + "_" + fromClausePosition.join('_');
    };
    QRelation.getAlias = function (jsonRelation) {
        return this.getPositionAlias(jsonRelation.rootEntityPrefix, jsonRelation.fromClausePosition);
    };
    QRelation.getParentAlias = function (jsonRelation) {
        var position = jsonRelation.fromClausePosition;
        if (position.length === 0) {
            throw "Cannot find alias of a parent entity for the root entity";
        }
        return this.getPositionAlias(jsonRelation.rootEntityPrefix, position.slice(0, position.length - 1));
    };
    QRelation.createRelatedQEntity = function (joinRelation, entityMapByName) {
        var genericIQEntity = entityMapByName[joinRelation.entityName];
        return new genericIQEntity.__qEntityConstructor__(genericIQEntity.__qEntityConstructor__, genericIQEntity.__entityConstructor__, joinRelation.entityName, joinRelation.fromClausePosition, 
        // always attempt to graph relationPropertyName
        joinRelation.relationPropertyName, joinRelation.joinType);
    };
    QRelation.getNextChildJoinPosition = function (joinParent) {
        var nextChildJoinPosition = joinParent.fromClausePosition.slice();
        nextChildJoinPosition.push(++joinParent.currentChildIndex);
        return nextChildJoinPosition;
    };
    return QRelation;
}());
exports.QRelation = QRelation;
//# sourceMappingURL=Relation.js.map