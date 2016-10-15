import { SQLDataType } from "./SQLStringQuery";
/**
 * Created by Papa on 10/14/2016.
 */
export declare class LastObjectTracker {
    lastObjectMap: {
        [alias: string]: any;
    };
    currentObjectMap: {
        [alias: string]: any;
    };
    objectEqualityMap: {
        [alias: string]: boolean;
    };
    addProperty(entityAlias: string, resultObject: any, dataType: SQLDataType, propertyName: string): void;
    addManyToOneReference(entityAlias: string, resultObject: any, propertyName: string, manyToOneIdField: string): void;
    private isDifferent(entityAlias, resultObject, propertyName);
}
