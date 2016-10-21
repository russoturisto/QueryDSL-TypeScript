import {FieldType} from "../field/Field";
import {
	JSONBaseOperation, Operation, IOperation, ValueOperation, IValueOperation,
	JSONValueOperation
} from "./Operation";
import {JSONClauseObject} from "../field/Appliable";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONBooleanOperation extends JSONValueOperation<boolean> {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin";
}

export interface IBooleanOperation extends IValueOperation<boolean, JSONBooleanOperation> {
}

export class BooleanOperation extends ValueOperation<boolean, JSONBooleanOperation> implements IBooleanOperation {

	constructor() {
		super(FieldType.BOOLEAN);
	}

}