"use strict";
/**
 * Created by Papa on 10/15/2016.
 */
var BridgedQueryOtmMapper = (function () {
    function BridgedQueryOtmMapper() {
        // For OtM mapping
        // Map of MtO referred objects by OtM references
        this.mtoEntityReferenceMap = {};
        // Map of objects with OtM references
        this.otmEntityReferenceMap = {};
    }
    BridgedQueryOtmMapper.prototype.addMtoReference = function (mtoStubReference, mtoEntityId) {
        // If the @OneToMany({ mappedBy: ... }) is missing, there is nothing to map to
        if (!mtoStubReference.otmEntityField) {
            return;
        }
        // Add into mtoEntityReferenceMap
        var mapForOtmEntityName = this.mtoEntityReferenceMap[mtoStubReference.otmEntityName];
        if (!mapForOtmEntityName) {
            mapForOtmEntityName = {};
            this.mtoEntityReferenceMap[mtoStubReference.otmEntityName] = mapForOtmEntityName;
        }
        var mapForOtmEntity = mapForOtmEntityName[mtoStubReference.otmEntityId];
        if (!mapForOtmEntity) {
            mapForOtmEntity = {};
            mapForOtmEntityName[mtoStubReference.otmEntityId] = mapForOtmEntity;
        }
        var mtoCollection = mapForOtmEntity[mtoStubReference.otmEntityField];
        mtoCollection.put(mtoStubReference.mtoParentObject);
    };
    BridgedQueryOtmMapper.prototype.addOtmReference = function (otmStubReference, otmEntityId) {
        var mapForOtmEntityName = this.otmEntityReferenceMap[otmStubReference.otmEntityName];
        if (!mapForOtmEntityName) {
            mapForOtmEntityName = {};
            this.otmEntityReferenceMap[otmStubReference.otmEntityName] = mapForOtmEntityName;
        }
        mapForOtmEntityName[otmEntityId] = otmStubReference.otmObject;
    };
    BridgedQueryOtmMapper.prototype.populateOtms = function (entityMap, keepMappedEntityArrays) {
        for (var otmEntityName in this.mtoEntityReferenceMap) {
            var entityOfNameMap = entityMap[otmEntityName];
            // If there are no entities of this type in query results, just keep the stubs
            if (!entityOfNameMap) {
                continue;
            }
            var entityWithOtmMap = this.otmEntityReferenceMap[otmEntityName];
            // If there are no OTM for this type in query results, no mapping needs to happen
            if (!entityWithOtmMap) {
                continue;
            }
            var mapForOtmEntityName = this.mtoEntityReferenceMap[otmEntityName];
            for (var otmEntityId in mapForOtmEntityName) {
                var referencedEntitiesByPropertyMap = mapForOtmEntityName[otmEntityId];
                for (var otmEntityId_1 in entityWithOtmMap) {
                    var otmEntity = entityWithOtmMap[otmEntityId_1];
                    for (var otmProperty in referencedEntitiesByPropertyMap) {
                        var referencedEntityMap = referencedEntitiesByPropertyMap[otmProperty];
                        var otmCollection = otmEntity[otmProperty];
                        // If @OneToMany isn't set yet
                        if (!otmCollection) {
                            otmEntity[otmProperty] = referencedEntityMap;
                        }
                        else {
                            otmCollection.putAll(referencedEntityMap);
                        }
                        if (!keepMappedEntityArrays) {
                            otmEntity[otmProperty] = otmEntity[otmProperty].slice();
                        }
                    }
                }
            }
        }
    };
    return BridgedQueryOtmMapper;
}());
exports.BridgedQueryOtmMapper = BridgedQueryOtmMapper;
//# sourceMappingURL=OtmObjectReference.js.map