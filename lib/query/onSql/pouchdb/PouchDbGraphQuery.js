"use strict";
var Relation_1 = require("../../core/entity/Relation");
exports.CLOUDANT_ENTITY = '__entity__';
var SERVER_ENV = false;
if (SERVER_ENV) {
}
var PouchDbGraphQuery = (function () {
    function PouchDbGraphQuery(entityName, queryKey, entitiesRelationPropertyMap, entitiesPropertyTypeMap, queryJson) {
        this.entityName = entityName;
        this.queryKey = queryKey;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.childSelectJson = {};
        this.childQueries = {};
        this.fields = ['_id', '_rev'];
        this.queriesInOrder = [];
        this.queryMap = {};
        this.queryJson = JSON.parse(JSON.stringify(queryJson));
    }
    PouchDbGraphQuery.prototype.parseAll = function () {
        var query = this.parse(this.queryJson);
        this.queryMap[this.queryKey] = query;
    };
    PouchDbGraphQuery.prototype.parse = function (queryJson) {
        var originalQuerySelector = queryJson.selector;
        var querySelector = {};
        for (var property in originalQuerySelector) {
            var selectorKey = property;
            var fieldFragments = property.split('.');
            switch (fieldFragments.length) {
                case 1:
                    // nothing to do, field is not qualified
                    break;
                case 2:
                default:
                    if (this.entitiesRelationPropertyMap[fieldFragments[0]]) {
                        var value = querySelector[property];
                        fieldFragments.shift();
                        selectorKey = fieldFragments.join('.');
                    }
            }
            querySelector[selectorKey] = originalQuerySelector[property];
        }
        var objectSelector = [];
        this.selector['$and'] = objectSelector;
        objectSelector[exports.CLOUDANT_ENTITY] = {
            '$eq': this.entityName
        };
        objectSelector.push(querySelector);
        this.extractSelectFields(this.queryJson.fields);
        this.extractSubQueries();
        var pouchDbFindQuery;
        for (var propertyName in this.queryJson) {
            throw "Unexpected property '" + propertyName + " in entity '" + this.entityName + "'";
        }
        return pouchDbFindQuery;
    };
    PouchDbGraphQuery.prototype.extractSubQueries = function () {
        var entityRelationPropertyMap = this.entitiesRelationPropertyMap[this.entityName];
        for (var propertyName in this.queryJson) {
            var relationRecord = entityRelationPropertyMap[propertyName];
            if (relationRecord) {
                switch (relationRecord.relationType) {
                    case Relation_1.RelationType.MANY_TO_ONE:
                        this.addField(propertyName);
                        break;
                    case Relation_1.RelationType.ONE_TO_MANY:
                        break;
                }
                var fragmentJson = this.queryJson[propertyName];
                var childQuery = new PouchDbGraphQuery(relationRecord.entityName, this.entityName + "." + propertyName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, fragmentJson);
                this.childQueries[propertyName] = childQuery;
                delete this.queryJson[propertyName];
            }
        }
    };
    PouchDbGraphQuery.prototype.addField = function (fieldName) {
        var existingFields = this.fields.filter(function (aFieldName) {
            return aFieldName === fieldName;
        });
        if (existingFields.length > 0) {
            return;
        }
        this.fields.push(fieldName);
    };
    PouchDbGraphQuery.prototype.extractSelectFields = function (queryJson) {
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[this.entityName];
        for (var propertyName in queryJson) {
            if (entityPropertyTypeMap[propertyName]) {
                var fragment = queryJson[propertyName];
                var typeOfFragment = typeof fragment;
                switch (typeOfFragment) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        this.fields.push(propertyName);
                        delete queryJson[propertyName];
                        break;
                    case 'object':
                        if (fragment instanceof Date) {
                            this.fields.push(propertyName);
                            delete this.queryJson[propertyName];
                        }
                        break;
                    default:
                        throw "Unsupported typeof '" + propertyName + "': " + typeOfFragment;
                }
            }
        }
    };
    return PouchDbGraphQuery;
}());
exports.PouchDbGraphQuery = PouchDbGraphQuery;
//# sourceMappingURL=PouchDbGraphQuery.js.map