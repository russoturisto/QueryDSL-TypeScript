import { IEntity, QEntity } from "../core/entity/Entity";
import { RelationRecord } from "../core/entity/Relation";
import { JSONBaseOperation } from "../core/operation/Operation";
/**
 * Created by Papa on 8/15/2016.
 */
export declare enum GraphFilter {
    ALL = 0,
    CHILDREN = 1,
}
export interface PHJsonGraphQuery<EQ extends IEntity> {
    filter: GraphFilter;
    fields: any;
    query: JSONBaseOperation;
    executionOrder: number;
}
export declare class PHQueryDsl<EQ extends IEntity> {
    phJsonQuery: PHJsonGraphQuery<EQ>;
    qEntity: QEntity<any>;
    qEntityMap: {
        [entityName: string]: QEntity<any>;
    };
    entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    };
    entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    };
    constructor(phJsonQuery: PHJsonGraphQuery<EQ>, qEntity: QEntity<any>, qEntityMap: {
        [entityName: string]: QEntity<any>;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    });
    toJSON(): any;
    validateQuery(query: JSONBaseOperation, entityName: string): void;
    validateFieldsAndChildren(fields: EQ): void;
}
