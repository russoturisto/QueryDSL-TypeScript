import {IEntity, QEntity} from "../../core/entity/Entity";
import {EntityRelationRecord} from "../../core/entity/Relation";
import {JSONBaseOperation} from "../../core/operation/Operation";
import {PHQuery, PHRawQuery} from "../PHQuery";
/**
 * Created by Papa on 8/15/2016.
 */

export enum GraphFilter {
	ALL,
	CHILDREN
}

export interface PHJsonGraphQuery<IE extends IEntity> extends PHRawQuery<IE> {
	filter: GraphFilter;
	fields: IE;
	selector: JSONBaseOperation;
	execOrder: number;
}

export class PHGraphQuery<IE extends IEntity> implements PHQuery<IE> {

	childMap: {[entity: string]: PHGraphQuery<any>} = {};

	constructor( //
		public phJsonQuery: PHJsonGraphQuery<IE>,
		public qEntity: QEntity<any>,
		public qEntityMap: {[entityName: string]: QEntity<any>},
		public entitiesRelationPropertyMap: {[entityName: string]: {[propertyName: string]: EntityRelationRecord}},
		public entitiesPropertyTypeMap: {[entityName: string]: {[propertyName: string]: boolean}}
	) {
		//
	}

	toJSON(): any {
		let fields: IE;
		if (this.phJsonQuery.fields && typeof fields === 'object' && !(fields instanceof Date)) {
			fields = this.phJsonQuery.fields;
			if (!this.phJsonQuery.filter) {
				this.phJsonQuery.filter = GraphFilter.CHILDREN;
			}
			this.validateQuery(this.phJsonQuery.selector, this.qEntity.__entityName__);
		} else {
			fields = <any>this.phJsonQuery;
			this.phJsonQuery = {
				filter: GraphFilter.CHILDREN,
				fields: fields,
				selector: undefined,
				execOrder: undefined
			};
		}
		this.validateFieldsAndChildren(fields);
		this.setExecOrders();
	}

	setExecOrders() {
		let execOrders: number[];
		this.gatherExecOrders(execOrders);
		this.assignMissingExecOrders(execOrders);
	}

	assignMissingExecOrders(
		execOrders: number[]
	) {
		if (!this.phJsonQuery.execOrder) {
			let currentExecOrder: number;
			for (let i = 1; i < execOrders.length; i++) {
				let execOrder = execOrders[i];
				if (!execOrder) {
					currentExecOrder = i;
					break;
				}
			}
			if (!currentExecOrder) {
				currentExecOrder = execOrders.length;
			}
			this.phJsonQuery.execOrder = currentExecOrder;
			execOrders[currentExecOrder] = currentExecOrder;
		}

		for (let entityName in this.childMap) {
			let childQuery = this.childMap[entityName];
			childQuery.assignMissingExecOrders(execOrders);
		}
	}

	gatherExecOrders(
		execOrders: number[]
	) {
		if (this.phJsonQuery.execOrder < 1) {
			throw `Graph Query execution orders must be >= 1`;
		}
		if (this.phJsonQuery.execOrder) {
			if (execOrders[this.phJsonQuery.execOrder]) {
				throw `execOrder ${this.phJsonQuery.execOrder} defined more than once.`;
			}
			execOrders[this.phJsonQuery.execOrder] = this.phJsonQuery.execOrder;
		}
		for (let entityName in this.childMap) {
			let childQuery = this.childMap[entityName];
			childQuery.gatherExecOrders(execOrders);
		}
	}

	validateQuery( //
		query: JSONBaseOperation,
		entityName: string
	) {
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
							if (queryEntityName !== entityName) {
								throw `Invalid entity name in query: '${queryEntityName}', expecting ${entityName}`;
							}
							fieldName = queryFieldFragments[1];
							break;
						default:
							throw `Invalid number of query fragments in ${propertyName}`;
					}
					let fieldProperty = entityProperties[fieldName];
					if (!fieldProperty) {
						throw `Could not find property '${fieldName}' for entity '${entityName}', NOTE: relations are not supported`;
					}
					break;
			}
		}

	}

	validateFieldsAndChildren( fields: IE ) {

		let fieldsJsonFragment = {};
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
						fieldsJsonFragment[propertyName] = queryFragment;
						break;
					case 'object':
						if (queryFragment instanceof Date) {
							fieldsJsonFragment[propertyName] = queryFragment.toJSON();
						} else {
							throw `Unsupported instanceof '${propertyName}' in fields clause: ${queryFragment}`;
						}
					default:
						throw `Unsupported typeof '${propertyName}' in fields clause: ${typeOfFragment}`;
				}
			} else if (entityRelationPropertyMap[propertyName]) {
				let entityName = entityRelationPropertyMap[propertyName].entityName;
				let qEntity = this.qEntityMap[entityName];
				if (!qEntity) {
					throw `Unknown entity '${entityName}' in fields clause`;
				}
				let phGraphQuery = new PHGraphQuery(queryFragment, qEntity, this.qEntityMap, this.entitiesRelationPropertyMap, this.entitiesPropertyTypeMap);
				this.childMap[entityName] = phGraphQuery;
				fieldsJsonFragment[propertyName] = phGraphQuery.toJSON();
			} else {
				throw `Unexpected IEntity propertyName: '${propertyName}' in fields clause - not a field or a relation.`;
			}
		}
	}

}