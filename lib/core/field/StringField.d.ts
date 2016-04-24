/**
 * Created by Papa on 4/21/2016.
 */
import { IComparisonOperation, ComparisonOperation } from "../operation/ComparisonOperation";
import { IQEntity } from "../entity/Entity";
import { IOperation } from "../operation/Operation";
export declare abstract class StringField<Q extends IQEntity<Q>> extends ComparisonOperation<string, Q, StringField<Q>> {
    comparisonOperation: IComparisonOperation<string, Q, StringField<Q>>;
    constructor(fieldName: string, qEntity: Q);
    setComparisonOperation(value: string): void;
    objectEquals<OP extends IOperation<Q>>(otherOp: OP, checkValue?: boolean): boolean;
}
