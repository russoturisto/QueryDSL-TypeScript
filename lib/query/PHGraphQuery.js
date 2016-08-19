"use strict";
/**
 * Created by Papa on 8/15/2016.
 */
(function (GraphFilter) {
    GraphFilter[GraphFilter["ALL"] = 0] = "ALL";
    GraphFilter[GraphFilter["CHILDREN"] = 1] = "CHILDREN";
})(exports.GraphFilter || (exports.GraphFilter = {}));
var GraphFilter = exports.GraphFilter;
var PHQueryDsl = (function () {
    function PHQueryDsl(//
        phJsonQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.phJsonQuery = phJsonQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        //
    }
    PHQueryDsl.prototype.toJSON = function () {
        var fields;
        if (this.phJsonQuery.fields && typeof fields === 'object' && !(fields instanceof Date)) {
            fields = this.phJsonQuery.fields;
            this.validateQuery(this.phJsonQuery.query, this.qEntity.__entityName__);
        }
        else {
            fields = this.phJsonQuery;
        }
        this.validateFieldsAndChildren(fields);
    };
    PHQueryDsl.prototype.validateQuery = function (//
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
    PHQueryDsl.prototype.validateFieldsAndChildren = function (fields) {
        var selectJsonFragment = {};
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
                        selectJsonFragment[propertyName] = queryFragment;
                        break;
                    case 'object':
                        if (queryFragment instanceof Date) {
                            selectJsonFragment[propertyName] = queryFragment.toJSON();
                        }
                        else {
                            throw "Unsupported instanceof '" + propertyName + "' in select clause: " + queryFragment;
                        }
                    default:
                        throw "Unsupported typeof '" + propertyName + "' in select clause: " + typeOfFragment;
                }
            }
            else if (entityRelationPropertyMap[propertyName]) {
                var entityName_1 = entityRelationPropertyMap[propertyName].entityName;
                var qEntity = this.qEntityMap[entityName_1];
                if (!qEntity) {
                    throw "Unknown entity '" + entityName_1 + "' in select clause";
                }
                var phQuery = new PHQuerySelect(queryFragment, qEntity, this.qEntityMap, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap);
                selectJsonFragment[propertyName] = phQuery.toJSON();
            }
        }
    };
    return PHQueryDsl;
}());
exports.PHQueryDsl = PHQueryDsl;
//# sourceMappingURL=PHGraphQuery.js.map