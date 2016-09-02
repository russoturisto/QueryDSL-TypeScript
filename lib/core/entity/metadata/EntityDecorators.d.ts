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
export declare function Entity(entityConfiguration?: EntityConfiguration): (constructor: new () => Object) => void;
export interface TableConfiguration {
    name: string;
}
/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function Table(tableConfiguration?: TableConfiguration): (constructor: Function) => void;
/**
 * Annotates tables.
 *
 * @param tableConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function MappedSuperclass(): (constructor: Function) => void;
