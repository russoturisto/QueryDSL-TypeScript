"use strict";
var MetadataUtils = (function () {
    function MetadataUtils() {
    }
    MetadataUtils.getRelatedOneToManyConfig = function (manyToOnePropertyName, entityMetadata) {
        for (var oneToManyProperty in entityMetadata.oneToManyMap) {
            var oneToManyConfig = entityMetadata.oneToManyMap[oneToManyProperty];
            if (oneToManyConfig.mappedBy === manyToOnePropertyName) {
                return {
                    propertyName: oneToManyProperty,
                    config: oneToManyConfig
                };
            }
        }
        return null;
    };
    MetadataUtils.getPropertyColumnName = function (propertyName, entityMetadata) {
        var entityName = entityMetadata.name;
        var columnMap = entityMetadata.columnMap;
        var columnName;
        if (columnMap[propertyName]) {
            columnName = columnMap[propertyName].name;
            if (!columnName) {
                throw "Found @Column but not @Column.name for '" + entityName + "." + propertyName + "'.";
            }
        }
        else {
            this.warn("Did not find @Column for '" + entityName + "." + propertyName + "'. Using property name.");
            columnName = propertyName;
        }
        return columnName;
    };
    MetadataUtils.getJoinColumnName = function (propertyName, entityMetadata) {
        var entityName = entityMetadata.name;
        var joinColumnMap = entityMetadata.joinColumnMap;
        var joinColumnName;
        if (joinColumnMap[propertyName]) {
            joinColumnName = joinColumnMap[propertyName].name;
            if (!joinColumnName) {
                throw "Found @JoinColumn but not @JoinColumn.name for '" + entityName + "." + propertyName + "'.";
            }
        }
        else {
            this.warn("Did not find @JoinColumn for '" + entityName + "." + propertyName + "'. Using property name.");
            joinColumnName = propertyName;
        }
        return joinColumnName;
    };
    // static getManyToOneColumnName(
    // 	propertyName:string,
    // 	entityMetadata:EntityMetadata
    // ):string {
    //
    // }
    MetadataUtils.getIdValue = function (entityObject, entityMetadata) {
        var idProperty = entityMetadata.idProperty;
        if (!idProperty) {
            throw "@Id is not defined on entity " + entityMetadata.name;
        }
        return entityObject[idProperty];
    };
    MetadataUtils.getTableName = function (entityMetadata) {
        var tableConfig = entityMetadata.table;
        if (!tableConfig) {
            return null;
        }
        if (tableConfig && !tableConfig.name) {
            throw "@Table is defined on " + entityMetadata.name + ", but @Table.name is not";
        }
        return tableConfig.name;
    };
    MetadataUtils.getOneToManyConfig = function (propertyName, entityMetadata) {
        var oneToManyConfig = entityMetadata.oneToManyMap[propertyName];
        if (!oneToManyConfig) {
            throw "@OneToMany is not defined on " + entityMetadata.name + "." + propertyName;
        }
        return oneToManyConfig;
    };
    MetadataUtils.warn = function (message) {
        console.log(message);
    };
    return MetadataUtils;
}());
exports.MetadataUtils = MetadataUtils;
//# sourceMappingURL=MetadataUtils.js.map