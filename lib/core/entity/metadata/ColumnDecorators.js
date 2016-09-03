"use strict";
/**
 * Created by Papa on 8/20/2016.
 */
/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
function Id() {
    return function (targetObject, propertyKey) {
        var entityMetadata = targetObject;
        if (entityMetadata.idProperty) {
            throw "Cannot set primary key to '" + propertyKey + "', it is already set to '" + entityMetadata.idProperty + "'";
        }
        entityMetadata.idProperty = propertyKey;
    };
}
exports.Id = Id;
/**
 * Annotates columns.
 *
 * @param columnConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Column(columnConfiguration) {
    return function (targetObject, propertyKey) {
        var entityMetadata = targetObject;
        if (!entityMetadata.columnMap) {
            entityMetadata.columnMap = {};
        }
        entityMetadata.columnMap[propertyKey] = columnConfiguration;
    };
}
exports.Column = Column;
/**
 * Annotates columns.
 *
 * @param columnConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function JoinColumn(joinColumnConfiguration) {
    return function (targetObject, propertyKey) {
        var entityMetadata = targetObject;
        if (!entityMetadata.joinColumnMap) {
            entityMetadata.joinColumnMap = {};
        }
        entityMetadata.joinColumnMap[propertyKey] = joinColumnConfiguration;
    };
}
exports.JoinColumn = JoinColumn;
/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
function Transient() {
    return function (targetObject, propertyKey) {
        var entityMetadata = targetObject;
        if (!entityMetadata.transient) {
            entityMetadata.transient = {};
        }
        entityMetadata.transient[propertyKey] = true;
    };
}
exports.Transient = Transient;
/**
 * Specifies a single-valued association to another entity class that has many-to-one multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/ManyToOne.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
function ManyToOne(elements) {
    return function (targetObject, propertyKey) {
        var entityMetadata = targetObject;
        if (!entityMetadata.manyToOneMap) {
            entityMetadata.manyToOneMap = {};
        }
        entityMetadata.manyToOneMap[propertyKey] = elements;
    };
}
exports.ManyToOne = ManyToOne;
/**
 * Specifies a many-valued association with one-to-many multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
function OneToMany(elements) {
    return function (targetObject, propertyKey) {
        var entityMetadata = targetObject;
        if (!entityMetadata.oneToManyMap) {
            entityMetadata.oneToManyMap = {};
        }
        entityMetadata.oneToManyMap[propertyKey] = elements;
    };
}
exports.OneToMany = OneToMany;
//# sourceMappingURL=ColumnDecorators.js.map