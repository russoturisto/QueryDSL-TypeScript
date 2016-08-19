import { QEntity, IEntity } from "../core/entity/Entity";
import { RelationRecord } from "../core/entity/Relation";
import { IEntityQuery } from "./IEntityQuery";
/**
 * Created by Papa on 6/22/2016.
 */
export declare const PH_JOIN_TO_ENTITY: string;
export declare const PH_JOIN_TO_FIELD: string;
export declare const PH_OPERATOR: string;
export declare const PH_INCLUDE: string;
export interface PHJsonQuery {
    select: any;
    join?: any;
    where?: any;
}
export declare class PHQuery<IE extends IEntity> {
    iEntityQuery: IEntityQuery<IE>;
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
    selectFragment: PHQuerySelect<IE>;
    constructor(iEntityQuery: IEntityQuery<IE>, qEntity: QEntity<any>, qEntityMap: {
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
    toJSON(): PHJsonQuery;
}
export declare class PHQuerySelect<IE extends IEntity> {
    iEntitySelect: IE;
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
    constructor(iEntitySelect: IE, qEntity: QEntity<any>, qEntityMap: {
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
