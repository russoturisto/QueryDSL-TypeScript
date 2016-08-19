import {QEntity, IEntity} from "../core/entity/Entity";
import {Operation} from "../core/operation/Operation";
import {RelationRecord} from "../core/entity/Relation";
import {IEntityQuery} from "./IEntityQuery";
/**
 * Created by Papa on 6/22/2016.
 */

export const PH_JOIN_TO_ENTITY = '__joinToEntity__';
export const PH_JOIN_TO_FIELD = '__joinToField__';
export const PH_OPERATOR = '__operator__';
export const PH_INCLUDE = '__include__';

export interface PHJsonQuery {
    select:any;
    join?:any;
    where?:any;
}

export class PHQuery<IE extends IEntity> {

    selectFragment:PHQuerySelect<IE>;

	constructor(
		public iEntityQuery:IEntityQuery<IE>,
		public qEntity:QEntity<any>,
		public qEntityMap:{[entityName:string]:QEntity<any>},
		public entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
		public entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}}
	) {
        this.selectFragment = new PHQuerySelect(iEntityQuery.select, qEntity, qEntityMap, entitiesRelationPropertyMap, entitiesPropertyTypeMap);
	}

	toJSON():PHJsonQuery  {
        let selectJsonFragment = this.selectFragment.toJSON();

        let whereJsonFragment = this.iEntityQuery.where;

		return {
		    select: selectJsonFragment,
            where: whereJsonFragment
        };
	}

}

export class PHQuerySelect<IE extends IEntity> {

    constructor(
        public iEntitySelect:IE,
        public qEntity:QEntity<any>,
        public qEntityMap:{[entityName:string]:QEntity<any>},
        public entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
        public entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}}
    ) {
    }

    toJSON():any {
        let selectJsonFragment = {};
        let entityName = this.qEntity.__entityName__;
        let entityRelationPropertyMap = this.entitiesRelationPropertyMap[entityName];
        let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];

        for (let propertyName in this.iEntitySelect) {
            let queryFragment = this.iEntitySelect[propertyName];
            if (entityPropertyTypeMap[propertyName]) {
                let typeOfFragment = typeof queryFragment;
                switch (typeOfFragment) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        // No additional processing is needed
                        selectJsonFragment[propertyName] = queryFragment;
                        break;
                    case 'object':
                        if (queryFragment instanceof Date) {
                            selectJsonFragment[propertyName] = queryFragment.toJSON();
                        } else {
                            throw `Unsupported instanceof '${propertyName}' in select clause: ${queryFragment}`;
                        }
                    default:
                        throw `Unsupported typeof '${propertyName}' in select clause: ${typeOfFragment}`;
                }
            } else if (entityRelationPropertyMap[propertyName]) {
                let entityName = entityRelationPropertyMap[propertyName].entityName;
                let qEntity = this.qEntityMap[entityName];
                if (!qEntity) {
                    throw `Unknown entity '${entityName}' in select clause`;
                }
                let phQuery = new PHQuerySelect(queryFragment, qEntity, this.qEntityMap, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap);
                selectJsonFragment[propertyName] = phQuery.toJSON();
            } else {
                throw `Unexpected IQEntity propertyName: '${propertyName}' in select clause - is not a field or a relation.`;
            }
        }

        if(!selectJsonFragment[PH_OPERATOR]) {
            selectJsonFragment[PH_OPERATOR] = '&and';
        }

        return selectJsonFragment;
    }

}