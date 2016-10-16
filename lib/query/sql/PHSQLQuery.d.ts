import { IEntity, QEntity, IQEntity } from "../../core/entity/Entity";
import { RelationRecord, JSONRelation } from "../../core/entity/Relation";
import { JSONLogicalOperation } from "../../core/operation/LogicalOperation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { PHQuery, PHRawQuery } from "../PHQuery";
import { JSONFieldInOrderBy } from "../../core/field/FieldInOrderBy";
/**
 * Created by Papa on 8/12/2016.
 */
export interface PHRawSQLQuery<IE extends IEntity> extends PHRawQuery<IE> {
    select: IE;
    from?: IQEntity[];
    where?: JSONBaseOperation;
}
export interface PHJsonSQLQuery<IE extends IEntity> {
    select: IE;
    from?: JSONRelation[];
    where?: JSONBaseOperation;
    orderBy?: JSONFieldInOrderBy[];
}
export declare enum JoinType {
    INNER_JOIN = 0,
    LEFT_JOIN = 1,
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
    toSQL(): PHJsonSQLQuery<IE>;
    toWhereFragment(operation: JSONBaseOperation): string;
    toLogicalWhereFragment(logicalOperation: JSONLogicalOperation): string;
    toAndOrWhereFragment(operations: JSONBaseOperation[], sqlLogicalOperator: any): string;
    getLogicalOperator(logicalOperation: JSONLogicalOperation): string;
}
