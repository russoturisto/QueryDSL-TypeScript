import { IEntity, IQEntity, QEntity } from "../../core/entity/Entity";
import { PHRawDelete, PHDelete } from "../PHQuery";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { JSONRelation, RelationRecord } from "../../core/entity/Relation";
/**
 * Created by Papa on 10/2/2016.
 */
export interface PHRawSQLDelete<IE extends IEntity> extends PHRawDelete<IE> {
    deleteFrom: IQEntity;
    where?: JSONBaseOperation;
}
export interface PHJsonSQLDelete<IE extends IEntity> {
    deleteFrom: JSONRelation;
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
            [propertyName: string]: RelationRecord;
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
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    });
    toSQL(): PHJsonSQLDelete<IE>;
}
