import { QueryResultType } from "../../SQLStringQuery";
import { JSONFieldInOrderBy } from "../../../../core/field/FieldInOrderBy";
import { IQEntity } from "../../../../core/entity/Entity";
import { EntityRelationRecord } from "../../../../core/entity/Relation";
import { JoinTreeNode } from "../../../../core/entity/JoinTreeNode";
import { IValidator } from "../../../../validation/Validator";
/**
 * Created by Papa on 10/16/2016.
 */
export interface IEntityOrderByParser {
    getOrderByFragment(joinTree: JoinTreeNode, qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }): string;
}
export interface INonEntityOrderByParser {
    getOrderByFragment(rootSelectClauseFragment: any, originalOrderBy: JSONFieldInOrderBy[]): string;
}
export declare abstract class AbstractEntityOrderByParser {
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
    protected validator: IValidator;
    protected orderBy: JSONFieldInOrderBy[];
    constructor(rootSelectClauseFragment: any, qEntityMapByName: {
        [alias: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: EntityRelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, validator: IValidator, orderBy?: JSONFieldInOrderBy[]);
    protected getCommonOrderByFragment(qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }, orderByFields: JSONFieldInOrderBy[]): string;
}
export declare function getOrderByParser(queryResultType: QueryResultType, selectClauseFragment: any, qEntityMapByName: {
    [entityName: string]: IQEntity;
}, entitiesRelationPropertyMap: {
    [entityName: string]: {
        [propertyName: string]: EntityRelationRecord;
    };
}, entitiesPropertyTypeMap: {
    [entityName: string]: {
        [propertyName: string]: boolean;
    };
}, orderBy?: JSONFieldInOrderBy[]): IEntityOrderByParser;
