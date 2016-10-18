import {IQueryParser, BridgedQueryConfiguration, AbstractObjectQueryParser} from "./IQueryParser";
import {BridgedOtmMapper, OneToManyStubReference} from "./BridgedOtmMapper";
import {BridgedMtoMapper, ManyToOneStubReference} from "./BridgedMtoMapper";
import {IQEntity} from "../../../../core/entity/Entity";
import {SQLDataType} from "../../SQLStringQuery";
import {EntityMetadata} from "../../../../core/entity/EntityMetadata";
import {RelationType, RelationRecord} from "../../../../core/entity/Relation";
import {MappedEntityArray} from "../../../../core/MappedEntityArray";
/**
 * Created by Papa on 10/16/2016.
 */

/**
 * The goal of this parser to to bridge all entity references and arrive at an inter-connected graph (where possible).
 */
export class BridgedQueryParser extends AbstractObjectQueryParser implements IQueryParser {

	// Keys can only be strings or numbers | TODO: change to JS Maps, if needed
	entityMapByName: {[entityName: string]: {[entityId: string]: any}} = {};

	otmMapper: BridgedOtmMapper = new BridgedOtmMapper();
	mtoMapper: BridgedMtoMapper = new BridgedMtoMapper();

	// One-To-Many & MtO temp stubs (before entityId is available)
	otmStubBuffer: OneToManyStubReference[] = [];
	mtoStubBuffer: ManyToOneStubReference[] = [];

	// Used in RAW queries
	currentResultRow: any[] = [];

	constructor(
		private config: BridgedQueryConfiguration,
		private rootQEntity: IQEntity,
		private qEntityMapByName: {[entityName: string]: IQEntity}
	) {
		super();
	}

	addEntity(
		entityAlias: string,
		qEntity: IQEntity
	): void {
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
		this.bufferManyToOne(qEntity.__entityName__, propertyName, relationGenericQEntity, relationEntityMetadata, relatedEntityId);
	}

	bufferBlankManyToOneStub(
		entityAlias: string,
		resultObject: any,
		propertyName: string,
		relationEntityMetadata: EntityMetadata
	): void {
		// Nothing to do for bridged parser - bridging will map blanks, where possible
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
		this.bufferManyToOne(qEntity.__entityName__, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
	}

	private bufferManyToOne(
		entityName: string,
		propertyName: string,
		relationGenericQEntity: IQEntity,
		relationEntityMetadata: EntityMetadata,
		relatedEntityId: any
	): void {
		let otmEntityField;
		for (let otmRelationProperty in relationGenericQEntity.__entityRelationMap__) {
			let otmRelation = relationGenericQEntity.__entityRelationMap__[otmRelationProperty];
			if (otmRelation.relationType === RelationType.ONE_TO_MANY) {
				let otmElements = relationEntityMetadata.oneToManyMap[otmRelationProperty];
				if (otmElements.mappedBy === propertyName) {
					otmEntityField = otmRelationProperty;
					break;
				}
			}
		}

		this.mtoStubBuffer.push({
			otmEntityId: relatedEntityId,
			otmEntityName: relationGenericQEntity.__entityName__,
			otmEntityField: otmEntityField,
			mtoEntityName: entityName,
			mtoRelationField: propertyName,
			mtoParentObject: null
		});
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
		// Nothing to do for bridged parser - bridging will map blanks, where possible
	}

	bufferOneToManyStub(
		otmEntityName: string,
		otmPropertyName: string
	): void {
		this.bufferOneToMany(otmEntityName, otmPropertyName);
	}

	bufferOneToManyCollection(
		entityAlias: string,
		resultObject: any,
		otmEntityName: string,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		childResultObject: any
	): void {
		this.bufferOneToMany(otmEntityName, propertyName);
		let childResultsArray = new MappedEntityArray(relationEntityMetadata.idProperty);
		childResultsArray.put(childResultObject);
		resultObject[propertyName] = childResultsArray;
	}

	bufferBlankOneToMany(
		entityAlias: string,
		resultObject: any,
		otmEntityName: string,
		propertyName: string,
		relationEntityMetadata: EntityMetadata,
		childResultObject: any
	): void {
		resultObject[propertyName] = new MappedEntityArray<any>(relationEntityMetadata.idProperty);
	}

	private bufferOneToMany(
		otmEntityName: string,
		otmPropertyName: string
	): void {
		this.otmStubBuffer.push({
			otmEntityName: otmEntityName,
			otmPropertyName: otmPropertyName,
			otmObject: null
		});
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
		if (!entityId) {
			throw `No Id provided for entity of type '${qEntity.__entityName__}'`;
		}
		let currentEntity = this.getEntityToFlush(qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
		this.flushRelationStubBuffers(entityId, currentEntity);

		return currentEntity;
	}

	private getEntityToFlush(
		qEntity: IQEntity,
		selectClauseFragment: any,
		entityPropertyTypeMap: {[propertyName: string]: boolean},
		entityRelationMap: {[propertyName: string]: RelationRecord},
		entityId: any,
		resultObject: any
	): any {
		let entityName = qEntity.__entityName__;
		if (!entityId) {
			throw `Entity ID not specified for entity '${entityName}'`
		}
		let entityMapForName = this.entityMapByName[entityName];
		if (!entityMapForName) {
			entityMapForName = {};
			this.entityMapByName[entityName] = entityMapForName;
		}
		let existingEntity = entityMapForName[entityId];
		let currentEntity = this.mergeEntities(existingEntity, resultObject, qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap);
		entityMapForName[entityId] = currentEntity;

		return currentEntity;
	}

	// Must merge the one-to-many relationships returned as part of the result tree
	/**
	 * Merge entities with of the same class and with the same Id
	 *
	 * @param source
	 * @param target
	 * @param qEntity
	 * @param selectClauseFragment
	 * @param entityPropertyTypeMap
	 * @param entityRelationMap
	 * @returns {any}
	 */
	private mergeEntities(
		source: any,
		target: any,
		qEntity: IQEntity,
		selectClauseFragment: any,
		entityPropertyTypeMap: {[propertyName: string]: boolean},
		entityRelationMap: {[propertyName: string]: RelationRecord}
	): any {
		if (!source || target === source) {
			return target;
		}
		let entityMetadata: EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
		let entityName = qEntity.__entityName__;
		let id = target[entityMetadata.idProperty];

		for (let propertyName in selectClauseFragment) {
			if (selectClauseFragment[propertyName] === undefined) {
				continue;
			}
			// Merge properties (conflicts detected at query parsing time):
			if (entityPropertyTypeMap[propertyName]) {
				// If source property doesn't exist
				if (!source[propertyName] && source[propertyName] != false && source[propertyName] != '' && source[propertyName] != 0) {
					// set the source property to value of target
					source[propertyName] = target[propertyName];
				}
				// Else if target property doesn't exist, keep the source value
				// Else, assume that properties must be the same
			}
			// Merge relations
			else if (entityRelationMap[propertyName]) {
				let childSelectClauseFragment = selectClauseFragment[propertyName];
				// For stubs (conflicts detected at query parsing time)
				if (childSelectClauseFragment == null) {
					// For Many-to-One stubs, assume they are are the same and don't detect conflicts, just merge
					source[propertyName] = target[propertyName];
					// Don't process One-to-Many stubs yet (not all related MTOs may have been collected).
				}
				// For actual objects
				else {
					let childEntityName = entityRelationMap[propertyName].entityName;
					let entityMetadata: EntityMetadata = <EntityMetadata><any>this.qEntityMapByName[childEntityName].__entityConstructor__;
					let childIdProperty = entityMetadata.idProperty;
					// Many-to-One (conflicts detected at query parsing time)
					if (entityMetadata.manyToOneMap[propertyName]) {
						// If source is missing this mapping and target has it
						if (source[propertyName] === undefined && target[propertyName] !== undefined) {
							// set the source property to value of target
							source[propertyName] = target[propertyName];
						}
						// Else if target property doesn't exist, keep the source value
						// Assume that the child objects have already been merged themselves and don't process
					}
					// One-to-Many
					else {
						let sourceArray = source[propertyName];
						let targetArray = target[propertyName];
						// Because parseQueryResult is depth-first, all child objects have already been processed

						// TODO: this will probably fail, since the merged in array should always have only one entity in it
						// because it is created for a single result set row.
						if (this.config.strict) {
							if ((!sourceArray && targetArray)
								|| (!targetArray && sourceArray)
								|| sourceArray.length != targetArray.length) {
								throw `One-to-Many child arrays don't match for '${entityName}.${propertyName}', @Id(${entityMetadata.idProperty}) = ${id}`;
							}
						}
						let sourceSet: {[id: string]: any} = {};
						if (sourceArray) {
							sourceArray.forEach(( sourceChild ) => {
								sourceSet[sourceChild[childIdProperty]] = sourceChild;
							});
						} else {
							sourceArray = [];
							source[propertyName] = sourceArray;
						}
						if (targetArray) {
							targetArray.forEach(( targetChild ) => {
								let childId = targetChild[childIdProperty];
								if (this.config.strict && !sourceSet[childId]) {
									throw `One-to-Many child arrays don't match for '${entityName}.${propertyName}', @Id(${entityMetadata.idProperty}) = ${id}`;
								}
								// If target child array has a value that source doesn't
								if (!sourceSet[childId]) {
									// add it to source (preserve order)
									sourceArray.push(targetChild);
								}
							});
						}

						// So instead just do
						// sourceArray.putAll(targetArray);
					}
				}
			}
		}

		return source;
	}

	private flushRelationStubBuffers(
		entityId: string | number,
		currentEntity: any
	): void {
		let otmStubBuffer = this.otmStubBuffer;
		this.otmStubBuffer = [];
		otmStubBuffer.forEach(( otmStub ) => {
			otmStub.otmObject = currentEntity;
			this.otmMapper.addOtmReference(otmStub, entityId);
		});
		let mtoStubBuffer = this.mtoStubBuffer;
		this.mtoStubBuffer = [];
		mtoStubBuffer.forEach(( mtoStub ) => {
			mtoStub.mtoParentObject = currentEntity;
			this.otmMapper.addMtoReference(mtoStub, entityId);
			this.mtoMapper.addMtoReference(mtoStub, entityId);
		});

	}

	flushRow(): void {
		// Nothing to do, bridged queries don't rely on rows changing
	}

	bridge(
		parsedResults: any[],
		selectClauseFragment: any
	): any[] {
		this.mtoMapper.populateMtos(this.entityMapByName);
		this.otmMapper.populateOtms(this.entityMapByName, this.config.mapped);

		let entityMetadata: EntityMetadata = <EntityMetadata><any>this.rootQEntity.__entityConstructor__;

		// merge any out of order entity references (there shouldn't be any)
		let resultMEA = new MappedEntityArray(entityMetadata.idProperty);
		resultMEA.putAll(parsedResults);
		if (this.config.mapped) {
			return resultMEA;
		}
		return resultMEA.toArray();
	}

}
