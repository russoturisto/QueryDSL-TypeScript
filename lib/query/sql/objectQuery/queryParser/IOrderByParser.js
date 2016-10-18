"use strict";
var SQLStringQuery_1 = require("../../SQLStringQuery");
var ExactOrderByParser_1 = require("./ExactOrderByParser");
var ForcedOrderByParser_1 = require("./ForcedOrderByParser");
var FieldInOrderBy_1 = require("../../../../core/field/FieldInOrderBy");
var MetadataUtils_1 = require("../../../../core/entity/metadata/MetadataUtils");
var AbstractOrderByParser = (function () {
    function AbstractOrderByParser(rootQEntity, rootSelectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy) {
        this.rootQEntity = rootQEntity;
        this.rootSelectClauseFragment = rootSelectClauseFragment;
        this.qEntityMapByName = qEntityMapByName;
        this.entitiesRelationPropertyMap = entitiesRelationPropertyMap;
        this.entitiesPropertyTypeMap = entitiesPropertyTypeMap;
        this.orderBy = orderBy;
    }
    AbstractOrderByParser.prototype.getCommonOrderByFragment = function (qEntityMapByAlias, orderByFields) {
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
    return AbstractOrderByParser;
}());
exports.AbstractOrderByParser = AbstractOrderByParser;
function getOrderByParser(queryResultType, rootQEntity, selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy) {
    switch (queryResultType) {
        case SQLStringQuery_1.QueryResultType.BRIDGED:
        case SQLStringQuery_1.QueryResultType.HIERARCHICAL:
            return new ExactOrderByParser_1.ExactOrderByParser(rootQEntity, selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy);
        case SQLStringQuery_1.QueryResultType.PLAIN:
        case SQLStringQuery_1.QueryResultType.RAW:
            return new ForcedOrderByParser_1.ForcedOrderByParser(rootQEntity, selectClauseFragment, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, orderBy);
    }
}
exports.getOrderByParser = getOrderByParser;
//# sourceMappingURL=IOrderByParser.js.map