import {MappedEntityArray} from "../../../../core/MappedEntityArray";
import {ManyToOneStubReference} from "./BridgedMtoMapper";
/**
 * Created by Papa on 10/15/2016.
 */

export interface OneToManyStubReference {
	otmEntityName: string;
	otmPropertyName: string;
	otmObject: any;
}

// For OtM mapping in bridged queries
export class BridgedQueryOtmMapper {
	// Map of MtO referred objects by OtM references
	mtoEntityReferenceMap: {
		// Name of OTM reference class
		[otmReferenceEntityName: string]: {
			// Id of OTM reference object
			[otmReferenceId: string]: {
				// Name of the property of OtM reference
				[otmProperty: string]: MappedEntityArray<any>}}} = {};
	// Map of objects with OtM references
	otmEntityReferenceMap: {
		// Name of class with OtM reference
		[otmEntityName: string]: {
			// Id of object with OtM reference
			[otmEntityId: string]: any}} = {};

	addMtoReference(
		mtoStubReference: ManyToOneStubReference,
		mtoEntityId: string | number
	) {
		// If the @OneToMany({ mappedBy: ... }) is missing, there is nothing to map to
		if (!mtoStubReference.otmEntityField) {
			return;
		}
		// Add into mtoEntityReferenceMap
		let mapForOtmEntityName: {[otmReferenceId: string]: {[otmProperty: string]: MappedEntityArray<any>}} = this.mtoEntityReferenceMap[mtoStubReference.otmEntityName];
		if (!mapForOtmEntityName) {
			mapForOtmEntityName = {};
			this.mtoEntityReferenceMap[mtoStubReference.otmEntityName] = mapForOtmEntityName;
		}

		let mapForOtmEntity: {[otmProperty: string]: MappedEntityArray<any>} = mapForOtmEntityName[mtoStubReference.otmEntityId];
		if (!mapForOtmEntity) {
			mapForOtmEntity = {};
			mapForOtmEntityName[mtoStubReference.otmEntityId] = mapForOtmEntity;
		}
		let mtoCollection: MappedEntityArray<any> = mapForOtmEntity[mtoStubReference.otmEntityField];

		mtoCollection.put(mtoStubReference.mtoParentObject);
	}

	addOtmReference(
		otmStubReference: OneToManyStubReference,
		otmEntityId: string | number
	) {
		let mapForOtmEntityName: {[otmEntityId: string]: any} = this.otmEntityReferenceMap[otmStubReference.otmEntityName];
		if (!mapForOtmEntityName) {
			mapForOtmEntityName = {};
			this.otmEntityReferenceMap[otmStubReference.otmEntityName] = mapForOtmEntityName;
		}

		let otmRecordByPropertyName = mapForOtmEntityName[otmEntityId];
		if (!otmRecordByPropertyName) {
			otmRecordByPropertyName = {};
			mapForOtmEntityName[otmEntityId] = otmRecordByPropertyName;
		}

		otmRecordByPropertyName[otmStubReference.otmPropertyName] = otmStubReference.otmObject;
	}

	populateOtms(
		entityMap: {[entityName: string]: {[entityId: string]: any}},
		keepMappedEntityArrays: boolean
	) {
		for (let otmEntityName in this.mtoEntityReferenceMap) {
			let entityOfNameMap = entityMap[otmEntityName];
			// If there are no entities of this type in query results, just keep the stubs
			if (!entityOfNameMap) {
				continue;
			}
			let entityWithOtmMap: {[otmEntityId: string]: any} = this.otmEntityReferenceMap[otmEntityName];
			// If there are no OTM for this type in query results, no mapping needs to happen
			if (!entityWithOtmMap) {
				continue;
			}
			let mapForOtmEntityName: {[otmReferenceId: string]: {[otmProperty: string]: MappedEntityArray<any>}} = this.mtoEntityReferenceMap[otmEntityName];
			for (let otmEntityId in mapForOtmEntityName) {
				let referencedEntitiesByPropertyMap: {[otmProperty: string]: MappedEntityArray<any>} = mapForOtmEntityName[otmEntityId];
				let otmRecordByPropertyName = entityWithOtmMap[otmEntityId];
				// If there are no OtMs for this entity, no mapping needs to happen
				if (!otmRecordByPropertyName) {
					continue;
				}
				for (let otmProperty in referencedEntitiesByPropertyMap) {
					let otmEntity = otmRecordByPropertyName[otmProperty];
					// If OtM entity doesn't have this collection, no mapping needs to happen
					if(!otmEntity) {
						continue;
					}
					let referencedEntityMap: MappedEntityArray<any> = referencedEntitiesByPropertyMap[otmProperty];

					let otmCollection: MappedEntityArray<any> = otmEntity[otmProperty];
					// If @OneToMany isn't set yet
					if (!otmCollection) {
						otmEntity[otmProperty] = referencedEntityMap;
					} else {
						otmCollection.putAll(referencedEntityMap);
					}
					if (!keepMappedEntityArrays) {
						otmRecordByPropertyName[otmProperty] = otmEntity[otmProperty].slice();
					}
				}
			}
		}
	}
}