import {FieldType} from "../field/Field";
import {JSONBaseOperation, Operation, IOperation} from "./Operation";
import {JSONClauseObject} from "../field/Appliable";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONBooleanOperation extends JSONBaseOperation {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin";
	lValue:JSONClauseObject | JSONClauseObject[] | boolean | boolean[];
	rValue:JSONClauseObject | JSONClauseObject[] | boolean | boolean[];
}

export interface IBooleanOperation extends IOperation<boolean, JSONBooleanOperation> {
}

export class BooleanOperation extends Operation<boolean, JSONBooleanOperation> implements IBooleanOperation {

	constructor() {
		super(FieldType.BOOLEAN);
	}

}