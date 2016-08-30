import {FieldType} from "../field/Field";
import {JSONBaseOperation, Operation, IOperation} from "./Operation";
import {JSONStringFieldOperation} from "../field/StringField";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONStringOperation extends JSONBaseOperation {
	"$like"?:string | RegExp;
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