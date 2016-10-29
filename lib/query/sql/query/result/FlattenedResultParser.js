"use strict";
/**
 * Created by Papa on 10/16/2016.
 */
var FlattenedResultParser = (function () {
    function FlattenedResultParser() {
        this.currentResultRow = [];
    }
    FlattenedResultParser.prototype.addEntity = function (entityAlias, qEntity) {
        return this.currentResultRow;
    };
    FlattenedResultParser.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName, propertyValue) {
        resultObject.push(propertyValue);
    };
    FlattenedResultParser.prototype.bufferManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationGenericQEntity, relationEntityMetadata, relatedEntityId) {
        resultObject.push(relatedEntityId);
    };
    FlattenedResultParser.prototype.bufferBlankManyToOneStub = function (entityAlias, resultObject, propertyName, relationEntityMetadata) {
        resultObject.push(null);
    };
    FlattenedResultParser.prototype.bufferManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject) {
        // Nothing to do, we are working with a flat result array
    };
    FlattenedResultParser.prototype.bufferBlankManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        // Nothing to do, we are working with a flat result array
    };
    FlattenedResultParser.prototype.bufferOneToManyStub = function (otmEntityName, otmPropertyName) {
        throw "@OneToMany stubs not allowed in QueryResultType.PLAIN";
    };
    FlattenedResultParser.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        // Nothing to do, we are working with a flat result array
    };
    FlattenedResultParser.prototype.bufferBlankOneToMany = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        // Nothing to do, we are working with a flat result array
    };
    FlattenedResultParser.prototype.flushEntity = function (entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        // Nothing to do, we are working with a flat result array
        return resultObject;
    };
    FlattenedResultParser.prototype.flushRow = function () {
        this.currentResultRow = [];
    };
    FlattenedResultParser.prototype.bridge = function (parsedResults, selectClauseFragment) {
        // No bridging needed for ENTITY_FLATTENED Object queries
        return parsedResults;
    };
    return FlattenedResultParser;
}());
exports.FlattenedResultParser = FlattenedResultParser;
//# sourceMappingURL=FlattenedResultParser.js.map