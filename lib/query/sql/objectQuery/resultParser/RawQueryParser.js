"use strict";
/**
 * Created by Papa on 10/16/2016.
 */
var RawQueryParser = (function () {
    function RawQueryParser() {
        this.currentResultRow = [];
    }
    RawQueryParser.prototype.addEntity = function (entityAlias, qEntity) {
        return this.currentResultRow;
    };
    RawQueryParser.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName, propertyValue) {
        resultObject.push(propertyValue);
    };
    RawQueryParser.prototype.bufferManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId) {
        resultObject.push(relatedEntityId);
    };
    RawQueryParser.prototype.bufferBlankManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        resultObject.push(null);
    };
    RawQueryParser.prototype.bufferManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject) {
        // Nothing to do, we are working with a flat result array
    };
    RawQueryParser.prototype.bufferBlankManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        // Nothing to do, we are working with a flat result array
    };
    RawQueryParser.prototype.bufferOneToManyStub = function (otmEntityName, otmPropertyName) {
        throw "@OneToMany stubs not allowed in QueryResultType.PLAIN";
    };
    RawQueryParser.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        // Nothing to do, we are working with a flat result array
    };
    RawQueryParser.prototype.bufferBlankOneToMany = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        // Nothing to do, we are working with a flat result array
    };
    RawQueryParser.prototype.flushEntity = function (entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        // Nothing to do, we are working with a flat result array
        return resultObject;
    };
    RawQueryParser.prototype.flushRow = function () {
        this.currentResultRow = [];
    };
    RawQueryParser.prototype.bridge = function (parsedResults, selectClauseFragment) {
        // No bridging needed for Raw Object queries
        return parsedResults;
    };
    return RawQueryParser;
}());
exports.RawQueryParser = RawQueryParser;
//# sourceMappingURL=RawQueryParser.js.map