"use strict";
var SQLStringQuery_1 = require("../../SQLStringQuery");
var EntityOrderByParser_1 = require("./EntityOrderByParser");
var FieldInOrderBy_1 = require("../../../../core/field/FieldInOrderBy");
var MetadataUtils_1 = require("../../../../core/entity/metadata/MetadataUtils");
var AbstractEntityOrderByParser = (function () {
    function AbstractEntityOrderByParser(rootSelectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, validator, orderBy) {
        this.rootSelectClauseFragment = rootSelectClauseFragment;
        this.qEntityMapByName = qEntityMapByName;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.validator = validator;
        this.orderBy = orderBy;
    }
    AbstractEntityOrderByParser.prototype.getCommonOrderByFragment = function (qEntityMapByAlias, orderByFields) {
        return orderByFields.map(function (orderByField) {
            var qEntity = qEntityMapByAlias[orderByField.alias];
            var propertyName = orderByField.propertyName;
            var entityMetadata = qEntity.__entityConstructor__;
            var columnName;
            if (orderByField.isManyToOneReference) {
                columnName = MetadataUtils_1.MetadataUtils.getJoinColumnName(propertyName, entityMetadata, orderByField.alias);
            }
            else {
                columnName = MetadataUtils_1.MetadataUtils.getPropertyColumnName(propertyName, entityMetadata, orderByField.alias);
            }
            var orderFieldClause = orderByField.alias + "." + columnName + " ";
            switch (orderByField.sortOrder) {
                case FieldInOrderBy_1.SortOrder.ASCENDING:
                    return orderFieldClause + " ASC";
                case FieldInOrderBy_1.SortOrder.DESCENDING:
                    return orderFieldClause + " DESC";
            }
        }).join(', ');
    };
    return AbstractEntityOrderByParser;
}());
exports.AbstractEntityOrderByParser = AbstractEntityOrderByParser;
function getOrderByParser(queryResultType, selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy) {
    switch (queryResultType) {
        case SQLStringQuery_1.QueryResultType.ENTITY_BRIDGED:
        case SQLStringQuery_1.QueryResultType.ENTITY_HIERARCHICAL:
            return new EntityOrderByParser_1.EntityOrderByParser(selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy);
        //		case QueryResultType.FLAT:
        //		case QueryResultType.FIELD:
        //			return new ExactOrderByParser(rootQEntity, selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy);
        case SQLStringQuery_1.QueryResultType.RAW:
            throw "Query parsing not supported for raw queries";
        default:
            throw "Unexpected queryResultType for an Entity ORDER BY parser: " + queryResultType;
    }
}
exports.getOrderByParser = getOrderByParser;
//# sourceMappingURL=IEntityOrderByParser.js.map