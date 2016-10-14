"use strict";
var SQLStringQuery_1 = require("./SQLStringQuery");
/**
 * Created by Papa on 10/14/2016.
 */
var LastObjectTracker = (function () {
    function LastObjectTracker() {
        this.lastObjectMap = {};
        this.currentObjectMap = {};
        this.objectEqualityMap = {};
    }
    LastObjectTracker.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName) {
        // If we already know that this is a new object, no need to keep on checking
        if (!this.objectEqualityMap[entityAlias]) {
            return;
        }
        var lastObject = this.lastObjectMap[entityAlias];
        // If there was no last object
        if (!lastObject) {
            this.objectEqualityMap[entityAlias] = true;
            return;
        }
        // Types are guaranteed to be the same, so:
        // If the last property is not there or is falsy
        if (!lastObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !!resultObject[propertyName];
            return;
        } // If the current property is not there or is falsy
        else if (!resultObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !!lastObject[propertyName];
            return;
        }
        // Both of the properties are truthy
        switch (dataType) {
            case SQLStringQuery_1.SQLDataType.DATE:
                this.objectEqualityMap[entityAlias] = (lastObject[propertyName].getTime() === resultObject[propertyName]);
                getTime();
                ;
                return;
            default:
                this.objectEqualityMap[entityAlias] = (lastObject[propertyName] === resultObject[propertyName]);
                return;
        }
    };
    LastObjectTracker.prototype.getObject = function (entityAlias, resultObject) {
        var currentObject = this.currentObjectMap[entityAlias];
        if (currentObject === resultObject) {
            return currentObject;
        }
        else {
            throw "Unexpected different entity instance for alias " + entityAlias;
        }
    };
    return LastObjectTracker;
}());
exports.LastObjectTracker = LastObjectTracker;
//# sourceMappingURL=LastObjectTracker.js.map