import { INonEntityOrderByParser } from "./IEntityOrderByParser";
import { JSONFieldInOrderBy } from "../../../../core/field/FieldInOrderBy";
import { IValidator } from "../../../../validation/Validator";
/**
 * Created by Papa on 10/16/2016.
 */
/**
 * Will order the results exactly as specified in the Order By clause
 */
export declare class ExactOrderByParser implements INonEntityOrderByParser {
    private validator;
    constructor(validator: IValidator);
    getOrderByFragment(rootSelectClauseFragment: any, orderBy: JSONFieldInOrderBy[]): string;
}
