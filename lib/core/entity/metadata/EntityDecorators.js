"use strict";
/**
 * Annotates entities.
 *
 * @param entityConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Entity(entityConfiguration) {
    return function (constructor) {
        var entityMetadata = constructor;
        if (entityMetadata.entity) {
            throw "Cannot set @Table, it is already set to '" + JSON.stringify(entityMetadata.entity) + "'";
        }
        if (!entityConfiguration) {
            entityConfiguration = true;
        }
        entityMetadata.entity = entityConfiguration;
    };
}
exports.Entity = Entity;
/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Table(tableConfiguration) {
    return function (constructor) {
        var entityMetadata = constructor;
        if (entityMetadata.table) {
            throw "Cannot set @Table, it is already set to '" + JSON.stringify(entityMetadata.table) + "'";
        }
        entityMetadata.table = tableConfiguration;
    };
}
exports.Table = Table;
/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function MappedSuperclass() {
    return function (constructor) {
    };
}
exports.MappedSuperclass = MappedSuperclass;
//# sourceMappingURL=EntityDecorators.js.map