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
    protected getWHEREFragment(operation: JSONBaseOperation, nestingPrefix: string, joinNodeMap: {
        [alias: string]: JoinTreeNode;
    }, embedParameters?: boolean, parameters?: any[]): string;
    private getLogicalWhereFragment(operation, nestingPrefix, joinNodeMap, embedParameters?, parameters?);
    private getComparibleOperatorAndValueFragment<T>(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters?, parameters?, conversionFunction?);
    private getCommonOperatorAndValueFragment<T>(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters?, parameters?, conversionFunction?);
    protected getEntityPropertyColumnName(qEntity: IQEntity, propertyName: string, tableAlias: string): string;
    protected getTableName(qEntity: IQEntity): string;
    private throwValueOnOperationError(valueType, operation, alias, propertyName);
    protected sanitizeStringValue(value: string, embedParameters: boolean): string;
    protected booleanTypeCheck(valueToCheck: any): boolean;
    protected dateTypeCheck(valueToCheck: any): boolean;
    protected numberTypeCheck(valueToCheck: any): boolean;
    protected stringTypeCheck(valueToCheck: any): boolean;
    protected addField(entityName: string, tableName: string, propertyName: string, columnName: string): void;
    protected warn(warning: string): void;
}
