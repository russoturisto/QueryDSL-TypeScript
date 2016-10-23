import { PHSQLQuery, PHRawNonEntitySQLQuery, PHJsonFlatSQLQuery } from "../../PHSQLQuery";
import { QEntity } from "../../../../core/entity/Entity";
import { RelationRecord } from "../../../../core/entity/Relation";
/**
 * Created by Papa on 10/23/2016.
 */
export declare class PHFlatSQLQuery implements PHSQLQuery {
    phRawQuery: PHRawNonEntitySQLQuery;
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
    constructor(phRawQuery: PHRawNonEntitySQLQuery, qEntity: QEntity<any>, qEntityMap: {
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
