/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { IComparisonOperation, ComparisonOperation } from "../operation/ComparisonOperation";
export declare enum FieldType {
    BOOLEAN = 0,
    BOOLEAN_ARRAY = 1,
    DATE = 2,
    DATE_ARRAY = 3,
    NUMBER = 4,
    NUMBER_ARRAY = 5,
    STRING = 6,
    STRING_ARRAY = 7,
}
export interface IQField<T, IQ extends IQEntity<IQ>> extends IComparisonOperation<T, IQ> {
}
export declare class QField<T, IQ extends IQEntity<IQ>> extends ComparisonOperation<T, IQ> {
    qConstructor: new () => IQ;
    constructor(q: IQ, qConstructor: new () => IQ, fieldType: FieldType, fieldName: string, nativeFieldName?: string);
}
