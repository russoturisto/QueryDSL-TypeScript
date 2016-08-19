import {FieldType} from "../field/Field";
import {JSONBaseOperation, Operation, IOperation} from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONBooleanOperation extends JSONBaseOperation {
	"$eq"?: boolean;
	"$exists"?: boolean;
	"$ne"?: boolean;
}

export interface IBooleanOperation extends IOperation {

	equals(
		value:boolean
	):JSONBooleanOperation;

	exists(
		exists:boolean
	):JSONBooleanOperation;

	notEquals(
		value:boolean
	):JSONBooleanOperation;

}

export class BooleanOperation extends Operation implements IBooleanOperation {

	constructor() {
		super(FieldType.BOOLEAN);
	}

	equals(
		value:boolean
	):JSONBooleanOperation {
		return {
		    $eq: value
        };
	}

	exists(
		exists:boolean
	):JSONBooleanOperation {
        return {
            $exists: exists
        };
	}

	notEquals(
		value:boolean
	):JSONBooleanOperation {
        return {
            $ne: value
        };
	}

}