/**
 * Created by Papa on 4/21/2016.
 */
import { FieldType } from "../field/Field";
export interface JSONBaseOperation {
}
export interface IOperation {
    type: FieldType;
}
export declare abstract class Operation implements IOperation {
    type: FieldType;
    constructor(type: FieldType);
}
