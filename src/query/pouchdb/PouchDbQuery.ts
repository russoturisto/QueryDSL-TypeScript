import {PH_OPERATOR, PH_JOIN_TO_ENTITY, PH_JOIN_TO_FIELD, PH_INCLUDE} from "../PHQuery";
import {RelationRecord, RelationType} from "../../core/entity/Relation";

/**
 * Created by Papa on 6/12/2016.
 */


declare function require( moduleName:string ):any;

var SERVER_ENV = false;
if(SERVER_ENV) {
	// var PouchDB = require('pouchdb');
	// PouchDB.plugin(require('pouchdb-find'));
}

export const CLOUDANT_ENTITY = '__entity__';

export interface JoinField {
	getJoinCount():number;
}

export class JoinFieldNode implements JoinField {

	constructor(
		private entityName:string,
		private fieldName:string,
		private operator:string
	) {
	}

	getJoinCount():number {
		return 1;
	}
}

export class JoinFieldJunction implements JoinField {

	constructor(
		private children:JoinField[],
		private operator:string
	) {
	}

	getJoinCount():number {
		return this.children.map((
			joinField:JoinField
		) => {
			return joinField.getJoinCount();
		}).reduce((
			previousValue,
			currentValue
		) => {
			return previousValue + currentValue;
		});
	}
}

export class PouchDbQuery {

	childQueries:{[propertyName:string]:PouchDbQuery} = {};
	joinFields:JoinField[] = [];
	fields:string[] = ['_id', '_rev'];
	queryJson:any;
	selector:any;
	sort:string[];
	topLevelArray:any[];
	topLevelOperator:string;

	constructor(
		private entityName:string,
		private entitiesRelationPropertyMap:{[entityName:string]:{[propertyName:string]:RelationRecord}},
		private entitiesPropertyTypeMap:{[entityName:string]:{[propertyName:string]:boolean}},
		queryJson:any
	) {
		this.queryJson = JSON.parse(JSON.stringify(queryJson));
	}

	parse():void {
		this.topLevelOperator = this.queryJson[PH_OPERATOR];
		switch (this.topLevelOperator) {
			case '&and':
			case '&or':
				break;
			default:
				throw `Unexpected top level operator ${this.topLevelOperator}`;
		}
		delete this.queryJson[PH_OPERATOR];
		this.topLevelArray = [];
		this.selector = {};

		let objectSelector = [];
		this.selector['$and'] = objectSelector;
		objectSelector[CLOUDANT_ENTITY] = {
			'$eq': this.entityName
		};
		objectSelector[this.topLevelOperator] = this.topLevelArray;

		this.extractSelectFields();
		this.extractSubQueries();
		this.extractJoinFields();
		this.extractFieldOperators();

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
				let childQuery = new PouchDbQuery(relationRecord.entityName, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap, fragmentJson);
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

	extractSelectFields():void {
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[this.entityName];

		for (let propertyName in this.queryJson) {
			if (entityPropertyTypeMap[propertyName]) {
				let fragment = this.queryJson[propertyName];
				let typeOfFragment = typeof fragment;
				switch (typeOfFragment) {
					case 'boolean':
					case 'number':
					case 'string':
						this.fields.push(propertyName);
						delete this.queryJson[propertyName];
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

	extractFieldOperators():void {
		let entityPropertyTypeMap = this.entitiesPropertyTypeMap[this.entityName];

		for (let propertyName in this.queryJson) {
			if (entityPropertyTypeMap[propertyName]) {
				let fragment = this.queryJson[propertyName];
				let fieldOperator = this.flipFieldOperators(propertyName, fragment);
				this.topLevelArray.push(fieldOperator);
				delete this.queryJson[propertyName];
			}
		}
	}

	/**
	 *
	 * @param fieldName
	 * @param fragment
	 *
	 * Convert:
	 *
	 * field: {
	 *   $or: [
	 *     { $eq: 1 },
	 *     { $and: [
	 *       { $not: { $lt: 20 } },
	 *       { $ne: 2 }
	 *     ] }
	 *   ]
	 * }
	 *
	 * To:
	 *
	 * $or: [
	 *   { field: { $eq: 1 },
	 *   { $and: [
	 *     { field: { $not: { $lt: 20 } },
	 *     { field: { $ne: 2 }
	 *     ]
	 *   ]}
	 * }
	 *
	 * Scan for Logical Operators and if present move field reference to just ouside the non-logical operators.
	 */
	private flipFieldOperators(
		fieldName:string,
		fragment:any
	):any {
		let operators = [];
		for (let operator in fragment) {
			operators.push(operator);
		}
		if (operators.length !== 1) {
			throw `Unexpected number of operators [${operators.length}] in ${fragment}.  Expecting 1.`;
		}
		let operator = operators[0];
		let flippedFragment = {};
		switch (operator) {
			case '&and':
			case '&or':
				let subFragmentArray = fragment[operator];
				flippedFragment[operator] = subFragmentArray.map((
					subFragment
				) => {
					return this.flipFieldOperators(fieldName, subFragment);
				});

			default:
				flippedFragment[fieldName] = fragment;
		}

		return flippedFragment;
	}
}