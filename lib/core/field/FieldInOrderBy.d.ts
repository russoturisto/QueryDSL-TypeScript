/**
 * Created by Papa on 10/16/2016.
 */
import { Orderable, IQField } from "./Field";
export interface JSONFieldInGroupBy {
    fieldAlias: string;
}
export interface JSONFieldInOrderBy extends JSONFieldInGroupBy {
    fieldAlias: string;
    sortOrder: SortOrder;
}
export declare enum SortOrder {
    ASCENDING = 0,
    DESCENDING = 1,
}
export interface IFieldInOrderBy<IQF extends IQField<IQF>> {
}
export declare class FieldInOrderBy<IQF extends IQField<IQF>> implements IFieldInOrderBy<IQF> {
    field: Orderable<IQF>;
    sortOrder: SortOrder;
    constructor(field: Orderable<IQF>, sortOrder: SortOrder);
    toJSON(): JSONFieldInOrderBy;
}
