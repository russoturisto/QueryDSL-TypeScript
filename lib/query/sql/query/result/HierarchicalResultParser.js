/**
 * Created by Papa on 10/16/2016.
 */
"use strict";
var Appliable_1 = require("../../../../core/field/Appliable");
/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
var HierarchicalResultParser = (function () {
    function HierarchicalResultParser() {
        this.currentRowObjectMap = {};
        this.objectEqualityMap = {};
        this.lastRowObjectMap = {};
        this.currentObjectOneToManys = {};
    }
    HierarchicalResultParser.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName, propertyValue) {
        resultObject[propertyName] = propertyValue;
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        // Both last and current objects must exist here
        var lastObject = this.lastRowObjectMap[entityAlias];
        // Both of the properties are truthy
        switch (dataType) {
            case Appliable_1.SQLDataType.DATE:
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
    return HierarchicalResultParser;
}());
exports.HierarchicalResultParser = HierarchicalResultParser;
//# sourceMappingURL=HierarchicalResultParser.js.map