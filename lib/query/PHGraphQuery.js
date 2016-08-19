"use strict";
/**
 * Created by Papa on 8/15/2016.
 */
(function (GraphFilter) {
    GraphFilter[GraphFilter["ALL"] = 0] = "ALL";
    GraphFilter[GraphFilter["CHILDREN"] = 1] = "CHILDREN";
})(exports.GraphFilter || (exports.GraphFilter = {}));
var GraphFilter = exports.GraphFilter;
var PHGraphQuery = (function () {
    function PHGraphQuery(//
        phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phJsonQuery = phJsonQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.childMap = {};
        //
    }
    PHGraphQuery.prototype.toJSON = function () {
        var fields;
        if (this.phJsonQuery.fields && typeof fields === 'object' && !(fields instanceof Date)) {
            fields = this.phJsonQuery.fields;
            if (!this.phJsonQuery.filter) {
                this.phJsonQuery.filter = GraphFilter.CHILDREN;
            }
            this.validateQuery(this.phJsonQuery.selector, this.qEntity.__entityName__);
        }
        else {
            fields = this.phJsonQuery;
            this.phJsonQuery = {
                filter: GraphFilter.CHILDREN,
                fields: fields,
                selector: undefined,
                execOrder: undefined
            };
        }
        this.validateFieldsAndChildren(fields);
        this.setExecOrders();
    };
    PHGraphQuery.prototype.setExecOrders = function () {
        var execOrders;
        this.gatherExecOrders(execOrders);
        this.assignMissingExecOrders(execOrders);
    };
    PHGraphQuery.prototype.assignMissingExecOrders = function (execOrders) {
        if (!this.phJsonQuery.execOrder) {
            var currentExecOrder = void 0;
            for (var i = 1; i < execOrders.length; i++) {
                var execOrder = execOrders[i];
                if (!execOrder) {
                    currentExecOrder = i;
                    break;
                }
            }
            if (!currentExecOrder) {
                currentExecOrder = execOrders.length;
            }
            this.phJsonQuery.execOrder = currentExecOrder;
            execOrders[currentExecOrder] = currentExecOrder;
        }
        for (var entityName in this.childMap) {
            var childQuery = this.childMap[entityName];
            childQuery.assignMissingExecOrders(execOrders);
        }
    };
    PHGraphQuery.prototype.gatherExecOrders = function (execOrders) {
        if (this.phJsonQuery.execOrder < 1) {
            throw "Graph Query execution orders must be >= 1";
        }
        if (this.phJsonQuery.execOrder) {
            if (execOrders[this.phJsonQuery.execOrder]) {
                throw "execOrder " + this.phJsonQuery.execOrder + " defined more than once.";
            }
            execOrders[this.phJsonQuery.execOrder] = this.phJsonQuery.execOrder;
        }
        for (var entityName in this.childMap) {
            var childQuery = this.childMap[entityName];
            childQuery.gatherExecOrders(execOrders);
        }
    };
    PHGraphQuery.prototype.validateQuery = function (//
        query, entityName) {
        if (!query) {
            return;
        }
        var entityRelations = this.entitiesRelationPropertyMap[entityName];
        var entityProperties = this.entitiesPropertyTypeMap[entityName];
        var foundKey = false;
        for (var propertyName in query) {
            switch (propertyName) {
                case '$and':
                case '$or':
                    var logicalFragments = query[propertyName];
                    for (var logicalFragment_1 in logicalFragments) {
                        this.validateQuery(logicalFragment_1, entityName);
                    }
                case '$not':
                    var logicalFragment = query[propertyName];
                    this.validateQuery(logicalFragment, entityName);
                default:
                    var queryFieldFragments = propertyName.split('.');
                    var fieldName = void 0;
                    switch (queryFieldFragments.length) {
                        case 1:
                            fieldName = propertyName;
                            break;
                        case 2:
                            var queryEntityName = queryFieldFragments[0];
                            if (queryEntityName !== entityName) {
                                throw "Invalid entity name in query: '" + queryEntityName + "', expecting " + entityName;
                            }
                            fieldName = queryFieldFragments[1];
                            break;
                        default:
                            throw "Invalid number of query fragments in " + propertyName;
                    }
                    var fieldProperty = entityProperties[fieldName];
                    if (!fieldProperty) {
                        throw "Could not find property '" + fieldName + "' for entity '" + entityName + "', NOTE: relations are not supported";
                    }
                    break;
            }
        }
    };
    PHGraphQuery.prototype.validateFieldsAndChildren = function (fields) {
        var fieldsJsonFragment = {};
        var entityName = this.qEntity.__entityName__;
        var entityRelationPropertyMap = this.entitiesRelationPropertyMap[entityName];
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        for (var propertyName in fields) {
            var queryFragment = fields[propertyName];
            if (entityPropertyTypeMap[propertyName]) {
                var typeOfFragment = typeof queryFragment;
                switch (typeOfFragment) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        // No additional processing is needed
                        fieldsJsonFragment[propertyName] = queryFragment;
                        break;
                    case 'object':
                        if (queryFragment instanceof Date) {
                            fieldsJsonFragment[propertyName] = queryFragment.toJSON();
                        }
                        else {
                            throw "Unsupported instanceof '" + propertyName + "' in fields clause: " + queryFragment;
                        }
                    default:
                        throw "Unsupported typeof '" + propertyName + "' in fields clause: " + typeOfFragment;
                }
            }
            else if (entityRelationPropertyMap[propertyName]) {
                var entityName_1 = entityRelationPropertyMap[propertyName].entityName;
                var qEntity = this.qEntityMap[entityName_1];
                if (!qEntity) {
                    throw "Unknown entity '" + entityName_1 + "' in fields clause";
                }
                var phGraphQuery = new PHGraphQuery(queryFragment, qEntity, this.qEntityMap, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap);
                this.childMap[entityName_1] = phGraphQuery;
                fieldsJsonFragment[propertyName] = phGraphQuery.toJSON();
            }
            else {
                throw "Unexpected IEntity propertyName: '" + propertyName + "' in fields clause - not a field or a relation.";
            }
        }
    };
    return PHGraphQuery;
}());
exports.PHGraphQuery = PHGraphQuery;
//# sourceMappingURL=PHGraphQuery.js.map