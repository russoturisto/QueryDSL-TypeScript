import { IEntity, QEntity } from "../../core/entity/Entity";
import { EntityRelationRecord, JSONRelation } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { PHQuery, PHRawQuery } from "../PHQuery";
import { JSONFieldInOrderBy } from "../../core/field/FieldInOrderBy";
import { JSONClauseObject } from "../../core/field/Appliable";
/**
 * Created by Papa on 8/12/2016.
 */
export interface PHRawSQLQuery extends PHRawQuery {
    from?: any[];
    orderBy?: JSONFieldInOrderBy[];
    select: any;
    where?: JSONBaseOperation;
}
export interface PHJsonCommonSQLQuery {
    from?: JSONRelation[];
    orderBy?: JSONFieldInOrderBy[];
    rootEntityPrefix: string;
    select: any;
    where?: JSONBaseOperation;
}
export interface PHJsonGroupedSQLQuery {
    groupBy?: JSONClauseObject[];
    having?: JSONBaseOperation[];
}
export interface PHJsonFlatSQLQuery extends PHJsonCommonSQLQuery, PHJsonGroupedSQLQuery {
    groupBy: JSONClauseObject[];
    having: JSONBaseOperation[];
    select: JSONClauseObject[];
}
export interface PHJsonObjectSQLQuery<IE extends IEntity> extends PHJsonCommonSQLQuery {
    select: IE;
}
export interface PHSQLQuery extends PHQuery {
    toSQL(): PHJsonCommonSQLQuery;
}
export declare abstract class PHAbstractSQLQuery {
    static whereClauseToJSON(whereClause: JSONBaseOperation): JSONBaseOperation;
    private static convertRValue(rValue);
}
export declare function getPHSQLQuery<PHSQ extends PHSQLQuery, PHRSQ extends PHRawSQLQuery>(phRawQuery: PHRSQ, qEntity: QEntity<any>, qEntityMap: {
    [entityName: string]: QEntity<any>;
}, entitiesRelationPropertyMap: {
    [entityName: string]: {
        [propertyName: string]: EntityRelationRecord;
    };
}, entitiesPropertyTypeMap: {
    [entityName: string]: {
        [propertyName: string]: boolean;
    };
}): PHSQ;
export declare const QUERY_MARKER_FIELD: string;
