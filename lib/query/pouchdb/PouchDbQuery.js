"use strict";
var PHQuery_1 = require("../PHQuery");
var Relation_1 = require("../../core/entity/Relation");
var SERVER_ENV = false;
if (SERVER_ENV) {
    var PouchDB = require('pouchdb');
    PouchDB.plugin(require('pouchdb-find'));
}
exports.CLOUDANT_ENTITY = '__entity__';
var JoinFieldNode = (function () {
    function JoinFieldNode(entityName, fieldName, operator) {
        this.entityName = entityName;
        this.fieldName = fieldName;
        this.operator = operator;
    }
    JoinFieldNode.prototype.getJoinCount = function () {
        return 1;
    };
    return JoinFieldNode;
}());
exports.JoinFieldNode = JoinFieldNode;
var JoinFieldJunction = (function () {
    function JoinFieldJunction(children, operator) {
        this.children = children;
        this.operator = operator;
    }
    JoinFieldJunction.prototype.getJoinCount = function () {
        return this.children.map(function (joinField) {
            return joinField.getJoinCount();
        }).reduce(function (previousValue, currentValue) {
            return previousValue + currentValue;
        });
    };
    return JoinFieldJunction;
}());
exports.JoinFieldJunction = JoinFieldJunction;
var PouchDbQuery = (function () {
    function PouchDbQuery(entityName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, queryJson) {
        this.entityName = entityName;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.childQueries = {};
        this.joinFields = [];
        this.fields = ['_id', '_rev'];
        this.queryJson = JSON.parse(JSON.stringify(queryJson));
    }
    PouchDbQuery.prototype.parse = function () {
        this.topLevelOperator = this.queryJson[PHQuery_1.PH_OPERATOR];
        switch (this.topLevelOperator) {
            case '&and':
            case '&or':
                break;
            default:
                throw "Unexpected top level operator " + this.topLevelOperator;
        }
        delete this.queryJson[PHQuery_1.PH_OPERATOR];
        this.topLevelArray = [];
        this.selector = {};
        var objectSelector = [];
        this.selector['$and'] = objectSelector;
        objectSelector[exports.CLOUDANT_ENTITY] = {
            '$eq': this.entityName
        };
        objectSelector[this.topLevelOperator] = this.topLevelArray;
        this.extractSelectFields();
        this.extractSubQueries();
        this.extractJoinFields();
        this.extractFieldOperators();
        for (var propertyName in this.queryJson) {
            throw "Unexpected property '" + propertyName + " in entity '" + this.entityName + "'";
        }
        return this.selector;
    };
    PouchDbQuery.prototype.extractSubQueries = function () {
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
                var childQuery = new PouchDbQuery(relationRecord.entityName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, fragmentJson);
                this.childQueries[propertyName] = childQuery;
                delete this.queryJson[propertyName];
            }
        }
    };
    PouchDbQuery.prototype.addField = function (fieldName) {
        var existingFields = this.fields.filter(function (aFieldName) {
            return aFieldName === fieldName;
        });
        if (existingFields.length > 0) {
            return;
        }
        this.fields.push(fieldName);
    };
    PouchDbQuery.prototype.extractJoinFields = function () {
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
    PouchDbQuery.prototype.extractJoinField = function (fieldName, fragment) {
        var _this = this;
        var joinField;
        var _loop_1 = function(operator) {
            var subFragment = fragment[operator];
            var joinToEntity = subFragment[PHQuery_1.PH_JOIN_TO_ENTITY];
            var joinToField = subFragment[PHQuery_1.PH_JOIN_TO_FIELD];
            if (joinToEntity && joinToField) {
                // FIXME: add support for Join Fields
                throw "Join fields are not yet supported";
            }
            else if (joinToEntity || joinToField) {
                throw "Both '" + PHQuery_1.PH_JOIN_TO_ENTITY + "'  && '" + PHQuery_1.PH_JOIN_TO_FIELD + "' must be specified for join: operator '" + operator + "' of " + fieldName + " to " + joinToEntity + "." + joinToField;
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
    PouchDbQuery.prototype.extractSelectFields = function () {
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[this.entityName];
        for (var propertyName in this.queryJson) {
            if (entityPropertyTypeMap[propertyName]) {
                var fragment = this.queryJson[propertyName];
                var typeOfFragment = typeof fragment;
                switch (typeOfFragment) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        this.fields.push(propertyName);
                        delete this.queryJson[propertyName];
                        break;
                    case 'object':
                        if (fragment instanceof Date) {
                            this.fields.push(propertyName);
                            delete this.queryJson[propertyName];
                        }
                        else if (fragment[PHQuery_1.PH_INCLUDE]) {
                            this.fields.push(propertyName);
                            delete fragment[PHQuery_1.PH_INCLUDE];
                        }
                        break;
                    default:
                        throw "Unsupported typeof '" + propertyName + "': " + typeOfFragment;
                }
            }
        }
    };
    PouchDbQuery.prototype.extractFieldOperators = function () {
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[this.entityName];
        for (var propertyName in this.queryJson) {
            if (entityPropertyTypeMap[propertyName]) {
                var fragment = this.queryJson[propertyName];
                var fieldOperator = this.flipFieldOperators(propertyName, fragment);
                this.topLevelArray.push(fieldOperator);
                delete this.queryJson[propertyName];
            }
        }
    };
    /**
     *
     * @param fieldName
     * @param fragment
     *
     * Convert:
     *
     * field: {
     *   $or: [
     *     { $eq: 1 },
     *     { $and: [
     *       { $not: { $lt: 20 } },
     *       { $ne: 2 }
     *     ] }
     *   ]
     * }
     *
     * To:
     *
     * $or: [
     *   { field: { $eq: 1 },
     *   { $and: [
     *     { field: { $not: { $lt: 20 } },
     *     { field: { $ne: 2 }
     *     ]
     *   ]}
     * }
     *
     * Scan for Logical Operators and if present move field reference to just ouside the non-logical operators.
     */
    PouchDbQuery.prototype.flipFieldOperators = function (fieldName, fragment) {
        var _this = this;
        var operators = [];
        for (var operator_1 in fragment) {
            operators.push(operator_1);
        }
        if (operators.length !== 1) {
            throw "Unexpected number of operators [" + operators.length + "] in " + fragment + ".  Expecting 1.";
        }
        var operator = operators[0];
        var flippedFragment = {};
        switch (operator) {
            case '&and':
            case '&or':
                var subFragmentArray = fragment[operator];
                flippedFragment[operator] = subFragmentArray.map(function (subFragment) {
                    return _this.flipFieldOperators(fieldName, subFragment);
                });
            default:
                flippedFragment[fieldName] = fragment;
        }
        return flippedFragment;
    };
    return PouchDbQuery;
}());
exports.PouchDbQuery = PouchDbQuery;
//# sourceMappingURL=PouchDbQuery.js.map