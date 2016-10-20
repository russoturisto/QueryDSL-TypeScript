import { JSONBaseOperation, Operation, IOperation } from "./Operation";
import { JSONStringFieldOperation } from "../field/StringField";
import { JSONClauseObject } from "../field/Appliable";
/**
 * Created by Papa on 6/20/2016.
 */
export interface JSONStringOperation extends JSONBaseOperation {
    operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$like";
    lValue: JSONClauseObject | JSONClauseObject[] | string | string[];
    rValue: JSONClauseObject | JSONClauseObject[] | string | string[];
}
export interface IStringOperation extends IOperation<string, JSONStringOperation> {
    like(like: string | RegExp): JSONStringFieldOperation;
}
export declare class StringOperation extends Operation<string, JSONStringOperation> implements IStringOperation {
    constructor();
    like(like: string): JSONStringOperation;
}
