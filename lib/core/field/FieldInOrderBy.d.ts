/**
 * Created by Papa on 10/16/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IQField } from "./Field";
export interface JSONFieldInOrderBy {
    alias: string;
    propertyName: string;
    sortOrder: SortOrder;
}
export declare enum SortOrder {
    ASCENDING = 0,
    DESCENDING = 1,
}
export interface IFieldInOrderBy<IQ extends IQEntity> {
    field: IQField<IQ, any, any, any>;
    sortOrder: SortOrder;
}
export declare class FieldInOrderBy<IQ extends IQEntity> implements IFieldInOrderBy<IQ> {
    field: IQField<IQ, any, any, any>;
    sortOrder: SortOrder;
    constructor(field: IQField<IQ, any, any, any>, sortOrder: SortOrder);
    toJSON(): JSONFieldInOrderBy;
}
