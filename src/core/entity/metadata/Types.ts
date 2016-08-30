/**
 * Created by Papa on 8/20/2016.
 */

export enum CascadeType {
	ALL, //Cascade all operations
	DETACH, // Cascade detach operation
	MERGE, // Cascade merge operation
	PERSIST, // Cascade persist operation
	REFRESH, // Cascade refresh operation
	REMOVE // Cascade remove operation
}

export enum FetchType {
	EAGER, // Defines that data must be eagerly fetched.
	LAZY // Defines that data can be lazily fetched.
}

export enum GenerationType {
	TABLE,
	SEQUENCE,
	IDENTITY,
	AUTO
}

export enum AccessType {
	FIELD,
	PROPERTY
}