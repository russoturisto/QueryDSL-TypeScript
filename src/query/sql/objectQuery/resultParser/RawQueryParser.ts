import {IQueryParser} from "./IQueryParser";
import {IQEntity} from "../../../../core/entity/Entity";
import {SQLDataType} from "../../SQLStringQuery";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {RelationRecord} from "../../../../core/entity/Relation";
/**
 * Created by Papa on 10/16/2016.
 */

export class RawQueryParser implements IQueryParser {

	currentResultRow: any[] = [];

	addEntity(
		entityAlias: string,
		qEntity: IQEntity
	): any {
		return this.currentResultRow;
	}

	addProperty(
		entityAlias: string,
		resultObject: any,
		dataType: SQLDataType,
		propertyName: string,
		propertyValue: any
	): void {
		resultObject.push(propertyValue);
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
		resultObject.push(relatedEntityId);
	}

	bufferBlankManyToOneStub(
		entityAlias: string,
		resultObject: any,
		propertyName: string,
		relationEntityMetadata: EntityMetadata
	): void {
		resultObject.push(null);
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
		// Nothing to do, we are working with a flat result array
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
		// Nothing to do, we are working with a flat result array
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
		// Nothing to do, we are working with a flat result array
	}

	bufferBlankOneToMany(
		entityAlias: string,
		resultObject: any,
		otmEntityName: string,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		childResultObject: any
	): void {
		// Nothing to do, we are working with a flat result array
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
		// Nothing to do, we are working with a flat result array
		return resultObject;
	}

	flushRow(): void {
		this.currentResultRow = [];
	}

	bridge(
		parsedResults: any[],
		selectClauseFragment: any
	): any[] {
		// No bridging needed for Raw Object queries
		return parsedResults;

	}

}