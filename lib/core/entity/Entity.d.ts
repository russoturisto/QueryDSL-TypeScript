/**
 * Created by Papa on 4/21/2016.
 */
import { ILogicalOperation, LogicalOperation } from "../operation/LogicalOperation";
import { IOperation } from "../operation/Operation";
import { IComparisonOperation } from "../operation/ComparisonOperation";
import { IQRelation } from "./Relation";
import { IField } from "../field/Field";
export interface IQEntity<IQ extends IQEntity<IQ>> extends ILogicalOperation<IQ> {
    addEntityRelation<IQR extends IQEntity<IQR>, R>(relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<T, ICO extends IComparisonOperation<T, IQ>>(field: ICO): void;
    fields(fields: IOperation<IQ>[]): IQ;
    joinOn<T, C extends IComparisonOperation<T, IQ>>(comparisonOp: IComparisonOperation<T, IQ>): any;
}
export declare class QEntity<IQ extends IQEntity<IQ>> implements IQEntity<IQ> {
    private entityConstructor;
    private nativeName;
    entityFields: IField<any, IQ>[];
    entityRelations: IQRelation<any, any, IQ>[];
    rootOperation: LogicalOperation<IQ>;
    constructor(entityConstructor: Function, nativeName?: string);
    addEntityRelation<IQR extends IQEntity<IQR>, R>(relation: IQRelation<IQR, R, IQ>): void;
    addEntityField<T, ICO extends IField<T, IQ>>(field: ICO): void;
    addOperation<O extends IOperation<IQ>>(op: O): void;
    getQ(): IQ;
    fields(fields: IOperation<IQ>[]): IQ;
    joinOn<T, C extends IComparisonOperation<T, IQ>>(comparisonOp: IComparisonOperation<T, IQ>): void;
    and(...ops: IOperation<IQ>[]): IOperation<IQ>;
    or(...ops: IOperation<IQ>[]): IOperation<IQ>;
    not(op: IOperation<IQ>): IOperation<IQ>;
    objectEquals<OP extends IOperation<IQ>>(otherOp: OP, checkValues?: boolean): boolean;
}
