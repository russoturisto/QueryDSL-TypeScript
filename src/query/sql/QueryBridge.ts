import {IQEntity} from "../../core/entity/Entity";
import {EntityMetadata} from "../../core/entity/EntityMetadata";
import {RelationType} from "../noSql/QueryTreeNode";
import {RelationRecord, JoinTreeNode, QRelation} from "../../core/entity/Relation";
import {MetadataUtils} from "../../core/entity/metadata/MetadataUtils";
import {MappedEntityArray} from "../../core/MappedEntityArray";
import {LastObjectTracker} from "./LastObjectTracker";
import {SQLDataType} from "./SQLStringQuery";
/**
 * Created by Papa on 10/8/2016.
 */

export interface ManyToOneStubReference {
    mtoParentObject:any;
    mtoRelationField:string;
    otmEntityField:string;
    otmEntityId:string | number;
    otmEntityIdField:string;
    otmEntityName:string;
}

export interface OneToManyStubReference {

    otmEntityName:string;
    otmObject:any;

}

export interface EntityReference {
    idFieldName:string;
    entityObject:any;
}

export class QueryBridgeConfiguration {
    // This is for conflicts on OneToMany references
    failOnConflicts:boolean = true;
    // Always fail on no ID - bridged entities must have IDs
    // failOnNoId: boolean = true;
    // Assume there are no conflicts on ManyToOneReferences
    //failOnManyToOneConflicts: boolean = true;
}

export interface IQueryBridge {

    addProperty(entityAlias:string,
                resultObject:any,
                dataType:SQLDataType,
                propertyName:string):void;

    bufferManyToOneStub(currentJoinNode:JoinTreeNode,
                        qEntity:IQEntity,
                        entityMetadata:EntityMetadata,
                        resultObject:any,
                        propertyName:string,
                        relationQEntity:IQEntity,
                        relationEntityMetadata:EntityMetadata,
                        relatedEntityId:any):void;

    bufferOneToManyStub(resultObject:any,
                        entityName:string,
                        propertyName:string):void;

    flushEntity(qEntity:IQEntity,
                entityMetadata:EntityMetadata,
                selectClauseFragment:any,
                entityPropertyTypeMap:{[propertyName:string]:boolean},
                entityRelationMap:{[propertyName:string]:RelationRecord},
                entityId:any,
                resultObject:any):void;

    bridge(parsedResults:any[],
           selectClauseFragment:any):any[] | MappedEntityArray<any>;

}

export class OtmObjectReference {
    // For OtM mapping
    // Map of MtO referred objects by OtM references
    mtoEntityReferenceMap:{
        // Name of OTM reference class
        [otmReferenceEntityName:string]:{
            // Id of OTM reference object
            [otmReferenceId:string]:{
                // Name of the property of OtM reference
                [otmProperty:string]:MappedEntityArray<any>}}} = {};
    // Map of objects with OtM references
    otmEntityReferenceMap:{
        // Name of class with OtM reference
        [otmEntityName:string]:{
            // Id of object with OtM reference
            [otmEntityId:string]:any}} = {};

    addMtoReference(mtoStubReference:ManyToOneStubReference,
                    mtoEntityId:string | number) {
        // If the @OneToMany({ mappedBy: ... }) is missing, there is nothing to map to
        if (!mtoStubReference.otmEntityField) {
            return;
        }
        // Add into mtoEntityReferenceMap
        let mapForOtmEntityName:{[otmReferenceId:string]:{[otmProperty:string]:MappedEntityArray<any>}} = this.mtoEntityReferenceMap[mtoStubReference.otmEntityName];
        if (!mapForOtmEntityName) {
            mapForOtmEntityName = {};
            this.mtoEntityReferenceMap[mtoStubReference.otmEntityName] = mapForOtmEntityName;
        }

        let mapForOtmEntity:{[otmProperty:string]:MappedEntityArray<any>} = mapForOtmEntityName[mtoStubReference.otmEntityId];
        if (!mapForOtmEntity) {
            mapForOtmEntity = {};
            mapForOtmEntityName[mtoStubReference.otmEntityId] = mapForOtmEntity;
        }
        let mtoCollection:MappedEntityArray<any> = mapForOtmEntity[mtoStubReference.otmEntityField];

        mtoCollection.put(mtoStubReference.mtoParentObject);
    }

    addOtmReference(otmStubReference:OneToManyStubReference,
                    otmEntityId:string | number) {
        let mapForOtmEntityName:{[otmEntityId:string]:any} = this.otmEntityReferenceMap[otmStubReference.otmEntityName];
        if (!mapForOtmEntityName) {
            mapForOtmEntityName = {};
            this.otmEntityReferenceMap[otmStubReference.otmEntityName] = mapForOtmEntityName;
        }

        mapForOtmEntityName[otmEntityId] = otmStubReference.otmObject;
    }

    populateOtms(entityMap:{[entityName:string]:{[entityId:string]:any}},
                 keepMappedEntityArrays:boolean) {
        for (let otmEntityName in this.mtoEntityReferenceMap) {
            let entityOfNameMap = entityMap[otmEntityName];
            // If there are no entities of this type in query results, just keep the stubs
            if (!entityOfNameMap) {
                continue;
            }
            let entityWithOtmMap:{[otmEntityId:string]:any} = this.otmEntityReferenceMap[otmEntityName];
            // If there are no OTM for this type in query results, no mapping needs to happen
            if (!entityWithOtmMap) {
                continue;
            }
            let mapForOtmEntityName:{[otmReferenceId:string]:{[otmProperty:string]:MappedEntityArray<any>}} = this.mtoEntityReferenceMap[otmEntityName];
            for (let otmEntityId in mapForOtmEntityName) {
                let referencedEntitiesByPropertyMap:{[otmProperty:string]:MappedEntityArray<any>} = mapForOtmEntityName[otmEntityId];

                for (let otmEntityId in entityWithOtmMap) {
                    let otmEntity = entityWithOtmMap[otmEntityId];
                    for (let otmProperty in referencedEntitiesByPropertyMap) {
                        let referencedEntityMap:MappedEntityArray<any> = referencedEntitiesByPropertyMap[otmProperty];

                        let otmCollection:MappedEntityArray<any> = otmEntity[otmProperty];
                        // If @OneToMany isn't set yet
                        if (!otmCollection) {
                            otmEntity[otmProperty] = referencedEntityMap;
                        } else {
                            otmCollection.putAll(referencedEntityMap);
                        }
                        if (!keepMappedEntityArrays) {
                            otmEntity[otmProperty] = otmEntity[otmProperty].slice();
                        }
                    }
                }
            }
        }
    }
}

/**
 a) Reconstruct the Many-To-One relations by Id
 for this we need
 1) a map of all entities [by Type]:[by id]:Entity
 2) a map of all stubs Many-To-One stubs, [by Type]:[by id]: { propertyName, parentObject }
 Then it's a simple operation of mapping all available entities to all stubs
 b) Reconstruct the One-To-Many relations by Tree
 for this we need
 1) the entity map from 1a)
 2) a similar map of all One-To-Many stubs, [by Type]:[by id]: { propertyName, parentObject,
manyEntitySet }
 where manyEntitySet is a set of all entities in a given OneToMany collection, by their id
 Then we need to navigate all entities in the entity map, and
 - for every found Many-To-One reference in each entity
 Lookup the related One-To-Many stub
 If the stub is found, add this entity to the manyEntitySet
 - at the end we need to go though all the One-To-Many stubs and create arrays ouf of the sets
 */
export class QueryBridge implements IQueryBridge {

    // Keys can only be strings or numbers | TODO: change to JS Maps, if needed
    entityMap:{[entityName:string]:{[entityId:string]:any}} = {};

    otmObjectReference:OtmObjectReference = new OtmObjectReference();

    lastObjectTracker:LastObjectTracker = new LastObjectTracker();

    // For MtO mapping
    // Map of all objects that have a given MtO reference
    mtoStubReferenceMap:{
        // Type of MtO reference object
        [mtoEntityName:string]:{
            // Id of MtO reference object
            [mtoEntityId:string]: // list of all objects (may have duplicates)
                any[]}} = {};

    // One-To-Many temp stubs (before entityIds are available
    otmStubBuffer:OneToManyStubReference[] = [];
    mtoStubBuffer:ManyToOneStubReference[] = [];

    constructor(private performBridging:boolean,
                private mapEntityArrays:boolean,
                private config:QueryBridgeConfiguration,
                public qEntity:IQEntity,
                public qEntityMap:{[entityName:string]:IQEntity}) {
    }

    addProperty(entityAlias:string,
                resultObject:any,
                dataType:SQLDataType,
                propertyName:string):void {
        this.lastObjectTracker.addProperty(entityAlias, resultObject, dataType, propertyName);
    }

    bufferManyToOneStub(currentJoinNode:JoinTreeNode,
                        qEntity:IQEntity,
                        entityMetadata:EntityMetadata,
                        resultObject:any,
                        propertyName:string,
                        relationQEntity:IQEntity,
                        relationEntityMetadata:EntityMetadata,
                        relatedEntityId:any):void {
        if (!this.performBridging) {
            if (QRelation.isStub(resultObject[propertyName])) {
                this.lastObjectTracker.addManyToOneReference(QRelation.getAlias(currentJoinNode.jsonRelation), resultObject, propertyName, relationEntityMetadata.idProperty);
            }
            return;
        }

        let otmEntityField;
        for (let otmRelationProperty in relationQEntity.__entityRelationMap__) {
            let otmRelation = relationQEntity.__entityRelationMap__[otmRelationProperty];
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
            otmEntityIdField: relationEntityMetadata.idProperty,
            otmEntityName: relationQEntity.__entityName__,
            otmEntityField: otmEntityField,
            mtoRelationField: propertyName,
            mtoParentObject: resultObject
        });
    }

    bufferOneToManyStub(resultObject:any,
                        otmEntityName:string,
                        propertyName:string):void {
        if (!this.performBridging) {
            return;
        }
        this.otmStubBuffer.push({
            otmEntityName: otmEntityName,
            otmObject: resultObject
        });
    }

    flushEntity(qEntity:IQEntity,
                entityMetadata:EntityMetadata,
                selectClauseFragment:any,
                entityPropertyTypeMap:{[propertyName:string]:boolean},
                entityRelationMap:{[propertyName:string]:RelationRecord},
                entityId:any,
                resultObject:any):void {
        if (!this.performBridging) {
            return;
        }
        if (!entityId) {
            throw `No Id provided for entity of type '${qEntity.__entityName__}'`;
        }

        let currentEntity = this.addEntity(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);

        this.flushOneToManyStubBuffer(qEntity, entityMetadata, entityId);

        return currentEntity;
    }

    private mergeOneToManys() {

    }

    private addEntity(qEntity:IQEntity,
                      entityMetadata:EntityMetadata,
                      selectClauseFragment:any,
                      entityPropertyTypeMap:{[propertyName:string]:boolean},
                      entityRelationMap:{[propertyName:string]:RelationRecord},
                      entityId:any,
                      resultObject:any):any {
        let entityName = qEntity.__entityName__;
        if (!entityId) {
            throw `Entity ID not specified for entity '${entityName}'`
        }
        let entityMapForType = this.entityMap[entityName];
        if (!entityMapForType) {
            entityMapForType = {};
            this.entityMap[entityName] = entityMapForType;
        }
        let existingEntity = entityMapForType[entityId];
        let currentEntity = this.mergeEntities(existingEntity, resultObject, qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap);
        entityMapForType[entityId] = currentEntity;

        return currentEntity;
    }

    // Must merge the one-to-many relationships returned as part of the result tree
    private mergeEntities(source:any,
                          target:any,
                          qEntity:IQEntity,
                          selectClauseFragment:any,
                          entityPropertyTypeMap:{[propertyName:string]:boolean},
                          entityRelationMap:{[propertyName:string]:RelationRecord}):any {
        if (!source || target === source) {
            return target;
        }
        let entityMetadata:EntityMetadata = <EntityMetadata><any>qEntity.__entityConstructor__;
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
                    let entityMetadata:EntityMetadata = <EntityMetadata><any>this.qEntityMap[childEntityName].__entityConstructor__;
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

                        // TODO: this will probably fail, since the merged in array should always have only one entity in it,
                        // because it is created for a single result set row.
                        if (this.config.failOnConflicts) {
                            if ((!sourceArray && targetArray)
                                || (!targetArray && sourceArray)
                                || sourceArray.length != targetArray.length) {
                                throw `One-to-Many child arrays don't match for '${entityName}.${propertyName}', @Id(${entityMetadata.idProperty}) = ${id}`;
                            }
                        }
                        let sourceSet:{[id:string]:any} = {};
                        if (sourceArray) {
                            sourceArray.forEach((sourceChild) => {
                                sourceSet[sourceChild[childIdProperty]] = sourceChild;
                            });
                        } else {
                            sourceArray = [];
                            source[propertyName] = sourceArray;
                        }
                        if (targetArray) {
                            targetArray.forEach((targetChild) => {
                                let childId = targetChild[childIdProperty];
                                if (this.config.failOnConflicts && !sourceSet[childId]) {
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

    /*
     // Many-To-One stubs
     mtoStubReferenceMap: {[otmEntityName: string]: {[otmEntityId: string]: {[mtoEntityId: string]: any }}} = {};
     // One-To-Many temp stubs (before entityIds are available
     otmStubBuffer: OneToManyStubReference[] = [];
     mtoStubBuffer: ManyToOneStubReference[] = [];
     // One-To-Many stubs
     otmStubReferenceMap: {[mtoEntityName: string]: {[mtoEntityId: string]: OneToManyStubReference[]}} = {};
     */
    flushOneToManyStubBuffer(qEntity:IQEntity,
                             entityMetadata:EntityMetadata,
                             entityId:any):void {
        let stubBuffer = this.otmStubBuffer;
        this.otmStubBuffer = [];

        let otmStubMapForType = this.otmStubReferenceMap[qEntity.__entityName__];
        if (!otmStubMapForType) {
            otmStubMapForType = {};
            this.otmStubReferenceMap[qEntity.__entityName__] = otmStubMapForType;
        }
        let otmStubReferences = otmStubMapForType[entityId];
        if (otmStubReferences) {
            throw `Unexpected OneToManyStubReference for entity name '${qEntity.__entityName__}', id: '${entityId}'`;
        }
        otmStubMapForType[entityId] = this.otmStubBuffer;
    }

    bridge(parsedResults:any[],
           selectClauseFragment:any):any[] {
        if (!this.performBridging) {
            return parsedResults;
        }

        this.otmObjectReference.populateOtms(this.entityMap, this.mapEntityArrays);


        let entityMetadata:EntityMetadata = <EntityMetadata><any>this.qEntity.__entityConstructor__;

        let resultMEA = new MappedEntityArray(entityMetadata.idProperty);
        resultMEA.putAll(parsedResults);
        if (this.mapEntityArrays) {
            return resultMEA;
        }
        return resultMEA.toArray();
    }

}