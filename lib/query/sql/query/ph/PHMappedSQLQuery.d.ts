import { PHRawNonEntitySQLQuery } from "./PHNonEntitySQLQuery";
import { PHSQLQuery, PHJsonCommonSQLQuery, PHJsonGroupedSQLQuery } from "../../PHSQLQuery";
import { JSONJoinRelation, EntityRelationRecord } from "../../../../core/entity/Relation";
import { QEntity } from "../../../../core/entity/Entity";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonMappedQSLQuery extends PHJsonCommonSQLQuery, PHJsonGroupedSQLQuery, JSONJoinRelation {
}
export interface PHRawMappedSQLQuery<IE> extends PHRawNonEntitySQLQuery {
    select: IE;
}
export declare class PHMappedSQLQuery<IE> implements PHSQLQuery {
    phRawQuery: PHRawMappedSQLQuery<IE>;
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
    constructor(phRawQuery: PHRawMappedSQLQuery<IE>, qEntityMap: {
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
    toJSON(): PHJsonMappedQSLQuery;
}
