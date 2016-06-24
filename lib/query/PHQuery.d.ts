import { IQEntity, QEntity } from "../core/entity/Entity";
/**
 * Created by Papa on 6/22/2016.
 */
export declare const PH_JOIN_TO_ENTITY: string;
export declare const PH_JOIN_TO_FIELD: string;
export declare const PH_OPERATOR: string;
export declare const PH_INCLUDE: string;
export declare class PHQuery {
    private iQEntity;
    private qEntity;
    private qEntityMap;
    private entitiesRelationPropertyMap;
    private entitiesPropertyTypeMap;
    constructor(iQEntity: IQEntity, qEntity: QEntity<any>, qEntityMap: {
        [entityName: string]: QEntity<any>;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: string;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    });
    toJSON(): any;
}
