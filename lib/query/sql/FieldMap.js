/**
 * Created by Papa on 9/10/2016.
 */
"use strict";
var FieldMap = (function () {
    function FieldMap() {
        this.entityMap = {};
        this.tableMap = {};
    }
    FieldMap.prototype.ensure = function (entityName, tableName) {
        var entityFieldMap = this.entityMap[entityName];
        if (!entityFieldMap) {
            entityFieldMap = new EntityFieldMap(entityName, tableName);
            this.entityMap[entityName] = entityFieldMap;
            this.tableMap[tableName] = entityFieldMap;
        }
        return entityFieldMap;
    };
    FieldMap.prototype.existsByStructure = function (tableName, columnName) {
        var entityFieldMap = this.tableMap[tableName];
        if (!entityFieldMap) {
            return false;
        }
        return !!entityFieldMap.columnMap[columnName];
    };
    FieldMap.prototype.existsByModel = function (entityName, propertyName) {
        var entityFieldMap = this.entityMap[entityName];
        if (!entityFieldMap) {
            return false;
        }
        return !!entityFieldMap.propertyMap[propertyName];
    };
    return FieldMap;
}());
exports.FieldMap = FieldMap;
var EntityFieldMap = (function () {
    function EntityFieldMap(entityName, tableName) {
        this.entityName = entityName;
        this.tableName = tableName;
        this.columnMap = {};
        this.propertyMap = {};
    }
    EntityFieldMap.prototype.ensure = function (propertyName, columnName) {
        var propertyFieldEntry = this.propertyMap[propertyName];
        if (!propertyFieldEntry) {
            propertyFieldEntry = new PropertyFieldEntry(propertyName, columnName);
            this.propertyMap[propertyName] = propertyFieldEntry;
            this.columnMap[columnName] = propertyFieldEntry;
        }
        return propertyFieldEntry;
    };
    return EntityFieldMap;
}());
exports.EntityFieldMap = EntityFieldMap;
var PropertyFieldEntry = (function () {
    function PropertyFieldEntry(propertyName, columnName) {
        this.propertyName = propertyName;
        this.columnName = columnName;
    }
    return PropertyFieldEntry;
}());
exports.PropertyFieldEntry = PropertyFieldEntry;
//# sourceMappingURL=FieldMap.js.map