import { PHJsonSQLQuery } from "./PHSQLQuery";
import { RelationRecord } from "../core/entity/Relation";
import { IEntity, QEntity } from "../core/entity/Entity";
import { QueryTreeNode } from "./QueryTreeNode";
export declare class SQLQuery<IE extends IEntity> {
    phJsonQuery: PHJsonSQLQuery<IE>;
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
    aliasMap: {
        [key: string]: string;
    };
    currentAliasIndex: number;
    constructor(phJsonQuery: PHJsonSQLQuery<IE>, qEntity: QEntity<any>, qEntityMap: {
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
    getSelectFragment(entityMapping: string, existingSelectFragment: string, selectClauseFragment: any): string;
    getFromFragment(): string;
    getQueryTree(): QueryTreeNode;
    parseSQL(): any;
}
