/**
 * Created by Papa on 4/21/2016.
 */
import { IComparisonOperation } from "../operation/ComparisonOperation";
import { IQEntity } from "../entity/Entity";
import { IOperation } from "../operation/Operation";
export declare class StringField<Q extends IQEntity<Q>> implements IComparisonOperation<string, Q>, IOperation<Q> {
    private fieldName;
    private qEntity;
    comparisonOperation: IComparisonOperation<string, Q>;
    constructor(fieldName: string, qEntity: Q);
    getQ(): Q;
    setComparisonOperation(value: string): void;
    equals(value: string): IComparisonOperation<string, Q>;
    objectEquals<OP extends IOperation<Q>>(otherOp: OP, checkValue?: boolean): boolean;
}
