"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IObjectResultParser_1 = require("./IObjectResultParser");
var SQLStringQuery_1 = require("../../SQLStringQuery");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
var HierarchicalResultParser = (function (_super) {
    __extends(HierarchicalResultParser, _super);
    function HierarchicalResultParser() {
        _super.apply(this, arguments);
        this.currentRowObjectMap = {};
        this.objectEqualityMap = {};
        this.lastRowObjectMap = {};
        this.currentObjectOneToManys = {};
    }
    HierarchicalResultParser.prototype.addEntity = function (entityAlias, qEntity) {
        var resultObject = new qEntity.__entityConstructor__();
        this.currentRowObjectMap[entityAlias] = resultObject;
        return resultObject;
    };
    HierarchicalResultParser.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName, propertyValue) {
        resultObject[propertyName] = propertyValue;
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        // Both last and current objects must exist here
        var lastObject = this.lastRowObjectMap[entityAlias];
        // Both of the properties are truthy
        switch (dataType) {
            case SQLStringQuery_1.SQLDataType.DATE:
                this.objectEqualityMap[entityAlias] = (lastObject[propertyName].getTime() === resultObject[propertyName].getTime());
                return;
            default:
                this.objectEqualityMap[entityAlias] = (lastObject[propertyName] === resultObject[propertyName]);
                return;
        }
    };
    HierarchicalResultParser.prototype.isDifferentOrDoesntExist = function (entityAlias, resultObject, propertyName) {
        // If we already know that this is a new object, no need to keep on checking
        if (!this.objectEqualityMap[entityAlias]) {
            return true;
        }
        var lastObject = this.lastRowObjectMap[entityAlias];
        // If there was no last object
        if (!lastObject) {
            this.objectEqualityMap[entityAlias] = false;
            return true;
        }
        // Types are guaranteed to be the same, so:
        // If the last property is not there or is falsy
        if (!lastObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !!resultObject[propertyName];
            return true;
        } // If the current property is not there or is falsy
        else if (!resultObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !!lastObject[propertyName];
            return true;
        }
        return false;
    };
    HierarchicalResultParser.prototype.bufferManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationGenericQEntity, relationEntityMetadata, relatedEntityId) {
        this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
        this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
    };
    HierarchicalResultParser.prototype.addManyToOneReference = function (entityAlias, resultObject, propertyName, manyToOneIdField) {
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        // Both last and current objects must exist here
        var lastObject = this.lastRowObjectMap[entityAlias];
        this.objectEqualityMap[entityAlias] = (lastObject[propertyName][manyToOneIdField] === resultObject[propertyName][manyToOneIdField]);
    };
    HierarchicalResultParser.prototype.bufferBlankManyToOneStub = function (entityAlias, resultObject, propertyName, relationEntityMetadata) {
        this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
    };
    HierarchicalResultParser.prototype.bufferManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = childResultObject;
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        // Both last and current objects must exist here
        var lastObject = this.lastRowObjectMap[entityAlias];
        // @ManyToOne objects will have been merged by now, just check if its the same object
        this.objectEqualityMap[entityAlias] = lastObject[propertyName] === resultObject[propertyName];
    };
    HierarchicalResultParser.prototype.bufferBlankManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
    };
    HierarchicalResultParser.prototype.bufferOneToManyStub = function (otmEntityName, otmPropertyName) {
        throw "@OneToMany stubs not allowed in QueryResultType.HIERARCHICAL";
    };
    HierarchicalResultParser.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = [childResultObject];
        this.addOneToManyCollection(entityAlias, resultObject, propertyName);
    };
    HierarchicalResultParser.prototype.addOneToManyCollection = function (entityAlias, resultObject, propertyName) {
        var currentOtmCollection = resultObject[propertyName];
        this.currentObjectOneToManys[propertyName] = currentOtmCollection;
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        var lastObject = this.lastRowObjectMap[entityAlias];
        var lastOtmCollection = lastObject[propertyName];
        // Now both arrays are guaranteed to exist
        // TODO: verify assumption below:
        // For @OneToMany collections, if existence of last child object changes it must be a new object
        if (!lastOtmCollection.length) {
            if (currentOtmCollection.length) {
                this.objectEqualityMap[entityAlias] = false;
            }
        }
        else if (!currentOtmCollection.length) {
            if (lastOtmCollection.length) {
                this.objectEqualityMap[entityAlias] = false;
            }
        }
        // Otherwise if it still exists
    };
    HierarchicalResultParser.prototype.bufferBlankOneToMany = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = [];
        this.addOneToManyCollection(entityAlias, resultObject, propertyName);
    };
    HierarchicalResultParser.prototype.flushEntity = function (entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        return this.mergeEntity(entityAlias, resultObject);
    };
    HierarchicalResultParser.prototype.mergeEntity = function (entityAlias, resultObject) {
        var isSameObjectAsLastRow = this.objectEqualityMap[entityAlias];
        this.objectEqualityMap[entityAlias] = true;
        var oneToManys = this.currentObjectOneToManys;
        this.currentObjectOneToManys = {};
        // If it's a new object
        if (!isSameObjectAsLastRow) {
            return resultObject;
        }
        // All equality checks have passed - this is the same exact object as last time
        resultObject = this.lastRowObjectMap[entityAlias];
        this.currentRowObjectMap[entityAlias] = resultObject;
        // All @ManyToOnes have been merged automatically (because they are entities themselves)
        // For @OneToManys:
        // If the current one it the same as the last one of the ones in the last entity then it's the same
        // otherwise its new and should be added to the collection
        for (var oneToManyProperty in oneToManys) {
            var currentOneToMany = oneToManys[oneToManyProperty];
            if (currentOneToMany && currentOneToMany.length) {
                // There will always be only one current record, since this is done per result set row
                var currentMto = currentOneToMany[0];
                var existingOneToMany = resultObject[oneToManyProperty];
                if (!existingOneToMany || !existingOneToMany.length) {
                    resultObject[oneToManyProperty] = currentOneToMany;
                }
                else if (existingOneToMany[existingOneToMany.length - 1] !== currentMto) {
                    existingOneToMany.push(currentMto);
                }
            }
        }
        return resultObject;
    };
    HierarchicalResultParser.prototype.flushRow = function () {
        this.lastRowObjectMap = this.currentRowObjectMap;
        this.currentRowObjectMap = {};
    };
    HierarchicalResultParser.prototype.bridge = function (parsedResults, selectClauseFragment) {
        // Nothing to be done, hierarchical queries are not bridged
        return parsedResults;
    };
    return HierarchicalResultParser;
}(IObjectResultParser_1.AbstractObjectResultParser));
exports.HierarchicalResultParser = HierarchicalResultParser;
//# sourceMappingURL=HierarchicalResultParser.js.map