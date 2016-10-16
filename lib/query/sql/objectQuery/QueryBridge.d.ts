import { IQueryParser } from "./IQueryParser";
/**
 * Created by Papa on 10/8/2016.
 */
/**
 a) Reconstruct the Many-To-One relations by Id
 for this we need
 1) a map of all entities [by Type]:[by id]:Entity
 2) a map of all stubs Many-To-One stubs, [by Type]:[by id]: { propertyName, parentObject }
 Then it's a simple operation of mapping all available entities to all stubs
 b) Reconstruct the One-To-Many relations by Tree
 for this we need
 1) the entity map from 1a)
 2) a similar map of all One-To-Many stubs, [by Type]:[by id]: { propertyName, parentObject,
manyEntitySet }
 where manyEntitySet is a set of all entities in a given OneToMany collection, by their id
 Then we need to navigate all entities in the entity map, and
 - for every found Many-To-One reference in each entity
 Lookup the related One-To-Many stub
 If the stub is found, add this entity to the manyEntitySet
 - at the end we need to go though all the One-To-Many stubs and create arrays ouf of the sets
 */
export declare class QueryBridge implements IQueryParser {
}
