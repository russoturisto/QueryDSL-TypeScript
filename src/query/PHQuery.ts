import {QEntity, IEntity} from "../core/entity/Entity";
import {Operation} from "../core/operation/Operation";
import {RelationRecord} from "../core/entity/Relation";
/**
 * Created by Papa on 6/22/2016.
 */

export const PH_JOIN_TO_ENTITY = '__joinToEntity__';
export const PH_JOIN_TO_FIELD = '__joinToField__';
export const PH_OPERATOR = '__operator__';
export const PH_INCLUDE = '__include__';

export class PHQuery {

	constructor(
		public iEntity:IEntity,
		public qEntity:QEntity<any>,
		public qEntityMap:{[entityName:string]:QEntity<any>},
		public entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
		public entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}}
	) {
	}

	toJSON():any {
		let jsonFragment = {};

		let entityName = this.qEntity.__entityName__;
		let entityRelationPropertyMap = this.entitiesRelationPropertyMap[entityName];
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];

		for (let propertyName in this.iEntity) {
			let queryFragment = this.iEntity[propertyName];
			if (entityPropertyTypeMap[propertyName]) {
				let typeOfFragment = typeof queryFragment;
				switch (typeOfFragment) {
					case 'boolean':
					case 'number':
					case 'string':
						// No additional processing is needed
						jsonFragment[propertyName] = queryFragment;
						break;
					case 'object':
						if (queryFragment instanceof Date) {
							jsonFragment[propertyName] = queryFragment.toJSON();
						} else if (queryFragment instanceof Operation) {
							jsonFragment[propertyName] = queryFragment.toJSON();
						} else {
							throw `Unsupported instanceof '${propertyName}': ${queryFragment}`;
						}
					default:
						throw `Unsupported typeof '${propertyName}': ${typeOfFragment}`;
				}
			} else if (entityRelationPropertyMap[propertyName]) {
				let entityName = entityRelationPropertyMap[propertyName].entityName;
				let qEntity = this.qEntityMap[entityName];
				if (!qEntity) {
					throw `Unknown entity ${entityName}`;
				}
				let phQuery = new PHQuery(queryFragment, qEntity, this.qEntityMap, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap);
				jsonFragment[propertyName] = phQuery.toJSON();
			} else {
				switch(propertyName) {
					case PH_OPERATOR:
						jsonFragment[PH_OPERATOR] = queryFragment;
				}
				throw `Unexpected IQEntity propertyName: ${propertyName} - is not a field or a relation.`;
			}
		}

		if(!jsonFragment[PH_OPERATOR]) {
			jsonFragment[PH_OPERATOR] = '&and';
		}

		return jsonFragment;
	}

}