import { IEntity, IQEntity, QEntity } from "../../core/entity/Entity";
import { PHRawDelete, PHDelete } from "../PHQuery";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { JSONEntityRelation, EntityRelationRecord } from "../../core/entity/Relation";
/**
 * Created by Papa on 10/2/2016.
 */
export interface PHRawSQLDelete<IE extends IEntity> extends PHRawDelete<IE> {
    deleteFrom: IQEntity;
    where?: JSONBaseOperation;
}
export interface PHJsonSQLDelete<IE extends IEntity> {
    deleteFrom: JSONEntityRelation;
    where?: JSONBaseOperation;
}
export declare class PHSQLDelete<IE extends IEntity> implements PHDelete<IE> {
    phRawQuery: PHRawSQLDelete<IE>;
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
    constructor(phRawQuery: PHRawSQLDelete<IE>, qEntity: QEntity<any>, qEntityMap: {
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
    toSQL(): PHJsonSQLDelete<IE>;
}
