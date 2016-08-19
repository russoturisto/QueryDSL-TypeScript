import {IEntity, QEntity} from "../core/entity/Entity";
import {RelationRecord} from "../core/entity/Relation";
import {JSONBaseOperation} from "../core/operation/Operation";
/**
 * Created by Papa on 8/15/2016.
 */

export enum GraphFilter {
    ALL,
    CHILDREN
}

export interface PHJsonGraphQuery<EQ extends IEntity> {
    filter:GraphFilter;
    fields:any;
    query:JSONBaseOperation;
    executionOrder:number;
}

export class PHQueryDsl<EQ extends IEntity> {

    constructor( //
        public phJsonQuery:PHJsonGraphQuery<EQ>,
        public qEntity:QEntity<any>,
        public qEntityMap:{[entityName:string]:QEntity<any>},
        public entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
        public entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}}) {
        //
    }

    toJSON():any {
        let fields:EQ;
        if (this.phJsonQuery.fields && typeof fields === 'object' && !(fields instanceof Date)) {
            fields = this.phJsonQuery.fields;
            this.validateQuery(this.phJsonQuery.query, this.qEntity.__entityName__);
        } else {
            fields = <any>this.phJsonQuery;
        }
        this.validateFieldsAndChildren(fields);
    }

    validateQuery( //
        query:JSONBaseOperation,
        entityName:string) {
        if (!query) {
            return;
        }
        let entityRelations = this.entitiesRelationPropertyMap[entityName];
        let entityProperties = this.entitiesPropertyTypeMap[entityName];
        let foundKey = false;
        for (let propertyName in query) {
            switch (propertyName) {
                case '$and':
                case '$or':
                    let logicalFragments = query[propertyName];
                    for (let logicalFragment in logicalFragments) {
                        this.validateQuery(logicalFragment, entityName);
                    }
                case '$not':
                    let logicalFragment = query[propertyName];
                    this.validateQuery(logicalFragment, entityName);
                default:
                    let queryFieldFragments = propertyName.split('.');
                    let fieldName;
                    switch (queryFieldFragments.length) {
                        case 1:
                            fieldName = propertyName;
                            break;
                        case 2:
                            let queryEntityName = queryFieldFragments[0];
                            if(queryEntityName !== entityName) {
                                throw `Invalid entity name in query: '${queryEntityName}', expecting ${entityName}`;
                            }
                            fieldName = queryFieldFragments[1];
                            break;
                        default:
                            throw `Invalid number of query fragments in ${propertyName}`;
                    }
                    let fieldProperty = entityProperties[fieldName];
                    if(!fieldProperty) {
                        throw `Could not find property '${fieldName}' for entity '${entityName}', NOTE: relations are not supported`;
                    }
                    break;
            }
        }

    }

    validateFieldsAndChildren(fields:EQ) {

        let selectJsonFragment = {};
        let entityName = this.qEntity.__entityName__;
        let entityRelationPropertyMap = this.entitiesRelationPropertyMap[entityName];
        let entityPropertyTypeMap = this.entitiesPropertyTypeMap[entityName];

        for (let propertyName in fields) {
            let queryFragment = fields[propertyName];
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
            }
        }
    }

}