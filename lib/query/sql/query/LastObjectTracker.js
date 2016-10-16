"use strict";
var SQLStringQuery_1 = require("../SQLStringQuery");
/**
 * Created by Papa on 10/14/2016.
 */
var LastObjectTracker = (function () {
    function LastObjectTracker() {
        this.currentRowObjectMap = {};
        this.objectEqualityMap = {};
        this.lastRowObjectMap = {};
        this.currentObjectOneToManys = {};
    }
    LastObjectTracker.prototype.addEntity = function (entityAlias, resultObject) {
        this.currentRowObjectMap[entityAlias] = resultObject;
    };
    LastObjectTracker.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName) {
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
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
    LastObjectTracker.prototype.addManyToOneReference = function (entityAlias, resultObject, propertyName, manyToOneIdField) {
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        // If the object doesn't exist now then it must not have existed before
        if (!resultObject[propertyName]) {
            return;
        }
        var lastObject = this.lastRowObjectMap[entityAlias];
        this.objectEqualityMap[entityAlias] = (lastObject[propertyName][manyToOneIdField] === resultObject[propertyName][manyToOneIdField]);
    };
    LastObjectTracker.prototype.addManyToOneObject = function (entityAlias, resultObject, propertyName) {
        if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
            return;
        }
        var lastObject = this.lastRowObjectMap[entityAlias];
        // @ManyToOne objects will have been merged by now, just check if its the same object
        this.objectEqualityMap[entityAlias] = lastObject[propertyName] === resultObject[propertyName];
    };
    LastObjectTracker.prototype.addOneToManyCollection = function (entityAlias, resultObject, propertyName) {
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
    LastObjectTracker.prototype.isDifferentOrDoesntExist = function (entityAlias, resultObject, propertyName) {
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
    LastObjectTracker.prototype.mergeEntity = function (entityAlias, resultObject) {
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
    LastObjectTracker.prototype.flushRow = function () {
        this.lastRowObjectMap = this.currentRowObjectMap;
        this.currentRowObjectMap = {};
    };
    return LastObjectTracker;
}());
exports.LastObjectTracker = LastObjectTracker;
//# sourceMappingURL=LastObjectTracker.js.map