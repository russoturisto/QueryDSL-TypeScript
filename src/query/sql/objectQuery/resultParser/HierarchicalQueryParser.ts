import {IQueryParser, AbstractObjectQueryParser} from "./IQueryParser";
import {IQEntity} from "../../../../core/entity/Entity";
import {SQLDataType} from "../../SQLStringQuery";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {RelationRecord} from "../../../../core/entity/Relation";
/**
 * Created by Papa on 10/16/2016.
 */

/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
export class HierarchicalQueryParser extends AbstractObjectQueryParser implements IQueryParser {

	currentRowObjectMap: {[alias: string]: any} = {};
	objectEqualityMap: {[alias: string]: boolean} = {};

	lastRowObjectMap: {[alias: string]: any} = {};

	currentObjectOneToManys: {[propertyName: string]: any[]} = {};

	addEntity(
		entityAlias: string,
		qEntity: IQEntity
	): any {
		let resultObject = new qEntity.__entityConstructor__();
		this.currentRowObjectMap[entityAlias] = resultObject;

		return resultObject;
	}

	addProperty(
		entityAlias: string,
		resultObject: any,
		dataType: SQLDataType,
		propertyName: string,
		propertyValue: any
	): void {
		resultObject[propertyName] = propertyValue;
		if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
			return;
		}
		// Both last and current objects must exist here
		let lastObject = this.lastRowObjectMap[entityAlias];
		// Both of the properties are truthy
		switch (dataType) {
			case SQLDataType.DATE:
				this.objectEqualityMap[entityAlias] = (lastObject[propertyName].getTime() === resultObject[propertyName].getTime());
				return;
			default:
				this.objectEqualityMap[entityAlias] = (lastObject[propertyName] === resultObject[propertyName]);
				return;
		}
	}

	private isDifferentOrDoesntExist(
		entityAlias: string,
		resultObject: any,
		propertyName: string
	): boolean {
		// If we already know that this is a new object, no need to keep on checking
		if (!this.objectEqualityMap[entityAlias]) {
			return true;
		}
		let lastObject = this.lastRowObjectMap[entityAlias];
		// If there was no last object
		if (!lastObject) {
			this.objectEqualityMap[entityAlias] = false;
			return true;
		}

		// Types are guaranteed to be the same, so:

		// If the last property is not there or is falsy
		if (!lastObject[propertyName]) {
			this.objectEqualityMap[entityAlias] = !!resultObject[propertyName];
			return true;
		} // If the current property is not there or is falsy
		else if (!resultObject[propertyName]) {
			this.objectEqualityMap[entityAlias] = !!lastObject[propertyName];
			return true;
		}

		return false;
	}

	bufferManyToOneStub(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		resultObject: any,
		propertyName: string,
		relationQEntity: IQEntity,
		relationEntityMetadata: EntityMetadata,
		relatedEntityId: any
	): void {
		this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
		this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
	}

	private addManyToOneReference(
		entityAlias: string,
		resultObject: any,
		propertyName: string,
		manyToOneIdField: string
	): void {
		if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
			return;
		}
		// Both last and current objects must exist here
		let lastObject = this.lastRowObjectMap[entityAlias];
		this.objectEqualityMap[entityAlias] = (lastObject[propertyName][manyToOneIdField] === resultObject[propertyName][manyToOneIdField]);
	}

	bufferBlankManyToOneStub(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		resultObject: any,
		propertyName: string,
		relationQEntity: IQEntity,
		relationEntityMetadata: EntityMetadata
	): void {
		this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
	}

	bufferManyToOneObject(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		resultObject: any,
		propertyName: string,
		relationQEntity: IQEntity,
		relationEntityMetadata: EntityMetadata,
		childResultObject: any
	): void {
		resultObject[propertyName] = childResultObject;
		if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
			return;
		}
		// Both last and current objects must exist here
		let lastObject = this.lastRowObjectMap[entityAlias];
		// @ManyToOne objects will have been merged by now, just check if its the same object
		this.objectEqualityMap[entityAlias] = lastObject[propertyName] === resultObject[propertyName];
	}

	bufferBlankManyToOneObject(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		resultObject: any,
		propertyName: string,
		relationQEntity: IQEntity,
		relationEntityMetadata: EntityMetadata
	): void {
		this.addManyToOneReference(entityAlias, resultObject, propertyName, relationEntityMetadata.idProperty);
	}

	bufferOneToManyStub(
		otmEntityName: string,
		otmPropertyName: string
	): void {
		throw `@OneToMany stubs not allowed in QueryResultType.HIERARCHICAL`;
	}

	bufferOneToManyCollection(
		entityAlias: string,
		resultObject: any,
		otmEntityName: string,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		childResultObject: any
	): void {
		resultObject[propertyName] = [childResultObject];
		this.addOneToManyCollection(entityAlias, resultObject, propertyName);
	}

	addOneToManyCollection(
		entityAlias: string,
		resultObject: any,
		propertyName: string
	): void {
		let currentOtmCollection = resultObject[propertyName];
		this.currentObjectOneToManys[propertyName] = currentOtmCollection;
		if (this.isDifferentOrDoesntExist(entityAlias, resultObject, propertyName)) {
			return;
		}
		let lastObject = this.lastRowObjectMap[entityAlias];
		let lastOtmCollection = lastObject[propertyName];

		// Now both arrays are guaranteed to exist

		// TODO: verify assumption below:
		// For @OneToMany collections, if existence of last child object changes it must be a new object
		if (!lastOtmCollection.length) {
			if (currentOtmCollection.length) {
				this.objectEqualityMap[entityAlias] = false;
			}
		} else if (!currentOtmCollection.length) {
			if (lastOtmCollection.length) {
				this.objectEqualityMap[entityAlias] = false;
			}
		}
		// Otherwise if it still exists
	}

	bufferBlankOneToMany(
		entityAlias: string,
		resultObject: any,
		otmEntityName: string,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		childResultObject: any
	): void {
		resultObject[propertyName] = [];
		this.addOneToManyCollection(entityAlias, resultObject, propertyName);
	}

	flushEntity(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		selectClauseFragment: any,
		entityPropertyTypeMap: {[propertyName: string]: boolean},
		entityRelationMap: {[propertyName: string]: RelationRecord},
		entityId: any,
		resultObject: any
	): any {
		return this.mergeEntity(entityAlias, resultObject);
	}

	mergeEntity(
		entityAlias: string,
		resultObject: any
	): any {
		let isSameObjectAsLastRow = this.objectEqualityMap[entityAlias];
		this.objectEqualityMap[entityAlias] = true;

		let oneToManys = this.currentObjectOneToManys;
		this.currentObjectOneToManys = {};
		// If it's a new object
		if (!isSameObjectAsLastRow) {
			return resultObject;
		}

		// All equality checks have passed - this is the same exact object as last time
		resultObject = this.lastRowObjectMap[entityAlias];
		this.currentRowObjectMap[entityAlias] = resultObject;

		// All @ManyToOnes have been merged automatically (because they are entities themselves)

		// For @OneToManys:
		// If the current one it the same as the last one of the ones in the last entity then it's the same
		// otherwise its new and should be added to the collection
		for (let oneToManyProperty in oneToManys) {
			let currentOneToMany = oneToManys[oneToManyProperty];
			if (currentOneToMany && currentOneToMany.length) {
				// There will always be only one current record, since this is done per result set row
				let currentMto = currentOneToMany[0];
				let existingOneToMany = resultObject[oneToManyProperty];
				if (!existingOneToMany || !existingOneToMany.length) {
					resultObject[oneToManyProperty] = currentOneToMany
				}
				// Otherwise if the last object doesn't match then its a new one
				else if (existingOneToMany[existingOneToMany.length - 1] !== currentMto) {
					existingOneToMany.push(currentMto);
				}
			}
		}

		return resultObject;
	}

	flushRow(): void {
		this.lastRowObjectMap = this.currentRowObjectMap;
		this.currentRowObjectMap = {};
	}

	bridge(
		parsedResults: any[],
		selectClauseFragment: any
	): any[] {
		// Nothing to be done, hierarchical queries are not bridged
		return parsedResults;
	}

}
