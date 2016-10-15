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
        if (this.isDifferent(entityAlias, resultObject, propertyName)) {
            return;
        }
        var lastObject = this.lastObjectMap[entityAlias];
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
        if (this.isDifferent(entityAlias, resultObject, propertyName)) {
            return;
        }
        var lastObject = this.lastObjectMap[entityAlias];
        this.objectEqualityMap[entityAlias] = (lastObject[propertyName][manyToOneIdField] === resultObject[propertyName][manyToOneIdField]);
    };
    LastObjectTracker.prototype.isDifferent = function (entityAlias, resultObject, propertyName) {
        // If we already know that this is a new object, no need to keep on checking
        if (!this.objectEqualityMap[entityAlias]) {
            return true;
        }
        var lastObject = this.lastObjectMap[entityAlias];
        // If there was no last object
        if (!lastObject) {
            this.objectEqualityMap[entityAlias] = true;
            return true;
        }
        // Types are guaranteed to be the same, so:
        // If the last property is not there or is falsy
        if (!lastObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !!resultObject[propertyName];
            return false;
        } // If the current property is not there or is falsy
        else if (!resultObject[propertyName]) {
            this.objectEqualityMap[entityAlias] = !!lastObject[propertyName];
            return false;
        }
    };
    return LastObjectTracker;
}());
exports.LastObjectTracker = LastObjectTracker;
//# sourceMappingURL=LastObjectTracker.js.map