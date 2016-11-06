"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
var IOrderByParser_1 = require("./query/orderBy/IOrderByParser");
/**
 * Created by Papa on 8/20/2016.
 */
(function (SQLDialect) {
    SQLDialect[SQLDialect["SQLITE"] = 0] = "SQLITE";
    SQLDialect[SQLDialect["ORACLE"] = 1] = "ORACLE";
})(exports.SQLDialect || (exports.SQLDialect = {}));
var SQLDialect = exports.SQLDialect;
(function (SQLDataType) {
    SQLDataType[SQLDataType["BOOLEAN"] = 0] = "BOOLEAN";
    SQLDataType[SQLDataType["DATE"] = 1] = "DATE";
    SQLDataType[SQLDataType["NUMBER"] = 2] = "NUMBER";
    SQLDataType[SQLDataType["STRING"] = 3] = "STRING";
})(exports.SQLDataType || (exports.SQLDataType = {}));
var SQLDataType = exports.SQLDataType;
var EntityDefaults = (function () {
    function EntityDefaults() {
        this.map = {};
    }
    EntityDefaults.prototype.getForAlias = function (alias) {
        var defaultsForAlias = this.map[alias];
        if (!defaultsForAlias) {
            defaultsForAlias = {};
            this.map[alias] = defaultsForAlias;
        }
        return defaultsForAlias;
    };
    return EntityDefaults;
}());
exports.EntityDefaults = EntityDefaults;
(function (QueryResultType) {
    // Ordered query result with bridging for all MtOs and OtM
    QueryResultType[QueryResultType["ENTITY_BRIDGED"] = 0] = "ENTITY_BRIDGED";
    // A flat array of values, returned by a on object select
    // Not supporting, requires support for order by (with field aliases) which is not currently implemented
    // ENTITY_FLATTENED,
    // Ordered query result, with objects grouped hierarchically by entity
    QueryResultType[QueryResultType["ENTITY_HIERARCHICAL"] = 1] = "ENTITY_HIERARCHICAL";
    // A flat array of objects, returned by a regular join
    // Not supporting, requires support for order by (with field aliases) which is not currently implemented
    // ENTITY_PLAIN,
    // Ordered query result, with objects grouped hierarchically by mapping
    QueryResultType[QueryResultType["MAPPED_HIERARCHICAL"] = 2] = "MAPPED_HIERARCHICAL";
    // A flat array of objects, returned by a mapped query
    // Not supporting, please use flat query
    // MAPPED_PLAIN,
    // Flat array query result, with no forced ordering or grouping
    QueryResultType[QueryResultType["FLAT"] = 3] = "FLAT";
    // A single field query result, with no forced ordering or grouping
    QueryResultType[QueryResultType["FIELD"] = 4] = "FIELD";
    // Raw result, returned by a SQL string query
    QueryResultType[QueryResultType["RAW"] = 5] = "RAW";
})(exports.QueryResultType || (exports.QueryResultType = {}));
var QueryResultType = exports.QueryResultType;
/**
 * String based SQL query.
 */
var SQLStringQuery = (function (_super) {
    __extends(SQLStringQuery, _super);
    function SQLStringQuery(phJsonQuery, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType) {
        _super.call(this, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
        this.phJsonQuery = phJsonQuery;
        this.queryResultType = queryResultType;
        this.entityDefaults = new EntityDefaults();
        this.orderByParser = IOrderByParser_1.getOrderByParser(queryResultType, rootQEntity, phJsonQuery.select, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, phJsonQuery.orderBy);
    }
    SQLStringQuery.prototype.getFieldMap = function () {
        return this.fieldMap;
    };
    SQLStringQuery.prototype.toSQL = function () {
        var entityName = this.rootQEntity.__entityName__;
        var joinNodeMap = {};
        this.joinTree = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap, entityName);
        var selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults);
        var fromFragment = this.getFROMFragment(null, this.joinTree, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinNodeMap, embedParameters, parameters);
        var orderByFragment = this.getOrderByFragment(this.phJsonQuery.orderBy);
        return "SELECT\n" + selectFragment + "\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment + "\nORDER BY\n  " + orderByFragment;
    };
    SQLStringQuery.prototype.getEntitySchemaRelationFromJoin = function (leftEntity, rightEntity, entityRelation, parentRelation, currentAlias, parentAlias, tableName, joinTypeString, errorPrefix) {
        var rightEntityJoinColumn, leftColumn;
        var leftEntityMetadata = leftEntity.__entityConstructor__;
        var rightEntityMetadata = rightEntity.__entityConstructor__;
        if (rightEntityMetadata.manyToOneMap[entityRelation.relationPropertyName]) {
            rightEntityJoinColumn = this.getEntityManyToOneColumnName(rightEntity, entityRelation.relationPropertyName, parentAlias);
            if (!leftEntityMetadata.idProperty) {
                throw errorPrefix + " Could not find @Id for right entity of join to table  '" + parentRelation.entityName + "." + entityRelation.relationPropertyName + "'";
            }
            leftColumn = this.getEntityPropertyColumnName(leftEntity, leftEntityMetadata.idProperty, currentAlias);
        }
        else if (rightEntityMetadata.oneToManyMap[entityRelation.relationPropertyName]) {
            var rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[entityRelation.relationPropertyName];
            var mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
            if (!mappedByLeftEntityProperty) {
                throw errorPrefix + " Could not find @OneToMany.mappedBy for relation '" + parentRelation.entityName + "." + entityRelation.relationPropertyName + "'.";
            }
            leftColumn = this.getEntityManyToOneColumnName(leftEntity, mappedByLeftEntityProperty, currentAlias);
            if (!rightEntityMetadata.idProperty) {
                throw errorPrefix + " Could not find @Id for right entity of join to table '" + entityRelation.entityName + "' ";
            }
            rightEntityJoinColumn = this.getEntityPropertyColumnName(rightEntity, rightEntityMetadata.idProperty, parentAlias);
        }
        else {
            throw errorPrefix + " Relation '" + parentRelation.entityName + "." + entityRelation.relationPropertyName + "' for table (" + tableName + ") is not listed as @ManyToOne or @OneToMany";
        }
        var fromFragment = "\t" + joinTypeString + " " + tableName + " " + currentAlias;
        fromFragment += "\t\tON " + parentAlias + "." + rightEntityJoinColumn + " = " + currentAlias + "." + leftColumn;
        return fromFragment;
    };
    return SQLStringQuery;
}(SQLStringWhereBase_1.SQLStringWhereBase));
exports.SQLStringQuery = SQLStringQuery;
//# sourceMappingURL=SQLStringQuery.js.map