import { HierarchicalResultParser } from "./HierarchicalResultParser";
/**
 * Created by Papa on 11/8/2016.
 */
export declare class MappedQueryResultParser extends HierarchicalResultParser {
    addEntity(entityAlias: string): any;
    bufferOneToManyCollection(entityAlias: string, resultObject: any, propertyName: string, childResultObject: any): void;
    flushEntity(entityAlias: string, resultObject: any): any;
}
