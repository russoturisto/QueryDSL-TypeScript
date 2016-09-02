import {EntityMetadata} from "../EntityMetadata";
/**
 * Created by Papa on 8/20/2016.
 */


export interface EntityConfiguration {

}

/**
 * Annotates entities.
 *
 * @param entityConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function Entity(entityConfiguration?:EntityConfiguration) {
	return function (constructor:{new (): Object}) {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>constructor;
		if (entityMetadata.entity) {
			throw `Cannot set @Table, it is already set to '${JSON.stringify(entityMetadata.entity)}'`;
		}
		// FIXME: verify this works! (that it's not constructor.name)
		entityMetadata.name = constructor.prototype.name;
		if(!entityConfiguration) {
			entityConfiguration = <any>true;
		}
		entityMetadata.entity = entityConfiguration;
	}
}

export interface TableConfiguration {
	name:string;
}

/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function Table(tableConfiguration?:TableConfiguration) {
	return function (constructor:Function) {
		let entityMetadata: EntityMetadata = <EntityMetadata><any>constructor;
		if (entityMetadata.table) {
			throw `Cannot set @Table, it is already set to '${JSON.stringify(entityMetadata.table)}'`;
		}
		entityMetadata.table = tableConfiguration;
	}
}

/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export function MappedSuperclass() {
	return function (constructor:Function) {
	}
}