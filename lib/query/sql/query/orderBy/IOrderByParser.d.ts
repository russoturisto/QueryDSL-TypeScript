import { QueryResultType } from "../../SQLStringQuery";
import { JSONFieldInOrderBy } from "../../../../core/field/FieldInOrderBy";
import { IQEntity } from "../../../../core/entity/Entity";
import { EntityRelationRecord } from "../../../../core/entity/Relation";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/16/2016.
 */
export interface IOrderByParser {
    getOrderByFragment(joinTree: JoinTreeNode, qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }): string;
}
export declare abstract class AbstractOrderByParser {
    protected rootQEntity: IQEntity;
    protected rootSelectClauseFragment: any;
    protected qEntityMapByName: {
        [alias: string]: IQEntity;
    };
    protected entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    };
    protected entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    };
    protected orderBy: JSONFieldInOrderBy[];
    constructor(rootQEntity: IQEntity, rootSelectClauseFragment: any, qEntityMapByName: {
        [alias: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, orderBy?: JSONFieldInOrderBy[]);
    protected getCommonOrderByFragment(qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }, orderByFields: JSONFieldInOrderBy[]): string;
}
export declare function getOrderByParser(queryResultType: QueryResultType, rootQEntity: IQEntity, selectClauseFragment: any, qEntityMapByName: {
    [entityName: string]: IQEntity;
}, entitiesRelationPropertyMap: {
    [entityName: string]: {
        [propertyName: string]: EntityRelationRecord;
    };
}, entitiesPropertyTypeMap: {
    [entityName: string]: {
        [propertyName: string]: boolean;
    };
}, orderBy?: JSONFieldInOrderBy[]): IOrderByParser;
