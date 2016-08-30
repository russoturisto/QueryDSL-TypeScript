import { JSONBaseOperation, Operation, IOperation } from "./Operation";
import { JSONStringFieldOperation } from "../field/StringField";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONStringOperation extends JSONBaseOperation {
    "$like"?: string | RegExp;
}
export interface IStringOperation extends IOperation<string, JSONStringOperation> {
    like(like: string | RegExp): JSONStringFieldOperation;
}
export declare class StringOperation extends Operation<string, JSONStringOperation> implements IStringOperation {
    constructor();
    like(like: string): JSONStringOperation;
}
