import {FieldType} from "../field/Field";
import {JSONBaseOperation, IOperation, Operation} from "./Operation";
import {JSONClauseObject} from "../field/Appliable";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONDateOperation extends JSONBaseOperation {
	operation: "$eq" | "$exists" | "$in" | "$ne" | "$nin" | "$gt" | "$gte" | "$lt" | "$lte";
	lValue:JSONClauseObject | JSONClauseObject[] | Date | Date[];
	rValue:JSONClauseObject | JSONClauseObject[] | Date | Date[];
}

export interface IDateOperation extends IOperation<Date, JSONDateOperation> {

	greaterThan(
		greaterThan:Date
	):JSONDateOperation;

	greaterThanOrEquals(
		greaterThanOrEquals:Date
	):JSONDateOperation;

	lessThan(
		lessThan:Date
	):JSONDateOperation;

	lessThanOrEquals(
		lessThanOrEquals:Date
	):JSONDateOperation;

}

export class DateOperation extends Operation<Date, JSONDateOperation> implements IDateOperation {

	constructor() {
		super(FieldType.DATE);
	}

	greaterThan(
		greaterThan:Date
	):JSONDateOperation {
		return {
			$gt: greaterThan
		};
	}

	greaterThanOrEquals(
		greaterThanOrEquals:Date
	):JSONDateOperation {
		return {
			$gte: greaterThanOrEquals
		};
	}

	lessThan(
		lessThan:Date
	):JSONDateOperation {
		return {
			$lt: lessThan
		};
	}

	lessThanOrEquals(
		lessThanOrEquals:Date
	):JSONDateOperation {
		return {
			$lte: lessThanOrEquals
		};
	}

}