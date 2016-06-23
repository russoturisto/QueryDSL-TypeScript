import { IOperation, Operation, JSONOperation } from "./Operation";
import { OperationType } from "./OperationType";
import { IQField } from "../field/Field";
export declare function equals(value: boolean | Date | number | string | IQField<any>): IQueryOperation;
export declare function exists(exists: boolean): IQueryOperation;
export declare function greaterThan(greaterThan: Date | number | IQField<any>): IQueryOperation;
export declare function greaterThanOrEquals(greaterThanOrEquals: Date | number | IQField<any>): IQueryOperation;
export declare function isIn(values: boolean[] | Date[] | number[] | string[]): IQueryOperation;
export declare function like(like: string | RegExp): IQueryOperation;
export declare function lessThan(lessThan: Date | number | IQField<any>): IQueryOperation;
export declare function lessThanOrEquals(lessThanOrEquals: Date | number | IQField<any>): IQueryOperation;
export declare function notEquals(value: boolean | number | string | IQField<any>): IQueryOperation;
export declare function notIn(values: boolean[] | Date[] | number[] | string[]): IQueryOperation;
export interface IQueryOperation extends IOperation {
}
export declare class QueryOperation extends Operation {
    static getDefinedInstance(type: OperationType, value: any): IQueryOperation;
    isDefined: boolean;
    value: any;
    constructor(type: OperationType);
    valueEquals(otherOp: IOperation, checkValue?: boolean): boolean;
    toJSON(): JSONOperation;
}
