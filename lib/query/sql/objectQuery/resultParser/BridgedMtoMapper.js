/**
 * Created by Papa on 10/15/2016.
 */
"use strict";
// For MtO mapping in bridged queries
var BridgedMtoMapper = (function () {
    function BridgedMtoMapper() {
        // Map of all objects that have a given MtO reference
        this.mtoStubReferenceMap = {};
    }
    BridgedMtoMapper.prototype.addMtoReference = function (mtoStubReference, mtoEntityId) {
        var mtoEntitiesByTypeMap = this.mtoStubReferenceMap[mtoStubReference.mtoEntityName];
        if (!mtoEntitiesByTypeMap) {
            mtoEntitiesByTypeMap = {};
            this.mtoStubReferenceMap[mtoStubReference.mtoEntityName] = mtoEntitiesByTypeMap;
        }
        var mtosForEntity = mtoEntitiesByTypeMap[mtoEntityId];
        if (!mtosForEntity) {
            mtosForEntity = {};
            mtoEntitiesByTypeMap[mtoEntityId] = mtosForEntity;
        }
        mtosForEntity[mtoStubReference.mtoRelationField] = mtoStubReference;
    };
    BridgedMtoMapper.prototype.populateMtos = function (entityMap) {
        for (var mtoEntityName in this.mtoStubReferenceMap) {
            var mtoEntitiesForTypeMap = this.mtoStubReferenceMap[mtoEntityName];
            for (var mtoEntityId in mtoEntitiesForTypeMap) {
                var mtosForEntity = mtoEntitiesForTypeMap[mtoEntityId];
                for (var mtoPropertyName in mtosForEntity) {
                    var mtoStubReference = mtosForEntity[mtoPropertyName];
                    var otmEntitiesForTypeMap = entityMap[mtoStubReference.otmEntityName];
                    if (!otmEntitiesForTypeMap) {
                        continue;
                    }
                    var otmEntity = otmEntitiesForTypeMap[mtoStubReference.otmEntityId];
                    if (!otmEntity) {
                        continue;
                    }
                    mtoStubReference.mtoParentObject[mtoStubReference.mtoRelationField] = otmEntity;
                }
            }
        }
    };
    return BridgedMtoMapper;
}());
exports.BridgedMtoMapper = BridgedMtoMapper;
//# sourceMappingURL=BridgedMtoMapper.js.map