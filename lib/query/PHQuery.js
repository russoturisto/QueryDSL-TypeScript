"use strict";
/**
 * Created by Papa on 6/22/2016.
 */
exports.PH_JOIN_TO_ENTITY = '__joinToEntity__';
exports.PH_JOIN_TO_FIELD = '__joinToField__';
exports.PH_OPERATOR = '__operator__';
exports.PH_INCLUDE = '__include__';
var PHQuery = (function () {
    function PHQuery(iEntityQuery, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.iEntityQuery = iEntityQuery;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.selectFragment = new PHQuerySelect(iEntityQuery.select, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
    }
    PHQuery.prototype.toJSON = function () {
        var selectJsonFragment = this.selectFragment.toJSON();
        var whereJsonFragment = this.iEntityQuery.where;
        return {
            select: selectJsonFragment,
            where: whereJsonFragment
        };
    };
    return PHQuery;
}());
exports.PHQuery = PHQuery;
var PHQuerySelect = (function () {
    function PHQuerySelect(iEntitySelect, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap) {
        this.iEntitySelect = iEntitySelect;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
    }
    PHQuerySelect.prototype.toJSON = function () {
        var selectJsonFragment = {};
        var entityName = this.qEntity.__entityName__;
        var entityRelationPropertyMap = this.entitiesRelationPropertyMap[entityName];
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        for (var propertyName in this.iEntitySelect) {
            var queryFragment = this.iEntitySelect[propertyName];
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
            else {
                throw "Unexpected IQEntity propertyName: '" + propertyName + "' in select clause - is not a field or a relation.";
            }
        }
        if (!selectJsonFragment[exports.PH_OPERATOR]) {
            selectJsonFragment[exports.PH_OPERATOR] = '&and';
        }
        return selectJsonFragment;
    };
    return PHQuerySelect;
}());
exports.PHQuerySelect = PHQuerySelect;
//# sourceMappingURL=PHQuery.js.map