import { QEntity, IEntity } from "../core/entity/Entity";
import { RelationRecord } from "../core/entity/Relation";
/**
 * Created by Papa on 6/22/2016.
 */
export declare const PH_JOIN_TO_ENTITY: string;
export declare const PH_JOIN_TO_FIELD: string;
export declare const PH_OPERATOR: string;
export declare const PH_INCLUDE: string;
export declare class PHQuery {
    iEntity: IEntity;
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
    constructor(iEntity: IEntity, qEntity: QEntity<any>, qEntityMap: {
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
}
