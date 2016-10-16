import { IQueryParser, BridgedQueryConfiguration, AbstractObjectQueryParser } from "./IQueryParser";
import { BridgedQueryOtmMapper, OneToManyStubReference } from "./BridgedOtmMapper";
import { BridgedQueryMtoMapper, ManyToOneStubReference } from "./BridgedMtoMapper";
import { IQEntity } from "../../../../core/entity/Entity";
import { SQLDataType } from "../../SQLStringQuery";
import { EntityMetadata } from "../../../../core/entity/EntityMetadata";
import { RelationRecord } from "../../../../core/entity/Relation";
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * The goal of this parser to to bridge all entity references and arrive at an inter-connected graph (where possible).
 */
export declare class BridgedQueryParser extends AbstractObjectQueryParser implements IQueryParser {
    private config;
    private qEntity;
    private qEntityMap;
    entityMap: {
        [entityName: string]: {
            [entityId: string]: any;
        };
    };
    otmMapper: BridgedQueryOtmMapper;
    mtoMapper: BridgedQueryMtoMapper;
    otmStubBuffer: OneToManyStubReference[];
    mtoStubBuffer: ManyToOneStubReference[];
    currentResultRow: any[];
    constructor(config: BridgedQueryConfiguration, qEntity: IQEntity, qEntityMap: {
        [entityName: string]: IQEntity;
    });
    addEntity(entityAlias: string, qEntity: IQEntity): void;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string, propertyValue: any): void;
    bufferManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, relatedEntityId: any): void;
    bufferBlankManyToOneStub(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata, childResultObject: any): any;
    private bufferManyToOne(entityName, propertyName, relationQEntity, relationEntityMetadata, relatedEntityId);
    bufferBlankManyToOneObject(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, resultObject: any, propertyName: string, relationQEntity: IQEntity, relationEntityMetadata: EntityMetadata): void;
    bufferOneToManyStub(otmEntityName: string, otmPropertyName: string): void;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    bufferBlankOneToMany(entityAlias: string, resultObject: any, otmEntityName: string, propertyName: string, relationEntityMetadata: EntityMetadata, childResultObject: any): void;
    private bufferOneToMany(otmEntityName, otmPropertyName);
    flushEntity(entityAlias: string, qEntity: IQEntity, entityMetadata: EntityMetadata, selectClauseFragment: any, entityPropertyTypeMap: {
        [propertyName: string]: boolean;
    }, entityRelationMap: {
        [propertyName: string]: RelationRecord;
    }, entityId: any, resultObject: any): any;
    private getEntityToFlush(qEntity, entityMetadata, selectClauseFragment, entityPropertyTypeMap, entityRelationMap, entityId, resultObject);
    private mergeEntities(source, target, qEntity, selectClauseFragment, entityPropertyTypeMap, entityRelationMap);
    private flushRelationStubBuffers(entityId, currentEntity);
    flushRow(): void;
    bridge(parsedResults: any[], selectClauseFragment: any): any[];
}
