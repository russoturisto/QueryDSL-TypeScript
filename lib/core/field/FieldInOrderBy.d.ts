import { Orderable, IQField } from "./Field";
import { JSONClauseField } from "./Appliable";
export interface JSONFieldInOrderBy {
    field: JSONClauseField;
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
