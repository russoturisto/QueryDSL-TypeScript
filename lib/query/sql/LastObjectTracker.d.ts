import { SQLDataType } from "./SQLStringQuery";
/**
 * Created by Papa on 10/14/2016.
 */
export declare class LastObjectTracker {
    currentRowObjectMap: {
        [alias: string]: any;
    };
    objectEqualityMap: {
        [alias: string]: boolean;
    };
    lastRowObjectMap: {
        [alias: string]: any;
    };
    currentObjectOneToManys: {
        [propertyName: string]: any[];
    };
    addEntity(entityAlias: string, resultObject: any): void;
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string): void;
    addManyToOneReference(entityAlias: string, resultObject: any, propertyName: string, manyToOneIdField: string): void;
    addManyToOneObject(entityAlias: string, resultObject: any, propertyName: string): void;
    addOneToManyCollection(entityAlias: string, resultObject: any, propertyName: string): void;
    private isDifferentOrDoesntExist(entityAlias, resultObject, propertyName);
    mergeEntity(entityAlias: string, resultObject: any): any;
    flushRow(): void;
}
