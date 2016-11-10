"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringWhereBase_1 = require("./SQLStringWhereBase");
var Relation_1 = require("../../core/entity/Relation");
var SQLStringNoJoinQuery_1 = require("./SQLStringNoJoinQuery");
var MetadataUtils_1 = require("../../core/entity/metadata/MetadataUtils");
/**
 * Created by Papa on 10/2/2016.
 */
var SQLStringUpdate = (function (_super) {
    __extends(SQLStringUpdate, _super);
    function SQLStringUpdate(phJsonUpdate, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect) {
        _super.call(this, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap, dialect);
        this.phJsonUpdate = phJsonUpdate;
    }
    SQLStringUpdate.prototype.toSQL = function (embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        if (!this.phJsonUpdate.update) {
            throw "Expecting exactly one table in FROM clause";
        }
        var entityName = this.qEntity.__entityName__;
        var updateAlias = Relation_1.QRelation.getAlias(this.phJsonUpdate.update);
        var updateFragment = this.getTableFragment(this.phJsonUpdate.update);
        var setFragment = this.getSetFragment(updateAlias, entityName, this.phJsonUpdate.set);
        var whereFragment = '';
        var jsonQuery = this.phJsonUpdate;
        if (jsonQuery.where) {
            whereFragment = "\nWHERE\n" + this.getWHEREFragment(jsonQuery.where, '');
        }
        return "UPDATE\n" + updateFragment + "\nSET\n" + setFragment + whereFragment;
    };
    SQLStringUpdate.prototype.getSetFragment = function (updateAlias, entityName, setClauseFragment, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var qEntity = this.qEntityMapByAlias[updateAlias];
        var entityMetadata = qEntity.__entityConstructor__;
        var entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];
        var entityRelationMap = this.entitiesRelationPropertyMap[entityName];
        var setFragments = [];
        for (var propertyName in setClauseFragment) {
            var value = setClauseFragment[propertyName];
            // Skip undefined values
            if (value === undefined) {
                continue;
            }
            this.validator.validateUpdateProperty(propertyName, qEntity.__entityName__);
            var columnName = void 0;
            if (entityPropertyTypeMap[propertyName]) {
                columnName = this.getEntityPropertyColumnName(qEntity, propertyName, null);
                var field = qEntity.__entityFieldMap__[propertyName];
                if (!field) {
                    throw "Did not find field '" + entityName + "." + propertyName + "' used in the WHERE clause.";
                }
            }
            else if (entityRelationMap[propertyName]) {
                if (entityMetadata.manyToOneMap[propertyName]) {
                    columnName = MetadataUtils_1.MetadataUtils.getJoinColumnName(propertyName, entityMetadata);
                    var relation = qEntity.__entityRelationMap__[propertyName];
                    if (!relation) {
                        throw "Did not find field '" + entityName + "." + propertyName + "' used in the WHERE clause.";
                    }
                }
                else {
                    throw "Cannot use @OneToMany property '" + entityName + "." + propertyName + "' for assignment in the SET clause.";
                }
            }
            else {
                throw "Unexpected property '" + propertyName + "' on entity '" + entityName + "' in SET clause.";
            }
            var fieldValue = this.getFieldValue(value, SQLStringWhereBase_1.ClauseType.WHERE_CLAUSE);
            setFragments.push("\t" + columnName + " = " + fieldValue);
        }
        return setFragments.join(', \n');
    };
    return SQLStringUpdate;
}(SQLStringNoJoinQuery_1.SQLStringNoJoinQuery));
exports.SQLStringUpdate = SQLStringUpdate;
//# sourceMappingURL=SQLStringUpdate.js.map