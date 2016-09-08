import { CascadeType, FetchType } from "./Types";
/**
 * Created by Papa on 8/20/2016.
 */
/**
 * Annotates Id fields of Entities.
 *
 * @returns {function(any, string)}
 * @constructor
 */
export declare function Id(): (targetObject: any, propertyKey: string) => void;
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
export declare function Column(columnConfiguration?: ColumnConfiguration): (targetObject: any, propertyKey: string) => void;
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
export declare function JoinColumn(joinColumnConfiguration?: JoinColumnConfiguration): (targetObject: any, propertyKey: string) => void;
/**
 * Annotates columns.
 *
 * @param generatedValueConfiguration
 * @returns {function(Function)}
 * @constructor
 */
export declare function Transient(): (targetObject: any, propertyKey: string) => void;
export interface ManyToOneElements {
    fetch?: FetchType;
    optional?: boolean;
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
export declare function ManyToOne(elements?: ManyToOneElements): (targetObject: any, propertyKey: string) => void;
export interface OneToManyElements {
    cascade?: CascadeType;
    fetch?: FetchType;
    mappedBy: string;
    orphanRemoval?: boolean;
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
export declare function OneToMany(elements?: OneToManyElements): (targetObject: any, propertyKey: string) => void;
