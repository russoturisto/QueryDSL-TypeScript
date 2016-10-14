"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
var Relation_1 = require("../../core/entity/Relation");
/**
 * Created by Papa on 10/2/2016.
 */
var SQLStringNoJoinQuery = (function (_super) {
    __extends(SQLStringNoJoinQuery, _super);
    function SQLStringNoJoinQuery() {
        _super.apply(this, arguments);
    }
    SQLStringNoJoinQuery.prototype.getJoinNodeMap = function () {
        var rootRelation = {
            fromClausePosition: [],
            entityName: this.qEntity.__entityName__,
            joinType: null,
            relationPropertyName: null
        };
        var jsonRootNode = new Relation_1.JoinTreeNode(rootRelation, []);
        var alias = Relation_1.QRelation.getAlias(rootRelation);
        var joinNodeMap = {};
        joinNodeMap[alias] = jsonRootNode;
        return joinNodeMap;
    };
    SQLStringNoJoinQuery.prototype.getTableFragment = function (fromRelation) {
        if (!fromRelation) {
            throw "Expecting exactly one table in FROM clause";
        }
        if (fromRelation.relationPropertyName || fromRelation.joinType || fromRelation.parentEntityAlias) {
            throw "First table in FROM clause cannot be joined";
        }
        var firstEntity = this.qEntityMap[fromRelation.entityName];
        if (firstEntity != this.qEntity) {
            throw "Unexpected first table in FROM clause: " + fromRelation.entityName + ", expecting: " + this.qEntity.__entityName__;
        }
        var fromFragment = "\t" + this.getTableName(firstEntity);
        return fromFragment;
    };
    return SQLStringNoJoinQuery;
}(SQLStringWhereBase_1.SQLStringWhereBase));
exports.SQLStringNoJoinQuery = SQLStringNoJoinQuery;
//# sourceMappingURL=SQLStringNoJoinQuery.js.map