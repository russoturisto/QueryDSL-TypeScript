/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IComparisonOperation, ComparisonOperation } from "../operation/ComparisonOperation";
export declare enum FieldType {
    BOOLEAN = 0,
    DATE = 1,
    ENTITY = 2,
    ENTITY_ARRAY = 3,
    NUMBER = 4,
    STRING = 5,
}
export interface IQField<T, IQ extends IQEntity<IQ>> extends IComparisonOperation<T, IQ> {
}
export declare class QField<T, IQ extends IQEntity<IQ>> extends ComparisonOperation<T, IQ> {
    constructor(owningEntity: IQ, fieldType: FieldType, fieldName: string, nativeFieldName?: string);
}
