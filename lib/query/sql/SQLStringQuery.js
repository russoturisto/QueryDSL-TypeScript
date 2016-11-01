"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Relation_1 = require("../../core/entity/Relation");
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
var IOrderByParser_1 = require("./query/orderBy/IOrderByParser");
var MetadataUtils_1 = require("../../core/entity/metadata/MetadataUtils");
var Aliases_1 = require("../../core/entity/Aliases");
var Joins_1 = require("../../core/entity/Joins");
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
    QueryResultType[QueryResultType["ENTITY_FLATTENED"] = 1] = "ENTITY_FLATTENED";
    // Ordered query result, with objects grouped hierarchically by entity
    QueryResultType[QueryResultType["ENTITY_HIERARCHICAL"] = 2] = "ENTITY_HIERARCHICAL";
    // A flat array of objects, returned by a regular join
    QueryResultType[QueryResultType["ENTITY_PLAIN"] = 3] = "ENTITY_PLAIN";
    // Ordered query result, with objects grouped hierarchically by mapping
    QueryResultType[QueryResultType["MAPPED_HIERARCHICAL"] = 4] = "MAPPED_HIERARCHICAL";
    // A flat array of objects, returned by a mapped query
    QueryResultType[QueryResultType["MAPPED_PLAIN"] = 5] = "MAPPED_PLAIN";
    // Flat array query result, with no forced ordering or grouping
    QueryResultType[QueryResultType["FLAT"] = 6] = "FLAT";
    // A single field query result, with no forced ordering or grouping
    QueryResultType[QueryResultType["FIELD"] = 7] = "FIELD";
    // Raw result, returned by a SQL string query
    QueryResultType[QueryResultType["RAW"] = 8] = "RAW";
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
        this.columnAliases = new Aliases_1.ColumnAliases();
        this.entityDefaults = new EntityDefaults();
        this.orderByParser = IOrderByParser_1.getOrderByParser(queryResultType, rootQEntity, phJsonQuery.select, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, phJsonQuery.orderBy);
    }
    SQLStringQuery.prototype.getFieldMap = function () {
        return this.fieldMap;
    };
    SQLStringQuery.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var entityName = this.rootQEntity.__entityName__;
        var joinNodeMap = {};
        this.joinTree = this.buildFromJoinTree(this.phJsonQuery.from, joinNodeMap, entityName);
        var selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, embedParameters, parameters);
        var fromFragment = this.getFROMFragment(null, this.joinTree, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinNodeMap, embedParameters, parameters);
        var orderByFragment = this.getOrderByFragment(this.phJsonQuery.orderBy);
        return "SELECT\n" + selectFragment + "\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment + "\nORDER BY\n  " + orderByFragment;
    };
    SQLStringQuery.prototype.getSimpleColumnFragment = function (propertyName, tableAlias, columnName, existingFragment, forSelectClause) {
        if (!forSelectClause) {
            return tableAlias + "." + columnName;
        }
        var columnAlias = this.columnAliases.addAlias(tableAlias, propertyName);
        var columnSelect = tableAlias + "." + columnName + " as " + columnAlias + "\n";
        if (existingFragment) {
            columnSelect = "\t, " + columnSelect;
        }
        else {
            columnSelect = "\t" + columnSelect;
        }
        return columnSelect;
    };
    SQLStringQuery.prototype.getComplexColumnFragment = function (value, columnName, existingFragment, forSelectClause) {
        var selectSqlFragment = value.tableAlias + "." + columnName;
        selectSqlFragment = this.sqlAdaptor.getFunctionAdaptor().getFunctionCalls(value, selectSqlFragment, this.qEntityMapByAlias, true);
        if (!forSelectClause) {
            return selectSqlFragment;
        }
        var columnSelect = selectSqlFragment + " as " + value.fieldAlias + "\n";
        if (existingFragment) {
            columnSelect = "\t, " + columnSelect;
        }
        else {
            columnSelect = "\t" + columnSelect;
        }
        return columnSelect;
    };
    SQLStringQuery.prototype.getFROMFragment = function (parentTree, currentTree, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var fromFragment = '\t';
        var currentRelation = currentTree.jsonRelation;
        var currentAlias = Relation_1.QRelation.getAlias(currentRelation);
        var qEntity = this.qEntityMapByAlias[currentAlias];
        var tableName = this.getTableName(qEntity);
        if (!parentTree) {
            fromFragment += tableName + " " + currentAlias;
        }
        else {
            var parentRelation = parentTree.jsonRelation;
            var parentAlias = Relation_1.QRelation.getAlias(parentRelation);
            var leftEntity = this.qEntityMapByAlias[parentAlias];
            var rightEntity = this.qEntityMapByAlias[currentAlias];
            var joinTypeString = void 0;
            switch (currentRelation.joinType) {
                case Joins_1.JoinType.FULL_JOIN:
                    if (this.queryResultType !== QueryResultType.FLAT) {
                        throw "Full Joins only allowed in flat queries";
                    }
                    joinTypeString = 'FULL JOIN';
                    break;
                case Joins_1.JoinType.INNER_JOIN:
                    joinTypeString = 'INNER JOIN';
                    break;
                case Joins_1.JoinType.LEFT_JOIN:
                    joinTypeString = 'LEFT JOIN';
                    break;
                case Joins_1.JoinType.RIGHT_JOIN:
                    if (this.queryResultType !== QueryResultType.FLAT) {
                        throw "Full Joins only allowed in flat queries";
                    }
                    joinTypeString = 'RIGHT JOIN';
                default:
                    throw "Unsupported join type: " + currentRelation.joinType;
            }
            // FIXME: figure out why the switch statement above quit working
            /*			if (joinRelation.joinType === <number>JoinType.INNER_JOIN) {
             joinTypeString = 'INNER JOIN';
             } else if (joinRelation.joinType === <number>JoinType.LEFT_JOIN) {
             joinTypeString = 'LEFT JOIN';
             } else {
             throw `Unsupported join type: ${joinRelation.joinType}`;
             }*/
            var rightEntityJoinColumn = void 0, leftColumn = void 0;
            var leftEntityMetadata = leftEntity.__entityConstructor__;
            var rightEntityMetadata = rightEntity.__entityConstructor__;
            var errorPrefix = 'Error building FROM: ';
            if (rightEntityMetadata.manyToOneMap[currentRelation.relationPropertyName]) {
                rightEntityJoinColumn = this.getEntityManyToOneColumnName(rightEntity, currentRelation.relationPropertyName, parentAlias);
                if (!leftEntityMetadata.idProperty) {
                    throw errorPrefix + " Could not find @Id for right entity of join to table  '" + parentRelation.entityName + "." + currentRelation.relationPropertyName + "'";
                }
                leftColumn = this.getEntityPropertyColumnName(leftEntity, leftEntityMetadata.idProperty, currentAlias);
            }
            else if (rightEntityMetadata.oneToManyMap[currentRelation.relationPropertyName]) {
                var rightEntityOneToManyMetadata = rightEntityMetadata.oneToManyMap[currentRelation.relationPropertyName];
                var mappedByLeftEntityProperty = rightEntityOneToManyMetadata.mappedBy;
                if (!mappedByLeftEntityProperty) {
                    throw errorPrefix + " Could not find @OneToMany.mappedBy for relation '" + parentRelation.entityName + "." + currentRelation.relationPropertyName + "'.";
                }
                leftColumn = this.getEntityManyToOneColumnName(leftEntity, mappedByLeftEntityProperty, currentAlias);
                if (!rightEntityMetadata.idProperty) {
                    throw errorPrefix + " Could not find @Id for right entity of join to table '" + currentRelation.entityName + "' ";
                }
                rightEntityJoinColumn = this.getEntityPropertyColumnName(rightEntity, rightEntityMetadata.idProperty, parentAlias);
            }
            else {
                throw errorPrefix + " Relation '" + parentRelation.entityName + "." + currentRelation.relationPropertyName + "' for table (" + tableName + ") is not listed as @ManyToOne or @OneToMany";
            }
            fromFragment += "\t" + joinTypeString + " " + tableName + " " + currentAlias;
            // TODO: add support for custom JOIN ON clauses
            fromFragment += "\t\tON " + parentAlias + "." + rightEntityJoinColumn + " = " + currentAlias + "." + leftColumn;
        }
        for (var i = 0; i < currentTree.childNodes.length; i++) {
            var childTreeNode = currentTree.childNodes[i];
            fromFragment += this.getFROMFragment(currentTree, childTreeNode, embedParameters, parameters);
        }
        return fromFragment;
    };
    SQLStringQuery.prototype.getEntityManyToOneColumnName = function (qEntity, propertyName, tableAlias) {
        var entityName = qEntity.__entityName__;
        var entityMetadata = qEntity.__entityConstructor__;
        var columnName = MetadataUtils_1.MetadataUtils.getJoinColumnName(propertyName, entityMetadata, tableAlias);
        this.addField(entityName, this.getTableName(qEntity), propertyName, columnName);
        return columnName;
    };
    return SQLStringQuery;
}(SQLStringWhereBase_1.SQLStringWhereBase));
exports.SQLStringQuery = SQLStringQuery;
//# sourceMappingURL=SQLStringQuery.js.map