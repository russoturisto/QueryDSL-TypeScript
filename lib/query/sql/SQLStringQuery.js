"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHSQLQuery_1 = require("./PHSQLQuery");
var Relation_1 = require("../../core/entity/Relation");
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
var IOrderByParser_1 = require("./objectQuery/queryParser/IOrderByParser");
var MetadataUtils_1 = require("../../core/entity/metadata/MetadataUtils");
var ColumnAliases_1 = require("../../core/entity/ColumnAliases");
var JoinTreeNode_1 = require("../../core/entity/JoinTreeNode");
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
    QueryResultType[QueryResultType["BRIDGED"] = 0] = "BRIDGED";
    // Ordered query result, with objects grouped hierarchically by entity
    QueryResultType[QueryResultType["HIERARCHICAL"] = 1] = "HIERARCHICAL";
    // Plain query result, with no forced ordering or grouping
    QueryResultType[QueryResultType["PLAIN"] = 2] = "PLAIN";
    // A flat array of values, returned by a regular join
    QueryResultType[QueryResultType["RAW"] = 3] = "RAW";
})(exports.QueryResultType || (exports.QueryResultType = {}));
var QueryResultType = exports.QueryResultType;
/**
 * String based SQL query.
 */
var SQLStringQuery = (function (_super) {
    __extends(SQLStringQuery, _super);
    function SQLStringQuery(phJsonQuery, rootQEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect, queryResultType) {
        var _this = _super.call(this, rootQEntity, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) || this;
        _this.phJsonQuery = phJsonQuery;
        _this.queryResultType = queryResultType;
        _this.columnAliases = new ColumnAliases_1.ColumnAliases();
        _this.entityDefaults = new EntityDefaults();
        _this.orderByParser = IOrderByParser_1.getOrderByParser(queryResultType, rootQEntity, phJsonQuery.select, qEntityMapByName, entitiesRelationPropertyMap, entitiesPropertyTypeMap, phJsonQuery.orderBy);
        return _this;
    }
    SQLStringQuery.prototype.getFieldMap = function () {
        return this.fieldMap;
    };
    /**
     * Useful when a query is executed remotely and a flat result set is returned.  JoinTree is needed to parse that
     * result set.
     */
    SQLStringQuery.prototype.buildJoinTree = function () {
        var entityName = this.rootQEntity.__entityName__;
        var joinNodeMap = {};
        this.joinTree = this.buildFromJoinTree(entityName, this.phJsonQuery.from, joinNodeMap);
        this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, false, []);
    };
    SQLStringQuery.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var entityName = this.rootQEntity.__entityName__;
        var joinNodeMap = {};
        this.joinTree = this.buildFromJoinTree(entityName, this.phJsonQuery.from, joinNodeMap);
        var selectFragment = this.getSELECTFragment(entityName, null, this.phJsonQuery.select, this.joinTree, this.entityDefaults, embedParameters, parameters);
        var fromFragment = this.getFROMFragment(null, this.joinTree, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonQuery.where, 0, joinNodeMap, embedParameters, parameters);
        var orderByFragment = this.getOrderByFragment(this.phJsonQuery.orderBy);
        return "SELECT\n" + selectFragment + "\nFROM\n" + fromFragment + "\nWHERE\n" + whereFragment + "\nORDER BY\n  " + orderByFragment;
    };
    SQLStringQuery.prototype.buildFromJoinTree = function (entityName, joinRelations, joinNodeMap) {
        var jsonTree;
        if (joinRelations.length < 1) {
            var onlyJsonRelation = {
                fromClausePosition: [],
                entityName: entityName,
                joinType: null,
                relationPropertyName: null
            };
            joinRelations.push(onlyJsonRelation);
        }
        var firstRelation = joinRelations[0];
        if (firstRelation.relationPropertyName || firstRelation.joinType || firstRelation.fromClausePosition.length > 0) {
            throw "First table in FROM clause cannot be joined";
        }
        var alias = Relation_1.QRelation.getAlias(firstRelation);
        var firstEntity = Relation_1.QRelation.createRelatedQEntity(firstRelation, this.qEntityMapByName);
        this.qEntityMapByAlias[alias] = firstEntity;
        if (firstEntity != this.rootQEntity) {
            throw "Unexpected first table in FROM clause: " + firstRelation.entityName + ", expecting: " + this.rootQEntity.__entityName__;
        }
        jsonTree = new JoinTreeNode_1.JoinTreeNode(firstRelation, [], null);
        joinNodeMap[alias] = jsonTree;
        for (var i = 1; i < joinRelations.length; i++) {
            var joinRelation = joinRelations[i];
            if (!joinRelation.relationPropertyName) {
                throw "Table " + (i + 1) + " in FROM clause is missing relationPropertyName";
            }
            if (!joinRelation.joinType) {
                throw "Table " + (i + 1) + " in FROM clause is missing joinType";
            }
            var parentAlias = Relation_1.QRelation.getParentAlias(joinRelation);
            if (!joinNodeMap[parentAlias]) {
                throw "Missing parent entity for alias " + parentAlias + ", on table " + (i + 1) + " in FROM clause";
            }
            var leftNode = joinNodeMap[parentAlias];
            var rightNode = new JoinTreeNode_1.JoinTreeNode(joinRelation, [], leftNode);
            leftNode.addChildNode(rightNode);
            alias = Relation_1.QRelation.getAlias(joinRelation);
            var rightEntity = Relation_1.QRelation.createRelatedQEntity(joinRelation, this.qEntityMapByName);
            this.qEntityMapByAlias[alias] = rightEntity;
            if (!rightEntity) {
                throw "Could not find entity " + joinRelation.entityName + " for table " + (i + 1) + " in FROM clause";
            }
            if (joinNodeMap[alias]) {
                throw "Alias '" + alias + "' used more than once in the FROM clause.";
            }
            joinNodeMap[alias] = rightNode;
        }
        return jsonTree;
    };
    SQLStringQuery.prototype.getColumnSelectFragment = function (propertyName, tableAlias, columnName, existingSelectFragment) {
        var columnAlias = this.columnAliases.addAlias(tableAlias, propertyName);
        var columnSelect = tableAlias + "." + columnName + " as " + columnAlias + "\n";
        if (existingSelectFragment) {
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
                case PHSQLQuery_1.JoinType.INNER_JOIN:
                    joinTypeString = 'INNER JOIN';
                    break;
                case PHSQLQuery_1.JoinType.LEFT_JOIN:
                    joinTypeString = 'LEFT JOIN';
                    break;
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