import { IEntity, QEntity, IQEntity } from "../../core/entity/Entity";
import { RelationRecord, JSONRelation } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { PHQuery, PHRawQuery } from "../PHQuery";
import { JSONFieldInOrderBy } from "../../core/field/FieldInOrderBy";
import { JSONSelectObject } from "../../core/field/Field";
/**
 * Created by Papa on 8/12/2016.
 */
export interface PHRawSQLQuery<IE extends IEntity> extends PHRawQuery<IE> {
    select: IE;
    from?: IQEntity[];
    where?: JSONBaseOperation;
}
export interface PHJsonFlatSQLQuery extends PHJsonCommonSQLQuery {
    select?: JSONSelectObject[];
    groupBy: any;
    having: any;
}
export interface PHJsonObjectSQLQuery<IE extends IEntity> extends PHJsonCommonSQLQuery {
    select: IE;
}
export interface PHJsonCommonSQLQuery {
    from?: JSONRelation[];
    where?: JSONBaseOperation;
    orderBy?: JSONFieldInOrderBy[];
}
export declare enum JoinType {
    FULL_JOIN = 0,
    INNER_JOIN = 1,
    LEFT_JOIN = 2,
    RIGHT_JOIN = 3,
}
export declare class PHSQLQuery<IE extends IEntity> implements PHQuery<IE> {
    phRawQuery: PHRawSQLQuery<IE>;
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
    constructor(phRawQuery: PHRawSQLQuery<IE>, qEntity: QEntity<any>, qEntityMap: {
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
    toSQL(): PHJsonCommonSQLQuery<IE>;
}
