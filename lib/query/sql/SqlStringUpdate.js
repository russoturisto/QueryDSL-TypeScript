"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SQLStringNoJoinQuery_1 = require("./SQLStringNoJoinQuery");
var BooleanField_1 = require("../../core/field/BooleanField");
var DateField_1 = require("../../core/field/DateField");
var NumberField_1 = require("../../core/field/NumberField");
var StringField_1 = require("../../core/field/StringField");
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
        var joinNodeMap = this.getJoinNodeMap();
        var updateFragment = this.getTableFragment(this.phJsonUpdate.update);
        var setFragment = this.getSetFragment(entityName, this.phJsonUpdate.set, embedParameters, parameters);
        var whereFragment = this.getWHEREFragment(this.phJsonUpdate.where, 0, joinNodeMap, embedParameters, parameters);
        return "update\n" + updateFragment + "\nSET\n" + setFragment + "\nWHERE\n" + whereFragment;
    };
    SQLStringUpdate.prototype.getSetFragment = function (entityName, setClauseFragment, embedParameters, parameters) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        var qEntity = this.qEntityMap[entityName];
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
            var columnName = void 0;
            if (entityPropertyTypeMap[propertyName]) {
                columnName = this.getEntityPropertyColumnName(qEntity, propertyName, null);
                if (!embedParameters) {
                    parameters.push(value);
                    value = '?';
                }
                var field = qEntity.__entityFieldMap__[propertyName];
                if (!field) {
                    throw "Did not find field '" + entityName + "." + propertyName + "' used in the WHERE clause.";
                }
                if (field instanceof BooleanField_1.QBooleanField) {
                    value = this.getSetValueFragment(value, entityName, propertyName, this.booleanTypeCheck, embedParameters, parameters);
                }
                else if (field instanceof DateField_1.QDateField) {
                    value = this.getSetValueFragment(value, entityName, propertyName, this.dateTypeCheck, embedParameters, parameters, this.sqlAdaptor.dateToDbQuery);
                }
                else if (field instanceof NumberField_1.QNumberField) {
                    value = this.getSetValueFragment(value, entityName, propertyName, this.numberTypeCheck, embedParameters, parameters);
                }
                else if (field instanceof StringField_1.QStringField) {
                    value = this.getSetValueFragment(value, entityName, propertyName, this.stringTypeCheck, embedParameters, parameters, this.sanitizeStringValue);
                }
                else {
                    throw "Unexpected type '" + field.constructor.name + "' of field '" + entityName + "." + propertyName + "' for assignment in the SET clause.";
                }
            }
            else if (entityRelationMap[propertyName]) {
                if (entityMetadata.manyToOneMap[propertyName]) {
                    columnName = this.getManyToOneColumnName(entityName, propertyName, null, entityMetadata.joinColumnMap);
                    var relation = qEntity.__entityRelationMap__[propertyName];
                    if (!relation) {
                        throw "Did not find field '" + entityName + "." + propertyName + "' used in the WHERE clause.";
                    }
                    var relationQEntity = this.qEntityMap[relation.entityName];
                    var relationEntityMetadata = relationQEntity.__entityConstructor__;
                    // get the parent object's id
                    value = MetadataUtils_1.MetadataUtils.getIdValue(value, relationEntityMetadata);
                    if (!value) {
                        throw "@ManyToOne relation's (" + entityName + ") object @Id value is missing ";
                    }
                    var relationField = relationQEntity.__entityFieldMap__[relationEntityMetadata.idProperty];
                    if (relationField instanceof BooleanField_1.QBooleanField) {
                        value = this.getSetValueFragment(value, entityName, propertyName, this.booleanTypeCheck, embedParameters, parameters);
                    }
                    else if (relationField instanceof DateField_1.QDateField) {
                        value = this.getSetValueFragment(value, entityName, propertyName, this.dateTypeCheck, embedParameters, parameters, this.sqlAdaptor.dateToDbQuery);
                    }
                    else if (relationField instanceof NumberField_1.QNumberField) {
                        value = this.getSetValueFragment(value, entityName, propertyName, this.numberTypeCheck, embedParameters, parameters);
                    }
                    else if (relationField instanceof StringField_1.QStringField) {
                        value = this.getSetValueFragment(value, entityName, propertyName, this.stringTypeCheck, embedParameters, parameters, this.sanitizeStringValue);
                    }
                    else {
                        throw "Unexpected type '" + relation.constructor.name + "' of field '" + entityName + "." + propertyName + "' for assignment in the SET clause.";
                    }
                }
                else {
                    throw "Cannot use @OneToMany property '" + entityName + "." + propertyName + "' for assignment in the SET clause.";
                }
            }
            else {
                throw "Unexpected property '" + propertyName + "' on entity '" + entityName + "' in SET clause.";
            }
            setFragments.push("\t" + columnName + " = " + value);
        }
        return setFragments.join(', \n');
    };
    SQLStringUpdate.prototype.getSetPropertyColumnName = function (qEntity, propertyName) {
        var entityName = qEntity.__entityName__;
        var entityMetadata = qEntity.__entityConstructor__;
        var columnMap = entityMetadata.columnMap;
        return this.getPropertyColumnName(entityName, propertyName, null, columnMap);
    };
    SQLStringUpdate.prototype.getSetValueFragment = function (value, entityName, propertyName, typeCheckFunction, embedParameters, parameters, conversionFunction) {
        if (embedParameters === void 0) { embedParameters = true; }
        if (parameters === void 0) { parameters = null; }
        if (!typeCheckFunction(value)) {
            throw "Unexpected value (" + value + ") for $eq (=) operation on '" + entityName + "." + propertyName + "' used in the SET clause.";
        }
        if (conversionFunction) {
            value = conversionFunction(value, embedParameters);
        }
        if (embedParameters) {
            parameters.push(value);
            value = '?';
        }
        return value;
    };
    return SQLStringUpdate;
}(SQLStringNoJoinQuery_1.SQLStringNoJoinQuery));
exports.SQLStringUpdate = SQLStringUpdate;
//# sourceMappingURL=SQLStringUpdate.js.map