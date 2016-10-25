import { IEntity, QEntity } from "../../core/entity/Entity";
import { EntityRelationRecord } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { PHQuery, PHRawQuery } from "../PHQuery";
/**
 * Created by Papa on 8/15/2016.
 */
export declare enum GraphFilter {
    ALL = 0,
    CHILDREN = 1,
}
export interface PHJsonGraphQuery<IE extends IEntity> extends PHRawQuery<IE> {
    filter: GraphFilter;
    fields: IE;
    selector: JSONBaseOperation;
    execOrder: number;
}
export declare class PHGraphQuery<IE extends IEntity> implements PHQuery<IE> {
    phJsonQuery: PHJsonGraphQuery<IE>;
    qEntity: QEntity<any>;
    qEntityMap: {
        [entityName: string]: QEntity<any>;
    };
    entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
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
    constructor(phJsonQuery: PHJsonGraphQuery<IE>, qEntity: QEntity<any>, qEntityMap: {
        [entityName: string]: QEntity<any>;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
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
    validateFieldsAndChildren(fields: IE): void;
}
