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
    function SQLStringNoJoinQuery(qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
        this.qEntity = qEntity;
    }
    SQLStringNoJoinQuery.prototype.getTableFragment = function (fromRelation) {
        if (!fromRelation) {
            throw "Expecting exactly one table in UPDATE/DELETE clause";
        }
        if (fromRelation.relationPropertyName || fromRelation.joinType) {
            throw "Table in UPDATE/DELETE clause cannot be joined";
        }
        var firstEntity = this.qEntityMapByAlias[Relation_1.QRelation.getAlias(fromRelation)];
        if (firstEntity != this.qEntity) {
            throw "Unexpected table in UPDATE/DELETE clause: " + fromRelation.entityName + ", expecting: " + this.qEntity.__entityName__;
        }
        var fromFragment = "\t" + this.getTableName(firstEntity);
        return fromFragment;
    };
    return SQLStringNoJoinQuery;
}(SQLStringWhereBase_1.SQLStringWhereBase));
exports.SQLStringNoJoinQuery = SQLStringNoJoinQuery;
//# sourceMappingURL=SQLStringNoJoinQuery.js.map