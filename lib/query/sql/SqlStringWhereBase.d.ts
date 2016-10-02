import { IEntity, QEntity, IQEntity } from "../../core/entity/Entity";
import { ISQLAdaptor } from "./adaptor/SQLAdaptor";
import { PHJsonSQLQuery } from "./PHSQLQuery";
import { SQLDialect } from "./SQLStringQuery";
import { RelationRecord } from "../../core/entity/Relation";
import { JSONBaseOperation } from "../../core/operation/Operation";
import { FieldMap } from "./FieldMap";
/**
 * Created by Papa on 10/2/2016.
 */
export declare abstract class SQLStringWhereBase<IE extends IEntity> {
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
    protected dialect: SQLDialect;
    fieldMap: FieldMap;
    joinAliasMap: {
        [entityName: string]: string;
    };
    sqlAdaptor: ISQLAdaptor;
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
    }, dialect: SQLDialect);
    protected getWHEREFragment(operation: JSONBaseOperation, nestingIndex: number, joinQEntityMap: {
        [alias: string]: IQEntity;
    }, embedParameters?: boolean, parameters?: any[]): string;
    private getComparibleOperatorAndValueFragment<T>(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters?, parameters?, conversionFunction?);
    private getCommonOperatorAndValueFragment<T>(fieldOperation, value, alias, propertyName, typeCheckFunction, typeName, embedParameters?, parameters?, conversionFunction?);
    protected getEntityPropertyColumnName(qEntity: IQEntity, propertyName: string, tableAlias: string): string;
    protected getTableName(qEntity: IQEntity): string;
    private getPropertyColumnName(entityName, propertyName, tableAlias, columnMap);
    private throwValueOnOperationError(valueType, operation, alias, propertyName);
    private sanitizeStringValue(value, embedParameters);
    private booleanTypeCheck(valueToCheck);
    private dateTypeCheck(valueToCheck);
    private numberTypeCheck(valueToCheck);
    private stringTypeCheck(valueToCheck);
    protected addField(entityName: string, tableName: string, propertyName: string, columnName: string): void;
    protected warn(warning: string): void;
}
