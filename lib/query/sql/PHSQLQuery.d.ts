import { IEntity, QEntity, IQEntity } from "../../core/entity/Entity";
import { RelationRecord, JSONRelation } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { PHQuery, PHRawQuery } from "../PHQuery";
import { JSONFieldInOrderBy } from "../../core/field/FieldInOrderBy";
import { JSONClauseObject } from "../../core/field/Appliable";
/**
 * Created by Papa on 8/12/2016.
 */
export interface PHRawSQLQuery extends PHRawQuery {
    select: any;
    from?: IQEntity[];
    where?: JSONBaseOperation;
    orderBy?: JSONFieldInOrderBy[];
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
