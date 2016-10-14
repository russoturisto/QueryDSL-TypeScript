"use strict";
var QueryTreeNode_1 = require("../noSql/QueryTreeNode");
var QueryBridgeConfiguration = (function () {
    function QueryBridgeConfiguration() {
        // This is for conflicts on OneToMany references
        this.failOnConflicts = false;
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
    function QueryBridge(performBridging, config, qEntity, qEntityMap) {
        this.performBridging = performBridging;
        this.config = config;
        this.qEntity = qEntity;
        this.qEntityMap = qEntityMap;
        // Keys can only be strings or numbers | TODO: change to JS Maps, if needed
        this.entityMap = {};
        // Many-To-One stubs
        this.mtoStubReferenceMap = {};
        // One-To-Many temp stubs (before entityIds are available
        this.otmStubBuffer = [];
        this.mtoStubBuffer = [];
        // One-To-Many stubs
        this.otmStubReferenceMap = {};
    }
    QueryBridge.prototype.addEntity = function (qEntity, entityMetadata, resultObject, propertyName, selectClauseFragment) {
        if (!this.performBridging) {
            return;
        }
        if (entityMetadata.idProperty != propertyName) {
            return;
        }
        var entityMapForType = this.entityMap[qEntity.__entityName__];
        if (!entityMapForType) {
            entityMapForType = {};
            this.entityMap[qEntity.__entityName__] = entityMapForType;
        }
        var entityId = resultObject[propertyName];
        var existingEntity = entityMapForType[entityId];
        this.currentEntity = this.mergeEntities(existingEntity, resultObject, qEntity, selectClauseFragment);
        entityMapForType[entityId] = resultObject;
    };
    // Must merge the one-to-many relationships returned as part of the result tree
    QueryBridge.prototype.mergeEntities = function (source, target, qEntity, selectClauseFragment) {
        if (!source || target === source) {
            return target;
        }
        // Assuming all data fields are the same between entities
        // TODO: when query Selects will allow multiple definitions of the same entity, revisit assumption
        for (var propertyName in qEntity.__entityRelationMap__) {
            var entityRelation = qEntity.__entityRelationMap__[propertyName];
            var selectClauseSubFragment = selectClauseFragment[propertyName];
            if (!selectClauseSubFragment || !(selectClauseSubFragment instanceof Object)) {
                continue;
            }
            if (selectClauseFragment[propertyName])
                switch (entityRelation.relationType) {
                    case QueryTreeNode_1.RelationType.MANY_TO_ONE:
                        // Verify that many to ones re the same
                        break;
                    case QueryTreeNode_1.RelationType.ONE_TO_MANY:
                        break;
                }
        }
        return target;
    };
    QueryBridge.prototype.addManyToOneStub = function (qEntity, entityMetadata, resultObject, propertyName, relatedEntityId) {
        var manyToOneStub = {};
        resultObject[propertyName] = manyToOneStub;
        var relation = qEntity.__entityRelationMap__[propertyName];
        var relationQEntity = this.qEntityMap[relation.entityName];
        var relationEntityMetadata = relationQEntity.__entityConstructor__;
        manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
        if (!this.performBridging) {
            return;
        }
        var stubMapForOtmType = this.mtoStubReferenceMap[relationQEntity.__entityName__];
        if (!stubMapForOtmType) {
            stubMapForOtmType = {};
            this.mtoStubReferenceMap[relationQEntity.__entityName__] = stubMapForOtmType;
        }
        var otmStubReferences = stubMapForOtmType[relatedEntityId];
        if (!otmStubReferences) {
            otmStubReferences = {};
            stubMapForOtmType[relatedEntityId] = otmStubReferences;
        }
        var mtoStub = otmStubReferences[];
        otmStubReferences.push({
            propertyName: propertyName,
            parentObject: resultObject
        });
    };
    QueryBridge.prototype.bufferManyToOneStub = function (qEntity, entityMetadata, resultObject, propertyName, relatedEntityId) {
        var manyToOneStub = {};
        resultObject[propertyName] = manyToOneStub;
        var relation = qEntity.__entityRelationMap__[propertyName];
        var relationQEntity = this.qEntityMap[relation.entityName];
        var relationEntityMetadata = relationQEntity.__entityConstructor__;
        manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
        if (!this.performBridging) {
            return;
        }
        this.mtoStubBuffer.push({
            otmEntityId: relatedEntityId,
            otmEntityIdField: relationEntityMetadata.idProperty,
            otmEntityName: relationQEntity.__entityName__,
            mtoRelationField: propertyName,
            mtoParentObject: resultObject
        });
    };
    QueryBridge.prototype.bufferOneToManyStub = function (resultObject, propertyName) {
        if (!this.performBridging) {
            return;
        }
        this.otmStubBuffer.push({
            propertyName: propertyName,
            parentObject: resultObject,
            manyEntitySet: {}
        });
    };
    QueryBridge.prototype.flush = function (qEntity, entityMetadata, entityId, resultObject) {
        if (!this.performBridging) {
            return;
        }
        if (!entityId) {
            throw "No Id provided for entity of type '" + qEntity.__entityName__ + "'";
        }
        this.flushOneToManyStubBuffer(qEntity, entityMetadata, entityId);
    };
    QueryBridge.prototype.flushOneToManyStubBuffer = function (qEntity, entityMetadata, entityId) {
        var stubBuffer = this.otmStubBuffer;
        this.otmStubBuffer = [];
        var otmStubMapForType = this.otmStubReferenceMap[qEntity.__entityName__];
        if (!otmStubMapForType) {
            otmStubMapForType = {};
            this.otmStubReferenceMap[qEntity.__entityName__] = otmStubMapForType;
        }
        var otmStubReferences = otmStubMapForType[entityId];
        if (otmStubReferences) {
            throw "Unexpected OneToManyStubReference for entity name '" + qEntity.__entityName__ + "', id: '" + entityId + "'";
        }
        otmStubMapForType[entityId] = this.otmStubBuffer;
    };
    QueryBridge.prototype.bridge = function (parsedResults, selectClauseFragment) {
        if (!this.performBridging) {
            return;
        }
        this.deDuplicate(this.qEntity, selectClauseFragment, parsedResults);
        for (var entityName in this.mtoStubReferenceMap) {
            var entityMapForType = this.entityMap[entityName];
            if (!entityMapForType) {
                continue;
            }
            var stubMapForType = this.mtoStubReferenceMap[entityName];
            var _loop_1 = function(entityId) {
                var entityReference = entityMapForType[entityId];
                if (!entityReference) {
                    return "continue";
                }
                var stubReferences = stubMapForType[entityId];
                stubReferences.forEach(function (stubReference) {
                    stubReference.parentObject[stubReference.propertyName] = entityReference.entityObject;
                });
            };
            for (var entityId in stubMapForType) {
                var state_1 = _loop_1(entityId);
                if (state_1 === "continue") continue;
            }
        }
        for (var entityName in this.otmStubReferenceMap) {
            var entityMapForType = this.entityMap[entityName];
            var stubMapForType = this.otmStubReferenceMap[entityName];
            for (var entityId in stubMapForType) {
                var stubReference = stubMapForType[entityId];
            }
        }
    };
    QueryBridge.prototype.deDuplicate = function (qEntity, selectClauseFragment, parsedResults) {
        var entityMetadata = qEntity.__entityConstructor__;
        var idProperty = entityMetadata.idProperty;
        for (var i = parsedResults.length; i >= 0; i--) {
            var result = parsedResults[i];
            var id = result[idProperty];
            var entity = void 0;
            if (id) {
                entity = this.entityMap[qEntity.__entityName__][id];
                parsedResults[i] = entity;
            }
            result = this.mergeEntities(result, entity, qEntity, selectClauseFragment);
            for (var propertyName in qEntity.__entityRelationMap__) {
                var selectClauseSubFragment = selectClauseFragment[propertyName];
                if (!selectClauseSubFragment || !(selectClauseSubFragment instanceof Object)) {
                    continue;
                }
                if (selectClauseFragment[propertyName])
                    var entityRelation = qEntity.__entityRelationMap__[propertyName];
                switch (entityRelation.relationType) {
                    case QueryTreeNode_1.RelationType.MANY_TO_ONE:
                        break;
                    case QueryTreeNode_1.RelationType.ONE_TO_MANY:
                        break;
                }
            }
        }
    };
    QueryBridge.prototype.deDuplicateCollection = function () {
    };
    return QueryBridge;
}());
exports.QueryBridge = QueryBridge;
//# sourceMappingURL=QueryLinker.js.map