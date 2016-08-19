"use strict";
var Relation_1 = require("../../core/entity/Relation");
exports.CLOUDANT_ENTITY = '__entity__';
var SERVER_ENV = false;
if (SERVER_ENV) {
}
var PouchDbGraphQuery = (function () {
    function PouchDbGraphQuery(entityName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, queryJson) {
        this.entityName = entityName;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.childSelectJson = {};
        this.childQueries = {};
        this.fields = ['_id', '_rev'];
        this.queryMap = {};
        this.queriesInOrder = [];
        this.queryJson = JSON.parse(JSON.stringify(queryJson));
    }
    PouchDbGraphQuery.prototype.parse = function () {
        var originalQuerySelector = this.queryJson.selector;
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
        this.extractJoinFields();
        for (var propertyName in this.queryJson) {
            throw "Unexpected property '" + propertyName + " in entity '" + this.entityName + "'";
        }
        return this.selector;
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
                var childQuery = new PouchDbGraphQuery(relationRecord.entityName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, fragmentJson);
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
    PouchDbGraphQuery.prototype.extractJoinFields = function () {
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[this.entityName];
        for (var propertyName in this.queryJson) {
            if (entityPropertyTypeMap[propertyName]) {
                var fragmentJson = this.queryJson[propertyName];
                var joinField = this.extractJoinField(propertyName, fragmentJson);
                if (joinField) {
                    this.joinFields.push(joinField);
                }
                // If there is nothing else specified in the field after the Join has been extracted, remove
                // the field
                if (!Object.keys(fragmentJson).length) {
                    delete this.queryJson[propertyName];
                }
            }
        }
    };
    PouchDbGraphQuery.prototype.extractJoinField = function (fieldName, fragment) {
        var _this = this;
        var joinField;
        var _loop_1 = function(operator) {
            var subFragment = fragment[operator];
            var joinToEntity = subFragment[PH_JOIN_TO_ENTITY];
            var joinToField = subFragment[PH_JOIN_TO_FIELD];
            if (joinToEntity && joinToField) {
                // FIXME: add support for Join Fields
                throw "Join fields are not yet supported";
            }
            else if (joinToEntity || joinToField) {
                throw "Both '" + PH_JOIN_TO_ENTITY + "'  && '" + PH_JOIN_TO_FIELD + "' must be specified for join: operator '" + operator + "' of " + fieldName + " to " + joinToEntity + "." + joinToField;
            }
            else {
                switch (operator) {
                    case '&and':
                    case '&or':
                        var childJoinFields_1 = [];
                        subFragment.forEach(function (childFragment) {
                            var childJoinField = _this.extractJoinField(fieldName, childFragment);
                            if (childJoinField) {
                                childJoinFields_1.push(childJoinField);
                            }
                        });
                        if (childJoinFields_1.length) {
                            joinField = new JoinFieldJunction(childJoinFields_1, operator);
                        }
                    default:
                        break;
                }
            }
        };
        for (var operator in fragment) {
            _loop_1(operator);
        }
        return joinField;
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
                        else if (fragment[PH_INCLUDE]) {
                            this.fields.push(propertyName);
                            delete fragment[PH_INCLUDE];
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