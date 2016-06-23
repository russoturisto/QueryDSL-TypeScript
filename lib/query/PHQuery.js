"use strict";
var Operation_1 = require("../core/operation/Operation");
/**
 * Created by Papa on 6/22/2016.
 */
exports.PH_JOIN_TO_ENTITY = '__joinToEntity__';
exports.PH_JOIN_TO_FIELD = '__joinToField__';
exports.PH_OPERATOR = '__operator__';
exports.PH_INCLUDE = '__include__';
var PHQuery = (function () {
    function PHQuery(iQEntity, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.iQEntity = iQEntity;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHQuery.prototype.toJSON = function () {
        var jsonFragment = {};
        var entityName = this.qEntity.name;
        var entityRelationPropertyMap = this.entitiesRelationPropertyMap[entityName];
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        for (var propertyName in this.iQEntity) {
            var queryFragment = this.iQEntity[propertyName];
            if (entityPropertyTypeMap[propertyName]) {
                var typeOfFragment = typeof queryFragment;
                switch (typeOfFragment) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        // No additional processing is needed
                        jsonFragment[propertyName] = queryFragment;
                        break;
                    case 'object':
                        if (queryFragment instanceof Date) {
                            jsonFragment[propertyName] = queryFragment.toJSON();
                        }
                        else if (queryFragment instanceof Operation_1.Operation) {
                            jsonFragment[propertyName] = queryFragment.toJSON();
                        }
                        else {
                            throw "Unsupported instanceof '" + propertyName + "': " + queryFragment;
                        }
                    default:
                        throw "Unsupported typeof '" + propertyName + "': " + typeOfFragment;
                }
            }
            else if (entityRelationPropertyMap[propertyName]) {
                var entityName_1 = entityRelationPropertyMap[propertyName];
                var qEntity = this.qEntityMap[entityName_1];
                if (!qEntity) {
                    throw "Unknown entity " + entityName_1;
                }
                var phQuery = new PHQuery(queryFragment, qEntity, this.qEntityMap, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap);
                jsonFragment[propertyName] = phQuery.toJSON();
            }
            else {
                switch (propertyName) {
                    case exports.PH_OPERATOR:
                        jsonFragment[exports.PH_OPERATOR] = queryFragment;
                }
                throw "Unexpected IQEntity propertyName: " + propertyName + " - is not a field or a relation.";
            }
        }
        if (!jsonFragment[exports.PH_OPERATOR]) {
            jsonFragment[exports.PH_OPERATOR] = '&and';
        }
        return jsonFragment;
    };
    return PHQuery;
}());
exports.PHQuery = PHQuery;
//# sourceMappingURL=PHQuery.js.map