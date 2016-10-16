/**
 * Created by Papa on 10/15/2016.
 */

export interface ManyToOneStubReference {
	mtoEntityName: string;
	mtoParentObject: any;
	mtoRelationField: string;
	otmEntityField: string;
	otmEntityId: string | number;
	otmEntityName: string;
}

// For MtO mapping in bridged queries
export class BridgedQueryMtoMapper {
	// Map of all objects that have a given MtO reference
	mtoStubReferenceMap: {
		// Type of MtO reference object
		[mtoEntityName: string]: {
			// Id of MtO reference object
			[mtoEntityId: string]: {
				// Name of the MtO property
				[mtoPropertyName: string]: // The stub reference
					ManyToOneStubReference}}} = {};

	addMtoReference(
		mtoStubReference: ManyToOneStubReference,
		mtoEntityId: string | number
	) {
		let mtoEntitiesByTypeMap = this.mtoStubReferenceMap[mtoStubReference.mtoEntityName];
		if (!mtoEntitiesByTypeMap) {
			mtoEntitiesByTypeMap = {};
			this.mtoStubReferenceMap[mtoStubReference.mtoEntityName] = mtoEntitiesByTypeMap;
		}
		let mtosForEntity = mtoEntitiesByTypeMap[mtoEntityId];
		if (!mtosForEntity) {
			mtosForEntity = {};
			mtoEntitiesByTypeMap[mtoEntityId] = mtosForEntity
		}
		mtosForEntity[mtoStubReference.mtoRelationField] = mtoStubReference;
	}

	populateMtos(
		entityMap: {[entityName: string]: {[entityId: string]: any}}
	) {
		for (let mtoEntityName in this.mtoStubReferenceMap) {
			let mtoEntitiesForTypeMap = this.mtoStubReferenceMap[mtoEntityName];
			for (let mtoEntityId in mtoEntitiesForTypeMap) {
				let mtosForEntity = mtoEntitiesForTypeMap[mtoEntityId];
				for (let mtoPropertyName in mtosForEntity) {
					let mtoStubReference: ManyToOneStubReference = mtosForEntity[mtoPropertyName];
					let otmEntitiesForTypeMap = entityMap[mtoStubReference.otmEntityName];
					if(!otmEntitiesForTypeMap) {
						continue;
					}
					let otmEntity = otmEntitiesForTypeMap[mtoStubReference.otmEntityId];
					if(!otmEntity) {
						continue;
					}
					mtoStubReference.mtoParentObject[mtoStubReference.mtoRelationField] = otmEntity;
				}
			}
		}
	}

}
