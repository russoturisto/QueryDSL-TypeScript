import { IEntity, QEntity } from "../core/entity/Entity";
import { PHJsonQuery } from "./PHQuery";
import { RelationRecord } from "../core/entity/Relation";
import { JSONLogicalOperation } from "../core/operation/LogicalOperation";
import { JSONBaseOperation } from "../core/operation/Operation";
/**
 * Created by Papa on 8/12/2016.
 */
export interface PHJsonSQLQuery<EQ extends IEntity> {
    select: EQ;
    join?: any;
    where?: JSONBaseOperation;
}
export declare class PHSQLQuery<IE extends IEntity> {
    phJsonQuery: PHJsonQuery;
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
    constructor(phJsonQuery: PHJsonQuery, qEntity: QEntity<any>, qEntityMap: {
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
    toSQL(): string;
    toWhereFragment(operation: JSONBaseOperation): string;
    toLogicalWhereFragment(logicalOperation: JSONLogicalOperation): string;
    toAndOrWhereFragment(operations: JSONBaseOperation[], sqlLogicalOperator: any): string;
    getLogicalOperator(logicalOperation: JSONLogicalOperation): string;
}
