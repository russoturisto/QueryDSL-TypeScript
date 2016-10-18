/**
 * Created by Papa on 10/16/2016.
 */

import {SQLDataType, QueryResultType} from "../../SQLStringQuery";
import {IQEntity} from "../../../../core/entity/Entity";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {MappedEntityArray} from "../../../../core/MappedEntityArray";
import {RelationRecord} from "../../../../core/entity/Relation";
import {FlattenedResultParser} from "./FlattenedResultParser";
import {PlainResultParser} from "./PlainResultParser";
import {HierarchicalResultParser} from "./HierarchicalResultParser";
import {BridgedResultParser} from "./BridgedResultParser";

export class BridgedQueryConfiguration {
	// This is for conflicts on OneToMany references
	strict: boolean = true;
	mapped: boolean = true;
	// Always fail on no ID - bridged entities must have IDs
	// failOnNoId: boolean = true;
	// Assume there are no conflicts on ManyToOneReferences
	//failOnManyToOneConflicts: boolean = true;
}

export interface IObjectResultParser {

	addEntity(
		entityAlias: string,
		resultObject: any
	): any;

	addProperty(
		entityAlias: string,
		resultObject: any,
		dataType: SQLDataType,
		propertyName: string,
		propertyValue: any
	): void;

	bufferManyToOneStub(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		resultObject: any,
		propertyName: string,
		relationGenericQEntity: IQEntity,
		relationEntityMetadata: EntityMetadata,
		relatedEntityId: any
	): void;

	bufferBlankManyToOneStub(
		entityAlias: string,
		resultObject: any,
		propertyName: string,
		relationEntityMetadata: EntityMetadata
	): void;

	bufferManyToOneObject(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		resultObject: any,
		propertyName: string,
		relationQEntity: IQEntity,
		relationEntityMetadata: EntityMetadata,
		relatedEntityId: any
	): void;

	bufferBlankManyToOneObject(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		resultObject: any,
		propertyName: string,
		relationQEntity: IQEntity,
		relationEntityMetadata: EntityMetadata
	): void;

	bufferOneToManyStub(
		entityName: string,
		otmPropertyName: string
	): void;

	bufferOneToManyCollection(
		entityAlias: string,
		resultObject: any,
		otmEntityName: string,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		childResultObject: any
	): void;

	bufferBlankOneToMany(
		entityAlias: string,
		resultObject: any,
		otmEntityName: string,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		childResultObject: any
	): void;

	flushEntity(
		entityAlias: string,
		qEntity: IQEntity,
		entityMetadata: EntityMetadata,
		selectClauseFragment: any,
		entityPropertyTypeMap: {[propertyName: string]: boolean},
		entityRelationMap: {[propertyName: string]: RelationRecord},
		entityId: any,
		resultObject: any
	): any;

	flushRow(): void;

	bridge(
		parsedResults: any[],
		selectClauseFragment: any
	): any[] | MappedEntityArray<any>;

}

export function getObjectResultParser(
	queryResultType: QueryResultType,
	config: BridgedQueryConfiguration,
	rootQEntity: IQEntity,
	qEntityMapByName: {[entityName: string]: IQEntity}
): IObjectResultParser {
	switch (queryResultType) {
		case QueryResultType.BRIDGED:
			return new BridgedResultParser(config, rootQEntity, qEntityMapByName);
		case QueryResultType.HIERARCHICAL:
			return new HierarchicalResultParser();
		case QueryResultType.PLAIN:
			return new PlainResultParser();
		case QueryResultType.FLATTENED:
			return new FlattenedResultParser();
		default:
			throw `ObjectQueryParser not supported for QueryResultType: ${queryResultType}`;
	}
}

export abstract class AbstractObjectResultParser {

	protected addManyToOneStub(
		resultObject: any,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		relatedEntityId: any
	): void {
		let manyToOneStub = {};
		resultObject[propertyName] = manyToOneStub;
		manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
	}

}