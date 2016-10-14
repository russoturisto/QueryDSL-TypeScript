import {SQLDataType} from "./SQLStringQuery";
/**
 * Created by Papa on 10/14/2016.
 */

export class LastObjectTracker {
	lastObjectMap: {[alias: string]: any} = {};
	currentObjectMap: {[alias: string]: any} = {};
	objectEqualityMap: {[alias: string]: boolean} = {};

	addProperty(
		entityAlias: string,
		resultObject: any,
		dataType: SQLDataType,
		propertyName: string
	): void {
		// If we already know that this is a new object, no need to keep on checking
		if (!this.objectEqualityMap[entityAlias]) {
			return;
		}
		let lastObject = this.lastObjectMap[entityAlias];
		// If there was no last object
		if (!lastObject) {
			this.objectEqualityMap[entityAlias] = true;
			return;
		}
		// Types are guaranteed to be the same, so:
		// If the last property is not there or is falsy
		if (!lastObject[propertyName]) {
			this.objectEqualityMap[entityAlias] = !!resultObject[propertyName];
			return;
		} // If the current property is not there or is falsy
		else if (!resultObject[propertyName]) {
			this.objectEqualityMap[entityAlias] = !!lastObject[propertyName];
			return;
		}
		// Both of the properties are truthy
		switch (dataType) {
			case SQLDataType.DATE:
				this.objectEqualityMap[entityAlias] = (lastObject[propertyName].getTime() === resultObject[propertyName]getTime());
				return;
			default:
				this.objectEqualityMap[entityAlias] = (lastObject[propertyName] === resultObject[propertyName]);
				return;
		}
	}

	private getObject(
		entityAlias: string,
		resultObject: any
	): any {
		let currentObject = this.currentObjectMap[entityAlias];
		if (currentObject === resultObject) {
			return currentObject;
		} else {
			throw `Unexpected different entity instance for alias ${entityAlias}`;
		}
	}
}