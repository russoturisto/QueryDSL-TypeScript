"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HierarchicalResultParser_1 = require("../HierarchicalResultParser");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
var HierarchicalEntityResultParser = (function (_super) {
    __extends(HierarchicalEntityResultParser, _super);
    function HierarchicalEntityResultParser() {
        _super.apply(this, arguments);
        this.currentRowObjectMap = {};
        this.objectEqualityMap = {};
        this.lastRowObjectMap = {};
        this.currentObjectOneToManys = {};
    }
    HierarchicalEntityResultParser.prototype.addEntity = function (entityAlias, qEntity) {
        var resultObject = new qEntity.__entityConstructor__();
        this.currentRowObjectMap[entityAlias] = resultObject;
        return resultObject;
    };
    HierarchicalEntityResultParser.prototype.bufferManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationGenericQEntity, relationEntityMetadata, relatedEntityId) {
        this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
        this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
    };
    HierarchicalEntityResultParser.prototype.addManyToOneReference = function (entityAlias, resultObject, propertyName, manyToOneIdField) {
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        // Both last and current objects must exist here
        var lastObject = this.lastRowObjectMap[entityAlias];
        this.objectEqualityMap[entityAlias] = (lastObject[propertyName][manyToOneIdField] === resultObject[propertyName][manyToOneIdField]);
    };
    HierarchicalEntityResultParser.prototype.bufferBlankManyToOneStub = function (entityAlias, resultObject, propertyName, relationEntityMetadata) {
        this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
    };
    HierarchicalEntityResultParser.prototype.bufferManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = childResultObject;
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        // Both last and current objects must exist here
        var lastObject = this.lastRowObjectMap[entityAlias];
        // @ManyToOne objects will have been merged by now, just check if its the same object
        this.objectEqualityMap[entityAlias] = lastObject[propertyName] === resultObject[propertyName];
    };
    HierarchicalEntityResultParser.prototype.addManyToOneStub = function (resultObject, propertyName, relationEntityMetadata, relatedEntityId) {
        var manyToOneStub = {};
        resultObject[propertyName] = manyToOneStub;
        manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
    };
    HierarchicalEntityResultParser.prototype.bufferBlankManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
    };
    HierarchicalEntityResultParser.prototype.bufferOneToManyStub = function (otmEntityName, otmPropertyName) {
        throw "@OneToMany stubs not allowed in QueryResultType.HIERARCHICAL";
    };
    HierarchicalEntityResultParser.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = [childResultObject];
        this.addOneToManyCollection(entityAlias, resultObject, propertyName);
    };
    HierarchicalEntityResultParser.prototype.bufferBlankOneToMany = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = [];
        this.addOneToManyCollection(entityAlias, resultObject, propertyName);
    };
    HierarchicalEntityResultParser.prototype.flushEntity = function (entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        return this.mergeEntity(entityAlias, resultObject);
    };
    HierarchicalEntityResultParser.prototype.bridge = function (parsedResults, selectClauseFragment) {
        // Nothing to be done, hierarchical queries are not bridged
        return parsedResults;
    };
    return HierarchicalEntityResultParser;
}(HierarchicalResultParser_1.HierarchicalResultParser));
exports.HierarchicalEntityResultParser = HierarchicalEntityResultParser;
//# sourceMappingURL=HierarchicalEntityResultParser.js.map