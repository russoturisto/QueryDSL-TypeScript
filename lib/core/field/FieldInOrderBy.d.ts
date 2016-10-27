/**
 * Created by Papa on 10/16/2016.
 */
import { IQEntity } from "../entity/Entity";
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
export interface IFieldInOrderBy<IQ extends IQEntity, IQF extends IQField<IQ, IQF>> {
}
export declare class FieldInOrderBy<IQ extends IQEntity, IQF extends IQField<IQ, IQF>> implements IFieldInOrderBy<IQ, IQF> {
    field: Orderable<IQ, IQF>;
    sortOrder: SortOrder;
    constructor(field: Orderable<IQ, IQF>, sortOrder: SortOrder);
    toJSON(): JSONFieldInOrderBy;
}
