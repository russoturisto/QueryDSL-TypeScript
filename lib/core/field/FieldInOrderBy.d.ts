/**
 * Created by Papa on 10/16/2016.
 */
import { IQEntity } from "../entity/Entity";
import { Orderable } from "./Field";
export interface JSONFieldInOrderBy {
    alias: string;
    isManyToOneReference?: boolean;
    propertyName: string;
    sortOrder: SortOrder;
}
export declare enum SortOrder {
    ASCENDING = 0,
    DESCENDING = 1,
}
export interface IFieldInOrderBy<IQ extends IQEntity> {
    field: Orderable<IQ>;
    sortOrder: SortOrder;
}
export declare class FieldInOrderBy<IQ extends IQEntity> implements IFieldInOrderBy<IQ> {
    field: Orderable<IQ>;
    sortOrder: SortOrder;
    constructor(field: Orderable<IQ>, sortOrder: SortOrder);
    toJSON(): JSONFieldInOrderBy;
}
