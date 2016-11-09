import {IEntityResultParser} from "./IEntityResultParser";
import {IQEntity} from "../../../../../core/entity/Entity";
import {EntityMetadata} from "../../../../../core/entity/EntityMetadata";
import {EntityRelationRecord} from "../../../../../core/entity/Relation";
import {HierarchicalResultParser} from "../HierarchicalResultParser";
/**
 * Created by Papa on 10/16/2016.
 */

/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
export class HierarchicalEntityResultParser extends HierarchicalResultParser implements IEntityResultParser {

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

	bufferManyToOneStub(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		resultObject: any,
		propertyName: string,
		relationGenericQEntity: IQEntity,
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
		resultObject: any,
		propertyName: string,
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


	addManyToOneStub(
		resultObject: any,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		relatedEntityId: any
	): void {
		let manyToOneStub = {};
		resultObject[propertyName] = manyToOneStub;
		manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
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
		entityRelationMap: {[propertyName: string]: EntityRelationRecord},
		entityId: any,
		resultObject: any
	): any {
		return this.mergeEntity(entityAlias, resultObject);
	}

	bridge(
		parsedResults: any[],
		selectClauseFragment: any
	): any[] {
		// Nothing to be done, hierarchical queries are not bridged
		return parsedResults;
	}

}
