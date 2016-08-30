import {RelationRecord, RelationType} from "../../../core/entity/Relation";
import {PHJsonGraphQuery} from "../PHGraphQuery";
import {IEntity} from "../../../core/entity/Entity";
import {JSONBaseOperation} from "../../../core/operation/Operation";

/**
 * Created by Papa on 6/12/2016.
 */


declare function require( moduleName: string ): any;

export const CLOUDANT_ENTITY = '__entity__';

var SERVER_ENV = false;
if (SERVER_ENV) {
	// var PouchDB = require('pouchdb');
	// PouchDB.plugin(require('pouchdb-find'));
}

export interface PouchDbFindQuery {
	selector: JSONBaseOperation;
	fields: string[];
	sort: string[];
}

export class PouchDbGraphQuery<IE extends IEntity> {

	childSelectJson: {[propertyName: string]: any} = {};
	childQueries: {[propertyName: string]: PouchDbGraphQuery<any>} = {};
	fields: string[] = ['_id', '_rev'];
	queryJson: PHJsonGraphQuery<IE>;
	selector: any;
	sort: string[];
	queriesInOrder: PouchDbFindQuery[] = [];
	queryMap: {[queryKey: string]: PouchDbFindQuery} = {};

	constructor(
		private entityName: string,
		private queryKey:string,
		private entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: RelationRecord}},
		private entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}},
		queryJson: PHJsonGraphQuery<IE>
	) {
		this.queryJson = JSON.parse(JSON.stringify(queryJson));
	}

	parseAll() {
		let query = this.parse(this.queryJson);
		this.queryMap[this.queryKey] = query;
	}

	parse(
		queryJson:PHJsonGraphQuery<any>
	): PouchDbFindQuery {
		let originalQuerySelector = queryJson.selector;
		let querySelector = {};

		for (let property in originalQuerySelector) {
			let selectorKey = property;
			let fieldFragments = property.split('.');
			switch (fieldFragments.length) {
				case 1:
					// nothing to do, field is not qualified
					break;
				case 2:
				default:
					if (this.entitiesRelationPropertyMap[fieldFragments[0]]) {
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

		let pouchDbFindQuery:PouchDbFindQuery;

		for (let propertyName in this.queryJson) {
			throw `Unexpected property '${propertyName} in entity '${this.entityName}'`;
		}

		return pouchDbFindQuery;
	}

	extractSubQueries(): void {
		let entityRelationPropertyMap = this.entitiesRelationPropertyMap[this.entityName];

		for (let propertyName in this.queryJson) {
			let relationRecord = entityRelationPropertyMap[propertyName];
			if (relationRecord) {
				switch (relationRecord.relationType) {
					case RelationType.MANY_TO_ONE:
						this.addField(propertyName);
						break;
					case RelationType.ONE_TO_MANY:
						break;
				}
				let fragmentJson = this.queryJson[propertyName];
				let childQuery = new PouchDbGraphQuery(relationRecord.entityName, `${this.entityName}.${propertyName}`, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, fragmentJson);
				this.childQueries[propertyName] = childQuery;
				delete this.queryJson[propertyName];
			}
		}
	}

	addField(
		fieldName: string
	): void {
		let existingFields = this.fields.filter((
			aFieldName: string
		) => {
			return aFieldName === fieldName;
		});
		if (existingFields.length > 0) {
			return;
		}
		this.fields.push(fieldName);
	}


	extractSelectFields( queryJson: any ): void {
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
						}
						break;
					default:
						throw `Unsupported typeof '${propertyName}': ${typeOfFragment}`;
				}
			}
		}

	}

}