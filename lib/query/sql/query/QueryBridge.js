"use strict";
var QueryTreeNode_1 = require("../../noSql/QueryTreeNode");
var MappedEntityArray_1 = require("../../../core/MappedEntityArray");
var HierachicyTracker_1 = require("./HierachicyTracker");
var BridgedOtmMapper_1 = require("./BridgedOtmMapper");
var BridgedMtoMapper_1 = require("./BridgedMtoMapper");
var IQueryParser_1 = require("./IQueryParser");
/**
 * Created by Papa on 10/8/2016.
 */
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
    function QueryBridge(queryResultType, config, qEntity, qEntityMap) {
        this.queryResultType = queryResultType;
        this.config = config;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        // Keys can only be strings or numbers | TODO: change to JS Maps, if needed
        this.entityMap = {};
        this.otmMapper = new BridgedOtmMapper_1.BridgedQueryOtmMapper();
        this.mtoMapper = new BridgedMtoMapper_1.BridgedQueryMtoMapper();
        this.hierarchyTracker = new HierachicyTracker_1.HierachicyTracker();
        // One-To-Many & MtO temp stubs (before entityId is available)
        this.otmStubBuffer = [];
        this.mtoStubBuffer = [];
        // Used in RAW queries
        this.currentResultRow = [];
    }
    QueryBridge.prototype.addEntity = function (entityAlias, qEntity) {
        var resultObject;
        switch (this.queryResultType) {
            case IQueryParser_1.QueryResultType.HIERARCHICAL:
                this.hierarchyTracker.addEntity(entityAlias, resultObject);
            case IQueryParser_1.QueryResultType.BRIDGED:
            case IQueryParser_1.QueryResultType.PLAIN:
                resultObject = new qEntity.__entityConstructor__();
                break;
            case IQueryParser_1.QueryResultType.RAW:
                resultObject = this.currentResultRow;
                break;
        }
        return resultObject;
    };
    QueryBridge.prototype.addProperty = function (entityAlias, resultObject, dataType, propertyName, propertyValue) {
        switch (this.queryResultType) {
            case IQueryParser_1.QueryResultType.HIERARCHICAL:
                this.hierarchyTracker.addProperty(entityAlias, resultObject, dataType, propertyName);
            case IQueryParser_1.QueryResultType.BRIDGED:
            case IQueryParser_1.QueryResultType.PLAIN:
                resultObject[propertyName] = propertyValue;
                return;
            case IQueryParser_1.QueryResultType.RAW:
                resultObject.push(propertyValue);
                return;
        }
    };
    QueryBridge.prototype.bufferManyToOneStub = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId) {
        switch (this.queryResultType) {
            case IQueryParser_1.QueryResultType.PLAIN:
                this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
                return;
            case IQueryParser_1.QueryResultType.HIERARCHICAL:
                this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
                this.hierarchyTracker.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
                return;
            case IQueryParser_1.QueryResultType.BRIDGED:
                this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
                this.bufferManyToOne(qEntity.__entityName__, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
                return;
            case IQueryParser_1.QueryResultType.RAW:
                resultObject.push(relatedEntityId);
                return;
        }
    };
    QueryBridge.prototype.addManyToOneStub = function (resultObject, propertyName, relationEntityMetadata, relatedEntityId) {
        var manyToOneStub = {};
        resultObject[propertyName] = manyToOneStub;
        manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
    };
    QueryBridge.prototype.bufferManyToOneObject = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata, childResultObject) {
        var relatedEntityId = childResultObject[relationEntityMetadata.idProperty];
        switch (this.queryResultType) {
            case IQueryParser_1.QueryResultType.PLAIN:
                resultObject[propertyName] = childResultObject;
                this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
                return;
            case IQueryParser_1.QueryResultType.HIERARCHICAL:
                resultObject[propertyName] = childResultObject;
                this.hierarchyTracker.addManyToOneObject(entityAlias, resultObject, propertyName);
                return;
            case IQueryParser_1.QueryResultType.BRIDGED:
                resultObject[propertyName] = childResultObject;
                this.bufferManyToOne(qEntity.__entityName__, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
                return;
            case IQueryParser_1.QueryResultType.RAW:
                return;
        }
    };
    QueryBridge.prototype.bufferManyToOne = function (entityName, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId) {
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
            otmEntityName: relationQEntity.__entityName__,
            otmEntityField: otmEntityField,
            mtoEntityName: entityName,
            mtoRelationField: propertyName,
            mtoParentObject: null
        });
    };
    QueryBridge.prototype.bufferBlankManyToOne = function (entityAlias, qEntity, entityMetadata, resultObject, propertyName, relationQEntity, relationEntityMetadata) {
        switch (this.queryResultType) {
            case IQueryParser_1.QueryResultType.HIERARCHICAL:
                this.hierarchyTracker.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
                return;
        }
    };
    QueryBridge.prototype.bufferOneToManyStub = function (otmEntityName, otmPropertyName) {
        switch (this.queryResultType) {
            case IQueryParser_1.QueryResultType.BRIDGED:
                this.bufferOneToMany(otmEntityName, otmPropertyName);
                return;
        }
    };
    QueryBridge.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        //): any[] | MappedEntityArray<any> {
        if (!this.performBridging) {
            this.hierarchyTracker.addOneToManyCollection(entityAlias, resultObject, propertyName);
            return [childResultObject];
        }
        this.bufferOneToMany(otmEntityName, propertyName);
        var childResultsArray = new MappedEntityArray_1.MappedEntityArray(relationEntityMetadata.idProperty);
        childResultsArray.put(childResultObject);
        return childResultsArray;
    };
    QueryBridge.prototype.bufferBlankOneToMany = function (entityAlias, resultObject, otmEntityName, propertyName, relationEntityMetadata, childResultObject) {
        //): any[] | MappedEntityArray<any> {
        if (!this.performBridging) {
            this.hierarchyTracker.addOneToManyCollection(entityAlias, resultObject, propertyName);
            return [];
        }
        return new MappedEntityArray_1.MappedEntityArray(relationEntityMetadata.idProperty);
    };
    QueryBridge.prototype.bufferOneToMany = function (otmEntityName, otmPropertyName) {
        this.otmStubBuffer.push({
            otmEntityName: otmEntityName,
            otmPropertyName: otmPropertyName,
            otmObject: null
        });
    };
    QueryBridge.prototype.flushEntity = function (entityAlias, qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject) {
        if (!this.performBridging) {
            return this.hierarchyTracker.mergeEntity(entityAlias, resultObject);
        }
        if (!entityId) {
            throw "No Id provided for entity of type '" + qEntity.__entityName__ + "'";
        }
        var currentEntity = this.getEntityToFlush(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
        this.flushRelationStubBuffers(entityId, currentEntity);
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
    QueryBridge.prototype.flushRelationStubBuffers = function (entityId, currentEntity) {
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
    QueryBridge.prototype.flushRow = function () {
        this.currentResultRow = [];
        if (!this.performBridging) {
            this.hierarchyTracker.flushRow();
        }
    };
    QueryBridge.prototype.bridge = function (parsedResults, selectClauseFragment) {
        if (!this.performBridging) {
            return parsedResults;
        }
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
    return QueryBridge;
}());
exports.QueryBridge = QueryBridge;
//# sourceMappingURL=QueryBridge.js.map