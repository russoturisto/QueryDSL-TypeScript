import {EntityMetadata} from "../EntityMetadata";
import {CascadeType, FetchType} from "./Types";
/**
 * Created by Papa on 8/20/2016.
 */

/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
export function Id() {
	return function (
		targetObject: any,
		propertyKey: string
	) {
		let entityMetadata: EntityMetadata = <EntityMetadata>targetObject;
		if (entityMetadata.idProperty) {
			throw `Cannot set primary key to '${propertyKey}', it is already set to '${entityMetadata.idProperty}'`;
		}
		entityMetadata.idProperty = propertyKey;
	}
}

export interface ColumnConfiguration {
	name: string;
}

/**
 * Annotates columns.
 *
 * @param columnConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function Column( columnConfiguration?: ColumnConfiguration ) {
	return function (
		targetObject: any,
		propertyKey: string
	) {
		let entityMetadata: EntityMetadata = <EntityMetadata>targetObject;
		if(!entityMetadata.columnMap) {
			entityMetadata.columnMap = {};
		}
		entityMetadata.columnMap[propertyKey] = columnConfiguration;
	}
}


export interface JoinColumnConfiguration {
	name: string;
	nullable: boolean;
}

/**
 * Annotates columns.
 *
 * @param columnConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function JoinColumn( joinColumnConfiguration?: JoinColumnConfiguration ) {
	return function (
		targetObject: any,
		propertyKey: string
	) {
		let entityMetadata: EntityMetadata = <EntityMetadata>targetObject;
		if(!entityMetadata.joinColumns) {
			entityMetadata.joinColumns = {};
		}
		entityMetadata.joinColumns[propertyKey] = joinColumnConfiguration;
	}
}

/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function Transient() {
	return function (
		targetObject: any,
		propertyKey: string
	) {
		let entityMetadata: EntityMetadata = <EntityMetadata>targetObject;
		if (!entityMetadata.transient) {
			entityMetadata.transient = {};
		}
		entityMetadata.transient[propertyKey] = true;
	}
}



export interface ManyToOneElements {
	cascade?:CascadeType;
	fetch?:FetchType;
	optional?:boolean;
}

/**
 * Specifies a single-valued association to another entity class that has many-to-one multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/ManyToOne.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export function ManyToOne( elements?: ManyToOneElements ) {
	return function (
		targetObject: any,
		propertyKey: string
	) {
		let entityMetadata: EntityMetadata = <EntityMetadata>targetObject;
		if (!entityMetadata.manyToOneMap) {
			entityMetadata.manyToOneMap = {};
		}
		entityMetadata.manyToOneMap[propertyKey] = elements;
	}

}

export interface OneToManyElements {
	cascade?:CascadeType;
	fetch?:FetchType;
	mappedBy:string;
	orphanRemoval?:boolean;
}

/**
 * Specifies a many-valued association with one-to-many multiplicity.
 *
 * http://docs.oracle.com/javaee/7/api/javax/persistence/OneToMany.html
 *
 * @param elements
 * @returns {function(any, string)}
 * @constructor
 */
export function OneToMany( elements?: OneToManyElements ) {
	return function (
		targetObject: any,
		propertyKey: string
	) {
		let entityMetadata: EntityMetadata = <EntityMetadata>targetObject;
		if (!entityMetadata.oneToManyMap) {
			entityMetadata.oneToManyMap = {};
		}
		entityMetadata.oneToManyMap[propertyKey] = elements;
	}

}
