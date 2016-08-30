import { IEntity, QEntity } from "../../core/entity/Entity";
import { RelationRecord } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
/**
 * Created by Papa on 8/15/2016.
 */
export declare enum GraphFilter {
    ALL = 0,
    CHILDREN = 1,
}
export interface PHJsonGraphQuery<EQ extends IEntity> {
    filter: GraphFilter;
    fields: EQ;
    selector: JSONBaseOperation;
    execOrder: number;
}
export declare class PHGraphQuery<EQ extends IEntity> {
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
    childMap: {
        [entity: string]: PHGraphQuery<any>;
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
    setExecOrders(): void;
    assignMissingExecOrders(execOrders: number[]): void;
    gatherExecOrders(execOrders: number[]): void;
    validateQuery(query: JSONBaseOperation, entityName: string): void;
    validateFieldsAndChildren(fields: EQ): void;
}
