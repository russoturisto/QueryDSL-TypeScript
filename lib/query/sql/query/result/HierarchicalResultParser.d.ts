/**
 * Created by Papa on 10/16/2016.
 */
import { SQLDataType } from "../../../../core/field/Appliable";
/**
 * The goal of this Parser is to determine which objects in the current row are the same
 * as they were in the previous row.  If the objects are the same this parser will merge them.
 */
export declare class HierarchicalResultParser {
    protected currentRowObjectMap: {
        [alias: string]: any;
    };
    protected objectEqualityMap: {
        [alias: string]: boolean;
    };
    protected lastRowObjectMap: {
        [alias: string]: any;
    };
    protected currentObjectOneToManys: {
        [propertyName: string]: any[];
    };
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string, propertyValue: any): void;
    protected isDifferentOrDoesntExist(entityAlias: string, resultObject: any, propertyName: string): boolean;
    protected addOneToManyCollection(entityAlias: string, resultObject: any, propertyName: string): void;
    protected mergeEntity(entityAlias: string, resultObject: any): any;
    flushRow(): void;
}
