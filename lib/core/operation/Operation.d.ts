/**
 * Created by Papa on 4/21/2016.
 */
import { IQEntity } from "../entity/Entity";
import { OperationType } from "./OperationType";
import { QueryFragment } from "../QueryFragment";
import { FieldType } from "../field/Field";
export interface IOperation<IQ extends IQEntity<IQ>> {
    objectEquals<OP extends IOperation<IQ>>(otherOp: OP, checkValue?: boolean): boolean;
    getQ(): IQ;
}
export declare abstract class Operation<IQ extends IQEntity<IQ>> extends QueryFragment implements IOperation<IQ> {
    q: IQ;
    fieldType?: FieldType;
    fieldName?: string;
    nativeFieldName: string;
    type?: OperationType;
    constructor(q: IQ, fieldType?: FieldType, fieldName?: string, nativeFieldName?: string, type?: OperationType);
    getQ(): IQ;
    objectEquals<OP extends Operation<IQ>>(otherOp: OP, checkValue?: boolean): boolean;
    protected abstract valueEquals<OP extends Operation<IQ>>(otherOp: OP, checkChildValues?: boolean): boolean;
}
