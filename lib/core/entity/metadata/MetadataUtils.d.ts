import { EntityMetadata } from "../EntityMetadata";
import { OneToManyElements } from "./ColumnDecorators";
/**
 * Created by Papa on 9/2/2016.
 */
export interface OneToManyConfigAndProperty {
    propertyName: string;
    config: OneToManyElements;
}
export declare class MetadataUtils {
    static getRelatedOneToManyConfig(manyToOnePropertyName: any, entityMetadata: EntityMetadata): OneToManyConfigAndProperty;
    static getPropertyColumnName(propertyName: string, entityMetadata: EntityMetadata): string;
    static getJoinColumnName(propertyName: string, entityMetadata: EntityMetadata): string;
    static getIdValue(entityObject: any, entityMetadata: EntityMetadata): string;
    static getTableName(entityMetadata: EntityMetadata): string;
    static getOneToManyConfig(propertyName: string, entityMetadata: EntityMetadata): OneToManyElements;
    static warn(message: string): void;
}
