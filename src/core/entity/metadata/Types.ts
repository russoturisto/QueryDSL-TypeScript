/**
 * Created by Papa on 8/20/2016.
 */

export enum CascadeType {
	ALL, //Cascade all operations
		// Cascade detach is not implemented because there is no session
		// DETACH,
	MERGE, // Cascade on update operation, with Creates and Updates
	PERSIST, // Cascade on create operation with Creates only
		// Cascade refresh is not implemented because there is no session
		// REFRESH,
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