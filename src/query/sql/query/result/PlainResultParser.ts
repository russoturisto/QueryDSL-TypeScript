import {IObjectResultParser, AbstractObjectResultParser} from "./IObjectResultParser";
import {IQEntity} from "../../../../core/entity/Entity";
import {SQLDataType} from "../../SQLStringQuery";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {RelationRecord} from "../../../../core/entity/Relation";
/**
 * Created by Papa on 10/16/2016.
 */

/**
 * The goal of this parser is to split a flat row of result set cells into an object graph (just for that row).
 */
export class PlainResultParser extends AbstractObjectResultParser implements IObjectResultParser {

	addEntity(
		entityAlias: string,
		qEntity: IQEntity
	): any {
		return new qEntity.__entityConstructor__();
	}

	addProperty(
		entityAlias: string,
		resultObject: any,
		dataType: SQLDataType,
		propertyName: string,
		propertyValue: any
	): void {
		resultObject[propertyName] = propertyValue;
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
	): any {
		resultObject[propertyName] = childResultObject;
		let relatedEntityId = childResultObject[relationEntityMetadata.idProperty];
		this.addManyToOneStub(resultObject, propertyName, relationEntityMetadata, relatedEntityId);
	}

	bufferBlankManyToOneStub(
		entityAlias: string,
		resultObject: any,
		propertyName: string,
		relationEntityMetadata: EntityMetadata
	): void {
		// Nothing to do the object simply doesn't have anything in it
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
		// Nothing to do the object simply doesn't have anything in it
	}

	bufferOneToManyStub(
		otmEntityName: string,
		otmPropertyName: string
	): void {
		throw `@OneToMany stubs not allowed in QueryResultType.PLAIN`;
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
		// Nothing to be done, plain objects don't need to be flushed since they aren't relate do any other rows
		return resultObject;
	}

	flushRow(): void {
		// Nothing to be done, plain rows don't need to be flushed since they aren't relate do any other rows
	}

	bridge(
		parsedResults: any[],
		selectClauseFragment: any
	): any[] {
		// Nothing to be done, plain queries are not bridged
		return parsedResults;
	}
}
