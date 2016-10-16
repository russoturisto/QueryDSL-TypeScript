"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IQueryParser_1 = require("./IQueryParser");
var BridgedOtmMapper_1 = require("./BridgedOtmMapper");
var BridgedMtoMapper_1 = require("./BridgedMtoMapper");
var Relation_1 = require("../../../core/entity/Relation");
var MappedEntityArray_1 = require("../../../core/MappedEntityArray");
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this parser to to bridge all entity references and arrive at an inter-connected graph (where possible).
 */
var BridgedQueryParser = (function (_super) {
    __extends(BridgedQueryParser, _super);
    function BridgedQueryParser(config, qEntity, qEntityMap) {
        _super.call(this);
        this.config = config;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        // Keys can only be strings or numbers | TODO: change to JS Maps, if needed
        this.entityMap = {};
        this.otmMapper = new BridgedOtmMapper_1.BridgedQueryOtmMapper();
        this.mtoMapper = new BridgedMtoMapper_1.BridgedQueryMtoMapper();
        // One-To-Many & MtO temp stubs (before entityId is available)
        this.otmStubBuffer = [];
        this.mtoStubBuffer = [];
        // Used in RAW queries
        this.currentResultRow = [];
    }
    BridgedQueryParser.prototype.addEntity = function (entityAlias, qEntity) {
        return new qEntity.__entityConstructor__();
    };
    BridgedQueryParser.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName, propertyValue) {
        resultObject[propertyName] = propertyValue;
    };
    BridgedQueryParser.prototype.bufferManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId) {
        this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
        this.bufferManyToOne(qEntity.__entityName__, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
    };
    BridgedQueryParser.prototype.bufferBlankManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        // Nothing to do for bridged parser - bridging will map blanks, where possible
    };
    BridgedQueryParser.prototype.bufferManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = childResultObject;
        var relatedEntityId = childResultObject[relationEntityMetadata.idProperty];
        this.bufferManyToOne(qEntity.__entityName__, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
    };
    BridgedQueryParser.prototype.bufferManyToOne = function (entityName, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId) {
        var otmEntityField;
        for (var otmRelationProperty in relationQEntity.__entityRelationMap__) {
            var otmRelation = relationQEntity.__entityRelationMap__[otmRelationProperty];
            if (otmRelation.relationType === Relation_1.RelationType.ONE_TO_MANY) {
                var otmElements = relationEntityMetadata.oneToManyMap[otmRelationProperty];
                if (otmElements.mappedBy === propertyName) {
                    otmEntityField = otmRelationProperty;
                    break;
                }
            }
        }
        this.mtoStubBuffer.push({
            otmEntityId: relatedEntityId,
            otmEntityName: relationQEntity.__entityName__,
            otmEntityField: otmEntityField,
            mtoEntityName: entityName,
            mtoRelationField: propertyName,
            mtoParentObject: null
        });
    };
    BridgedQueryParser.prototype.bufferBlankManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        // Nothing to do for bridged parser - bridging will map blanks, where possible
    };
    BridgedQueryParser.prototype.bufferOneToManyStub = function (otmEntityName, otmPropertyName) {
        this.bufferOneToMany(otmEntityName, otmPropertyName);
    };
    BridgedQueryParser.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        this.bufferOneToMany(otmEntityName, propertyName);
        var childResultsArray = new MappedEntityArray_1.MappedEntityArray(relationEntityMetadata.idProperty);
        childResultsArray.put(childResultObject);
        resultObject[propertyName] = childResultsArray;
    };
    BridgedQueryParser.prototype.bufferBlankOneToMany = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        resultObject[propertyName] = new MappedEntityArray_1.MappedEntityArray(relationEntityMetadata.idProperty);
    };
    BridgedQueryParser.prototype.bufferOneToMany = function (otmEntityName, otmPropertyName) {
        this.otmStubBuffer.push({
            otmEntityName: otmEntityName,
            otmPropertyName: otmPropertyName,
            otmObject: null
        });
    };
    BridgedQueryParser.prototype.flushEntity = function (entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        if (!entityId) {
            throw "No Id provided for entity of type '" + qEntity.__entityName__ + "'";
        }
        var currentEntity = this.getEntityToFlush(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
        this.flushRelationStubBuffers(entityId, currentEntity);
        return currentEntity;
    };
    BridgedQueryParser.prototype.getEntityToFlush = function (qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        var entityName = qEntity.__entityName__;
        if (!entityId) {
            throw "Entity ID not specified for entity '" + entityName + "'";
        }
        var entityMapForType = this.entityMap[entityName];
        if (!entityMapForType) {
            entityMapForType = {};
            this.entityMap[entityName] = entityMapForType;
        }
        var existingEntity = entityMapForType[entityId];
        var currentEntity = this.mergeEntities(existingEntity, resultObject, qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap);
        entityMapForType[entityId] = currentEntity;
        return currentEntity;
    };
    // Must merge the one-to-many relationships returned as part of the result tree
    BridgedQueryParser.prototype.mergeEntities = function (source, target, qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap) {
        var _this = this;
        if (!source || target === source) {
            return target;
        }
        var entityMetadata = qEntity.__entityConstructor__;
        var entityName = qEntity.__entityName__;
        var id = target[entityMetadata.idProperty];
        var _loop_1 = function(propertyName) {
            if (selectClauseFragment[propertyName] === undefined) {
                return "continue";
            }
            // Merge properties (conflicts detected at query parsing time):
            if (entityPropertyTypeMap[propertyName]) {
                // If source property doesn't exist
                if (!source[propertyName] && source[propertyName] != false && source[propertyName] != '' && source[propertyName] != 0) {
                    // set the source property to value of target
                    source[propertyName] = target[propertyName];
                }
            }
            else if (entityRelationMap[propertyName]) {
                var childSelectClauseFragment = selectClauseFragment[propertyName];
                // For stubs (conflicts detected at query parsing time)
                if (childSelectClauseFragment == null) {
                    // For Many-to-One stubs, assume they are are the same and don't detect conflicts, just merge
                    source[propertyName] = target[propertyName];
                }
                else {
                    var childEntityName = entityRelationMap[propertyName].entityName;
                    var entityMetadata_1 = this_1.qEntityMap[childEntityName].__entityConstructor__;
                    var childIdProperty_1 = entityMetadata_1.idProperty;
                    // Many-to-One (conflicts detected at query parsing time)
                    if (entityMetadata_1.manyToOneMap[propertyName]) {
                        // If source is missing this mapping and target has it
                        if (source[propertyName] === undefined && target[propertyName] !== undefined) {
                            // set the source property to value of target
                            source[propertyName] = target[propertyName];
                        }
                    }
                    else {
                        var sourceArray_1 = source[propertyName];
                        var targetArray = target[propertyName];
                        // Because parseQueryResult is depth-first, all child objects have already been processed
                        // TODO: this will probably fail, since the merged in array should always have only one entity in it
                        // because it is created for a single result set row.
                        if (this_1.config.strict) {
                            if ((!sourceArray_1 && targetArray)
                                || (!targetArray && sourceArray_1)
                                || sourceArray_1.length != targetArray.length) {
                                throw "One-to-Many child arrays don't match for '" + entityName + "." + propertyName + "', @Id(" + entityMetadata_1.idProperty + ") = " + id;
                            }
                        }
                        var sourceSet_1 = {};
                        if (sourceArray_1) {
                            sourceArray_1.forEach(function (sourceChild) {
                                sourceSet_1[sourceChild[childIdProperty_1]] = sourceChild;
                            });
                        }
                        else {
                            sourceArray_1 = [];
                            source[propertyName] = sourceArray_1;
                        }
                        if (targetArray) {
                            targetArray.forEach(function (targetChild) {
                                var childId = targetChild[childIdProperty_1];
                                if (_this.config.strict && !sourceSet_1[childId]) {
                                    throw "One-to-Many child arrays don't match for '" + entityName + "." + propertyName + "', @Id(" + entityMetadata_1.idProperty + ") = " + id;
                                }
                                // If target child array has a value that source doesn't
                                if (!sourceSet_1[childId]) {
                                    // add it to source (preserve order)
                                    sourceArray_1.push(targetChild);
                                }
                            });
                        }
                    }
                }
            }
        };
        var this_1 = this;
        for (var propertyName in selectClauseFragment) {
            var state_1 = _loop_1(propertyName);
            if (state_1 === "continue") continue;
        }
        return source;
    };
    BridgedQueryParser.prototype.flushRelationStubBuffers = function (entityId, currentEntity) {
        var _this = this;
        var otmStubBuffer = this.otmStubBuffer;
        this.otmStubBuffer = [];
        otmStubBuffer.forEach(function (otmStub) {
            otmStub.otmObject = currentEntity;
            _this.otmMapper.addOtmReference(otmStub, entityId);
        });
        var mtoStubBuffer = this.mtoStubBuffer;
        this.mtoStubBuffer = [];
        mtoStubBuffer.forEach(function (mtoStub) {
            mtoStub.mtoParentObject = currentEntity;
            _this.otmMapper.addMtoReference(mtoStub, entityId);
            _this.mtoMapper.addMtoReference(mtoStub, entityId);
        });
    };
    BridgedQueryParser.prototype.flushRow = function () {
        // Nothing to do, bridged queries don't rely on rows changing
    };
    BridgedQueryParser.prototype.bridge = function (parsedResults, selectClauseFragment) {
        this.mtoMapper.populateMtos(this.entityMap);
        this.otmMapper.populateOtms(this.entityMap, this.config.mapped);
        var entityMetadata = this.qEntity.__entityConstructor__;
        // merge any out of order entity references (there shouldn't be any)
        var resultMEA = new MappedEntityArray_1.MappedEntityArray(entityMetadata.idProperty);
        resultMEA.putAll(parsedResults);
        if (this.config.mapped) {
            return resultMEA;
        }
        return resultMEA.toArray();
    };
    return BridgedQueryParser;
}(IQueryParser_1.AbstractObjectQueryParser));
exports.BridgedQueryParser = BridgedQueryParser;
//# sourceMappingURL=BridgedQueryParser.js.map