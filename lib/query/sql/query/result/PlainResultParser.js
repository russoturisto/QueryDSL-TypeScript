"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IObjectResultParser_1 = require("./IObjectResultParser");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this parser is to split a flat row of result set cells into an object graph (just for that row).
 */
var PlainResultParser = (function (_super) {
    __extends(PlainResultParser, _super);
    function PlainResultParser() {
        _super.apply(this, arguments);
    }
    PlainResultParser.prototype.addEntity = function (entityAlias, qEntity) {
        return new qEntity.__entityConstructor__();
    };
    PlainResultParser.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName, propertyValue) {
        resultObject[propertyName] = propertyValue;
    };
    PlainResultParser.prototype.bufferManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationGenericQEntity, relationEntityMetadata, relatedEntityId) {
        this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
    };
    PlainResultParser.prototype.bufferManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = childResultObject;
        var relatedEntityId = childResultObject[relationEntityMetadata.idProperty];
        this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
    };
    PlainResultParser.prototype.bufferBlankManyToOneStub = function (entityAlias, resultObject, propertyName, relationEntityMetadata) {
        // Nothing to do the object simply doesn't have anything in it
    };
    PlainResultParser.prototype.bufferBlankManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        // Nothing to do the object simply doesn't have anything in it
    };
    PlainResultParser.prototype.bufferOneToManyStub = function (otmEntityName, otmPropertyName) {
        throw "@OneToMany stubs not allowed in QueryResultType.PLAIN";
    };
    PlainResultParser.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = [childResultObject];
    };
    PlainResultParser.prototype.bufferBlankOneToMany = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = [];
    };
    PlainResultParser.prototype.flushEntity = function (entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        // Nothing to be done, plain objects don't need to be flushed since they aren't relate do any other rows
        return resultObject;
    };
    PlainResultParser.prototype.flushRow = function () {
        // Nothing to be done, plain rows don't need to be flushed since they aren't relate do any other rows
    };
    PlainResultParser.prototype.bridge = function (parsedResults, selectClauseFragment) {
        // Nothing to be done, plain queries are not bridged
        return parsedResults;
    };
    return PlainResultParser;
}(IObjectResultParser_1.AbstractObjectResultParser));
exports.PlainResultParser = PlainResultParser;
//# sourceMappingURL=PlainResultParser.js.map