/**
 * Created by Papa on 10/16/2016.
 */
import { Orderable, IQField } from "./Field";
import { FieldColumnAliases } from "../entity/Aliases";
export interface JSONFieldInGroupBy {
    fieldAlias: string;
}
export interface JSONFieldInOrderBy extends JSONFieldInGroupBy {
    sortOrder: SortOrder;
}
export interface JSONEntityFieldInOrderBy extends JSONFieldInOrderBy {
    entityName: string;
    propertyName: string;
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
    toJSON(columnAliases: FieldColumnAliases): JSONFieldInOrderBy;
    toEntityJSON(): JSONEntityFieldInOrderBy;
}
