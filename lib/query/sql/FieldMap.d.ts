/**
 * Created by Papa on 9/10/2016.
 */
export declare class FieldMap {
    entityMap: {
        [entityName: string]: EntityFieldMap;
    };
    tableMap: {
        [tableName: string]: EntityFieldMap;
    };
    ensure(entityName: string, tableName: string): EntityFieldMap;
    existsByStructure(tableName: string, columnName: string): boolean;
    existsByModel(entityName: string, propertyName: string): boolean;
}
export declare class EntityFieldMap {
    entityName: string;
    tableName: string;
    columnMap: {
        [columnName: string]: PropertyFieldEntry;
    };
    propertyMap: {
        [propertyName: string]: PropertyFieldEntry;
    };
    constructor(entityName: string, tableName: string);
    ensure(propertyName: string, columnName: string): PropertyFieldEntry;
}
export declare class PropertyFieldEntry {
    propertyName: string;
    columnName: string;
    constructor(propertyName: string, columnName: string);
}
