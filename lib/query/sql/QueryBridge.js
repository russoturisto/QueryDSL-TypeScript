"use strict";
var QueryTreeNode_1 = require("../noSql/QueryTreeNode");
var MappedEntityArray_1 = require("../../core/MappedEntityArray");
var LastObjectTracker_1 = require("./LastObjectTracker");
var QueryBridgeConfiguration = (function () {
    function QueryBridgeConfiguration() {
        // This is for conflicts on OneToMany references
        this.failOnConflicts = true;
    }
    return QueryBridgeConfiguration;
}());
exports.QueryBridgeConfiguration = QueryBridgeConfiguration;
/**
 a) Reconstruct the Many-To-One relations by Id
 for this we need
 1) a map of all entities [by Type]:[by id]:Entity
 2) a map of all stubs Many-To-One stubs, [by Type]:[by id]: { propertyName, parentObject }
 Then it's a simple operation of mapping all available entities to all stubs
 b) Reconstruct the One-To-Many relations by Tree
 for this we need
 1) the entity map from 1a)
 2) a similar map of all One-To-Many stubs, [by Type]:[by id]: { propertyName, parentObject,
manyEntitySet }
 where manyEntitySet is a set of all entities in a given OneToMany collection, by their id
 Then we need to navigate all entities in the entity map, and
 - for every found Many-To-One reference in each entity
 Lookup the related One-To-Many stub
 If the stub is found, add this entity to the manyEntitySet
 - at the end we need to go though all the One-To-Many stubs and create arrays ouf of the sets
 */
var QueryBridge = (function () {
    function QueryBridge(performBridging, mapEntityArrays, config, qEntity, qEntityMap) {
        this.performBridging = performBridging;
        this.mapEntityArrays = mapEntityArrays;
        this.config = config;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        // Keys can only be strings or numbers | TODO: change to JS Maps, if needed
        this.entityMap = {};
        this.otmObjectReference = new OtmObjectReference();
        this.lastObjectTracker = new LastObjectTracker_1.LastObjectTracker();
        // For MtO mapping
        // Map of all objects that have a given MtO reference
        this.mtoStubReferenceMap = {};
        // One-To-Many temp stubs (before entityIds are available
        this.otmStubBuffer = [];
        this.mtoStubBuffer = [];
    }
    QueryBridge.prototype.addEntity = function (entityAlias, resultObject) {
        if (!this.performBridging) {
            this.lastObjectTracker.addEntity(entityAlias, resultObject);
        }
    };
    QueryBridge.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName) {
        if (!this.performBridging) {
            this.lastObjectTracker.addProperty(entityAlias, resultObject, dataType, propertyName);
        }
    };
    QueryBridge.prototype.bufferManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId) {
        if (!this.performBridging) {
            this.lastObjectTracker.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
            return;
        }
        this.bufferManyToOne(resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
    };
    QueryBridge.prototype.bufferManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId) {
        if (!this.performBridging) {
            this.lastObjectTracker.addManyToOneObject(entityAlias, resultObject, propertyName);
            return;
        }
        this.bufferManyToOne(resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
    };
    QueryBridge.prototype.bufferManyToOne = function (resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId) {
        var otmEntityField;
        for (var otmRelationProperty in relationQEntity.__entityRelationMap__) {
            var otmRelation = relationQEntity.__entityRelationMap__[otmRelationProperty];
            if (otmRelation.relationType === QueryTreeNode_1.RelationType.ONE_TO_MANY) {
                var otmElements = relationEntityMetadata.oneToManyMap[otmRelationProperty];
                if (otmElements.mappedBy === propertyName) {
                    otmEntityField = otmRelationProperty;
                    break;
                }
            }
        }
        this.mtoStubBuffer.push({
            otmEntityId: relatedEntityId,
            otmEntityIdField: relationEntityMetadata.idProperty,
            otmEntityName: relationQEntity.__entityName__,
            otmEntityField: otmEntityField,
            mtoRelationField: propertyName,
            mtoParentObject: resultObject
        });
    };
    QueryBridge.prototype.bufferBlankManyToOne = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        if (!this.performBridging) {
            this.lastObjectTracker.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
        }
    };
    QueryBridge.prototype.bufferOneToManyStub = function (resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        if (!this.performBridging) {
            return;
        }
        this.bufferOneToMany(resultObject, otmEntityName);
    };
    QueryBridge.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        if (!this.performBridging) {
            this.lastObjectTracker.addOneToManyCollection(entityAlias, resultObject, propertyName);
            return [childResultObject];
        }
        this.bufferOneToMany(resultObject, otmEntityName);
        var childResultsArray = new MappedEntityArray_1.MappedEntityArray(relationEntityMetadata.idProperty);
        childResultsArray.put(childResultObject);
        return childResultsArray;
    };
    QueryBridge.prototype.bufferBlankOneToMany = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        if (!this.performBridging) {
            this.lastObjectTracker.addOneToManyCollection(entityAlias, resultObject, propertyName);
            return [];
        }
        return new MappedEntityArray_1.MappedEntityArray(relationEntityMetadata.idProperty);
    };
    QueryBridge.prototype.bufferOneToMany = function (resultObject, otmEntityName) {
        this.otmStubBuffer.push({
            otmEntityName: otmEntityName,
            otmObject: resultObject
        });
    };
    QueryBridge.prototype.flushEntity = function (entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        if (!this.performBridging) {
            return this.lastObjectTracker.mergeEntity(entityAlias, resultObject);
        }
        if (!entityId) {
            throw "No Id provided for entity of type '" + qEntity.__entityName__ + "'";
        }
        var currentEntity = this.getEntityToFlush(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
        this.flushOneToManyStubBuffer(qEntity, entityMetadata, entityId);
        return currentEntity;
    };
    QueryBridge.prototype.getEntityToFlush = function (qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
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
    QueryBridge.prototype.mergeEntities = function (source, target, qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap) {
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
                        // TODO: this will probably fail, since the merged in array should always have only one entity in it,
                        // because it is created for a single result set row.
                        if (this_1.config.failOnConflicts) {
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
                                if (_this.config.failOnConflicts && !sourceSet_1[childId]) {
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
    QueryBridge.prototype.flushOneToManyStubBuffer = function (qEntity, entityMetadata, entityId) {
        var _this = this;
        var otmStubBuffer = this.otmStubBuffer;
        this.otmStubBuffer = [];
        otmStubBuffer.forEach(function (otmStub) {
            _this.otmObjectReference.addOtmReference(otmStub, entityId);
        });
        var mtoStubBuffer = this.mtoStubBuffer;
        this.mtoStubBuffer = [];
        mtoStubBuffer.forEach(function (mtoStub) {
            _this.otmObjectReference.addMtoReference(mtoStub, entityId);
        });
    };
    QueryBridge.prototype.flushRow = function () {
        if (!this.performBridging) {
            this.lastObjectTracker.flushRow();
        }
    };
    QueryBridge.prototype.bridge = function (parsedResults, selectClauseFragment) {
        if (!this.performBridging) {
            return parsedResults;
        }
        this.otmObjectReference.populateOtms(this.entityMap, this.mapEntityArrays);
        var entityMetadata = this.qEntity.__entityConstructor__;
        var resultMEA = new MappedEntityArray_1.MappedEntityArray(entityMetadata.idProperty);
        resultMEA.putAll(parsedResults);
        if (this.mapEntityArrays) {
            return resultMEA;
        }
        return resultMEA.toArray();
    };
    return QueryBridge;
}());
exports.QueryBridge = QueryBridge;
//# sourceMappingURL=QueryBridge.js.map