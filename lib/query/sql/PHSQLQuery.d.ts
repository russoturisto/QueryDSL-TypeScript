import { IEntity, QEntity, IQEntity } from "../../core/entity/Entity";
import { RelationRecord, JSONRelation, IQManyToOneRelation } from "../../core/entity/Relation";
import { JSONBaseOperation, JSONValueOperation } from "../../core/operation/Operation";
import { PHQuery, PHRawQuery } from "../PHQuery";
import { JSONFieldInOrderBy } from "../../core/field/FieldInOrderBy";
import { IQField } from "../../core/field/Field";
import { Appliable, JSONClauseObject } from "../../core/field/Appliable";
/**
 * Created by Papa on 8/12/2016.
 */
export interface PHRawSQLQuery extends PHRawQuery {
    select: any;
    from?: IQEntity[];
    where?: JSONBaseOperation;
    orderBy?: JSONFieldInOrderBy[];
}
export interface PHRawObjectSQLQuery<IE extends IEntity> extends PHRawSQLQuery {
    select: IE;
}
export interface PHRawFlatSQLQuery extends PHRawSQLQuery {
    from: IQEntity[];
    select: Appliable<any, any> | Appliable<any, any>[];
    groupBy: (IQField<any, any, any, any> | IQManyToOneRelation<any, any, any>)[];
    having: JSONValueOperation<any>[];
}
export interface PHJsonCommonSQLQuery {
    rootEntityPrefix: string;
    select: any;
    from?: JSONRelation[];
    where?: JSONBaseOperation;
    orderBy?: JSONFieldInOrderBy[];
}
export interface PHJsonFlatSQLQuery extends PHJsonCommonSQLQuery {
    select: JSONClauseObject[];
    groupBy: JSONClauseObject[];
    having: JSONBaseOperation[];
}
export interface PHJsonObjectSQLQuery<IE extends IEntity> extends PHJsonCommonSQLQuery {
    select: IE;
}
export declare enum JoinType {
    FULL_JOIN = 0,
    INNER_JOIN = 1,
    LEFT_JOIN = 2,
    RIGHT_JOIN = 3,
}
export interface PHSQLQuery extends PHQuery {
    toSQL(): PHJsonCommonSQLQuery;
}
export declare function getPHSQLQuery<PHSQ extends PHSQLQuery, PHRSQ extends PHRawSQLQuery>(phRawQuery: PHRSQ, qEntity: QEntity<any>, qEntityMap: {
    [entityName: string]: QEntity<any>;
}, entitiesRelationPropertyMap: {
    [entityName: string]: {
        [propertyName: string]: RelationRecord;
    };
}, entitiesPropertyTypeMap: {
    [entityName: string]: {
        [propertyName: string]: boolean;
    };
}): PHSQ;
export declare const QUERY_MARKER_FIELD: string;
export declare class PHObjectSQLQuery<IE extends IEntity> implements PHSQLQuery {
    phRawQuery: PHRawObjectSQLQuery<IE>;
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
    constructor(phRawQuery: PHRawObjectSQLQuery<IE>, qEntity: QEntity<any>, qEntityMap: {
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
    toSQL(): PHJsonObjectSQLQuery<IE>;
}
export declare class PHFlatSQLQuery implements PHSQLQuery {
    phRawQuery: PHRawFlatSQLQuery;
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
    constructor(phRawQuery: PHRawFlatSQLQuery, qEntity: QEntity<any>, qEntityMap: {
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
    toSQL(): PHJsonFlatSQLQuery;
}
