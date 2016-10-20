import { IEntity, IQEntity } from "../../core/entity/Entity";
import { ISQLAdaptor } from "./adaptor/SQLAdaptor";
import { SQLDialect } from "./SQLStringQuery";
import { RelationRecord } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { FieldMap } from "./FieldMap";
import { JoinTreeNode } from "../../core/entity/JoinTreeNode";
/**
 * Created by Papa on 10/2/2016.
 */
export declare abstract class SQLStringWhereBase<IE extends IEntity> {
    protected rootQEntity: IQEntity;
    protected qEntityMapByName: {
        [entityName: string]: IQEntity;
    };
    protected entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    };
    protected entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    };
    protected dialect: SQLDialect;
    protected fieldMap: FieldMap;
    protected sqlAdaptor: ISQLAdaptor;
    protected qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    };
    constructor(rootQEntity: IQEntity, qEntityMapByName: {
        [entityName: string]: IQEntity;
    }, entitiesRelationPropertyMap: {
        [entityName: string]: {
            [propertyName: string]: RelationRecord;
        };
    }, entitiesPropertyTypeMap: {
        [entityName: string]: {
            [propertyName: string]: boolean;
        };
    }, dialect: SQLDialect);
    protected getWHEREFragment(operation: JSONBaseOperation, nestingIndex: number, joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }, embedParameters?: boolean, parameters?: any[]): string;
}
