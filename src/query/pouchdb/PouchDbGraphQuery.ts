import {RelationRecord, RelationType} from "../../core/entity/Relation";
import {PHJsonGraphQuery} from "../PHGraphQuery";
import {IEntity} from "../../core/entity/Entity";
import {JSONBaseOperation} from "../../core/operation/Operation";

/**
 * Created by Papa on 6/12/2016.
 */


declare function require( moduleName:string ):any;

export const CLOUDANT_ENTITY = '__entity__';

var SERVER_ENV = false;
if(SERVER_ENV) {
	// var PouchDB = require('pouchdb');
	// PouchDB.plugin(require('pouchdb-find'));
}

export interface PouchDbFindQuery {
	selector:JSONBaseOperation;
	fields:string[];
	sort:string[];
}

export class PouchDbGraphQuery<IE extends IEntity> {

	childSelectJson:{[propertyName:string]:any} = {};
	childQueries:{[propertyName:string]:PouchDbGraphQuery<any>} = {};
	fields:string[] = ['_id', '_rev'];
	queryJson:PHJsonGraphQuery<IE>;
	selector:any;
	sort:string[];
	queryMap:{[entityAndRelationName:string]:PouchDbFindQuery} = {};
	queriesInOrder: PouchDbFindQuery[] = [];

	constructor(
		private entityName:string,
		private entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
		private entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}},
		queryJson:PHJsonGraphQuery<IE>
	) {
		this.queryJson = JSON.parse(JSON.stringify(queryJson));
	}

	parse():void {
		let originalQuerySelector = this.queryJson.selector;
		let querySelector = {};

		for(let property in originalQuerySelector) {
			let selectorKey = property;
			let fieldFragments = property.split('.');
			switch(fieldFragments.length) {
				case 1:
					// nothing to do, field is not qualified
					break;
				case 2:
				default:
					if(this.entitiesRelationPropertyMap[fieldFragments[0]]) {
						let value = querySelector[property];
						fieldFragments.shift();
						selectorKey = fieldFragments.join('.');
					}
			}
			querySelector[selectorKey] = originalQuerySelector[property];
		}

		let objectSelector = [];
		this.selector['$and'] = objectSelector;
		objectSelector[CLOUDANT_ENTITY] = {
			'$eq': this.entityName
		};
		objectSelector.push(querySelector);

		this.extractSelectFields(this.queryJson.fields);
		this.extractSubQueries();
		this.extractJoinFields();

		for (let propertyName in this.queryJson) {
			throw `Unexpected property '${propertyName} in entity '${this.entityName}'`;
		}

		return this.selector;
	}

	extractSubQueries():void {
		let entityRelationPropertyMap = this.entitiesRelationPropertyMap[this.entityName];

		for (let propertyName in this.queryJson) {
			let relationRecord = entityRelationPropertyMap[propertyName];
			if (relationRecord) {
				switch(relationRecord.relationType) {
					case RelationType.MANY_TO_ONE:
						this.addField(propertyName);
						break;
					case RelationType.ONE_TO_MANY:
						break;
				}
				let fragmentJson = this.queryJson[propertyName];
				let childQuery = new PouchDbGraphQuery(relationRecord.entityName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, fragmentJson);
				this.childQueries[propertyName] = childQuery;
				delete this.queryJson[propertyName];
			}
		}
	}

	addField(
		fieldName:string
	):void {
		let existingFields = this.fields.filter((
			aFieldName:string
		) => {
			return aFieldName === fieldName;
		});
		if(existingFields.length > 0) {
			return;
		}
		this.fields.push(fieldName);
	}

	extractJoinFields():void {
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[this.entityName];

		for (let propertyName in this.queryJson) {
			if (entityPropertyTypeMap[propertyName]) {
				let fragmentJson = this.queryJson[propertyName];
				let joinField = this.extractJoinField(propertyName, fragmentJson);
				if (joinField) {
					this.joinFields.push(joinField);
				}
				// If there is nothing else specified in the field after the Join has been extracted, remove
				// the field
				if (!Object.keys(fragmentJson).length) {
					delete this.queryJson[propertyName];
				}
			}
		}
	}

	extractJoinField(
		fieldName:string,
		fragment:any
	):JoinField {
		let joinField:JoinField;
		for (let operator in fragment) {
			let subFragment = fragment[operator];
			let joinToEntity = subFragment[PH_JOIN_TO_ENTITY];
			let joinToField = subFragment[PH_JOIN_TO_FIELD];
			if (joinToEntity && joinToField) {
				// FIXME: add support for Join Fields
				throw `Join fields are not yet supported`;
				/**
				 switch (operator) {
					case '&eq':
					case '&gt':
					case '&gte':
					case '&lt':
					case '&lte':
					case '&ne':
						break;
					default:
						throw `Invalid operator '${operator}' for join of ${fieldName} to ${joinToEntity}.${joinToField}`;
				}
				 joinField = new JoinFieldNode(subFragment[PH_JOIN_TO_ENTITY], subFragment[PH_JOIN_TO_FIELD], operator);
				 delete fragment[operator];
				 **/
			} else if (joinToEntity || joinToField) {
				throw `Both '${PH_JOIN_TO_ENTITY}'  && '${PH_JOIN_TO_FIELD}' must be specified for join: operator '${operator}' of ${fieldName} to ${joinToEntity}.${joinToField}`;
			} else {
				switch (operator) {
					case '&and':
					case '&or':
						let childJoinFields:JoinField[] = [];
						subFragment.forEach((
							childFragment
						) => {
							let childJoinField = this.extractJoinField(fieldName, childFragment);
							if (childJoinField) {
								childJoinFields.push(childJoinField);
							}
						});
						if (childJoinFields.length) {
							joinField = new JoinFieldJunction(childJoinFields, operator);
						}
					default:
						break;
				}
			}
		}

		return joinField;
	}

	extractSelectFields(queryJson:any):void {
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[this.entityName];

		for (let propertyName in queryJson) {
			if (entityPropertyTypeMap[propertyName]) {
				let fragment = queryJson[propertyName];
				let typeOfFragment = typeof fragment;
				switch (typeOfFragment) {
					case 'boolean':
					case 'number':
					case 'string':
						this.fields.push(propertyName);
						delete queryJson[propertyName];
						break;
					case 'object':
						if (fragment instanceof Date) {
							this.fields.push(propertyName);
							delete this.queryJson[propertyName];
						} else if (fragment[PH_INCLUDE]) {
							this.fields.push(propertyName);
							delete fragment[PH_INCLUDE];
						}
						break;
					default:
						throw `Unsupported typeof '${propertyName}': ${typeOfFragment}`;
				}
			}
		}

	}

}