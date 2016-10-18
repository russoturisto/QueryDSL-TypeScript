/**
 * Created by Papa on 10/16/2016.
 */

import {SQLDataType, QueryResultType} from "../../SQLStringQuery";
import {IQEntity} from "../../../../core/entity/Entity";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {MappedEntityArray} from "../../../../core/MappedEntityArray";
import {RelationRecord} from "../../../../core/entity/Relation";
import {RawQueryParser} from "./RawQueryParser";
import {PlainQueryParser} from "./PlainQueryParser";
import {HierarchicalQueryParser} from "./HierarchicalQueryParser";
import {BridgedQueryParser} from "./BridgedQueryParser";

export class BridgedQueryConfiguration {
	// This is for conflicts on OneToMany references
	strict: boolean = true;
	mapped: boolean = true;
	// Always fail on no ID - bridged entities must have IDs
	// failOnNoId: boolean = true;
	// Assume there are no conflicts on ManyToOneReferences
	//failOnManyToOneConflicts: boolean = true;
}

export interface IQueryParser {

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

export function getObjectQueryParser(
	queryResultType: QueryResultType,
	config: BridgedQueryConfiguration,
	rootQEntity: IQEntity,
	qEntityMapByName: {[entityName: string]: IQEntity}
): IQueryParser {
	switch (queryResultType) {
		case QueryResultType.BRIDGED:
			return new BridgedQueryParser(config, rootQEntity, qEntityMapByName);
		case QueryResultType.HIERARCHICAL:
			return new HierarchicalQueryParser();
		case QueryResultType.PLAIN:
			return new PlainQueryParser();
		case QueryResultType.RAW:
			return new RawQueryParser();
		default:
			throw `Unsupported QueryResultType: ${queryResultType}`;
	}
}

export abstract class AbstractObjectQueryParser {

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