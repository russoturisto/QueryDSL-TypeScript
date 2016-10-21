import {FieldType} from "../field/Field";
import {JSONBaseOperation, Operation, IOperation} from "./Operation";
import {JSONStringFieldOperation} from "../field/StringField";
import {JSONClauseObject} from "../field/Appliable";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONStringOperation extends JSONBaseOperation {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$like";
	lValue:JSONClauseObject;
	rValue:JSONClauseObject | JSONClauseObject[] | string | string[];
}

export interface IStringOperation extends IOperation<string, JSONStringOperation> {

	like(
		like:string | RegExp
	):JSONStringFieldOperation;
}

export class StringOperation extends Operation<string, JSONStringOperation> implements IStringOperation {

	constructor() {
		super(FieldType.NUMBER);
	}

	like(
		like:string
	  // TODO: implement ReqExp
			//| RegExp
	):JSONStringOperation{
		return {
			$like: like
		};
	}

}