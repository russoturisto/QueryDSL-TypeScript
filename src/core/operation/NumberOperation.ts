import {FieldType} from "../field/Field";
import {OperationType} from "./OperationType";
import {JSONBaseOperation, Operation, IOperation, IValueOperation} from "./Operation";
import {JSONStringOperation} from "./StringOperation";
import {JSONClauseObject} from "../field/Appliable";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONNumberOperation extends JSONBaseOperation {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue:JSONClauseObject;
	rValue:JSONClauseObject | JSONClauseObject[] | number | number[];
}

export interface INumberOperation extends IValueOperation<number, JSONStringOperation> {


	greaterThan(
		greaterThan:number
	):JSONNumberOperation;

	greaterThanOrEquals(
		greaterThanOrEquals:number
	):JSONNumberOperation;

	lessThan(
		lessThan:number
	):JSONNumberOperation;

	lessThanOrEquals(
		lessThanOrEquals:number
	):JSONNumberOperation;

}

export class NumberOperation extends Operation<number, JSONStringOperation> implements INumberOperation {

	constructor() {
		super(FieldType.NUMBER);
	}

	greaterThan(
		greaterThan:number
	):JSONNumberOperation {
		return {
			$gt: greaterThan
		};
	}

	greaterThanOrEquals(
		greaterThanOrEquals:number
	):JSONNumberOperation {
		return {
			$gte: greaterThanOrEquals
		};
	}

	lessThan(
		lessThan:number
	):JSONNumberOperation {
		return {
			$lt: lessThan
		};
	}

	lessThanOrEquals(
		lessThanOrEquals:number
	):JSONNumberOperation {
		return {
			$lte: lessThanOrEquals
		};
	}

}