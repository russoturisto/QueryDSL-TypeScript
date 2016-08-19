import {FieldType} from "../field/Field";
import {JSONBaseOperation, IOperation, Operation} from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONDateOperation extends JSONBaseOperation {
	"$eq"?:Date;
	"$exists"?:boolean;
	"$gt"?:Date;
	"$gte"?:Date;
	"$in"?:Date[];
	"$lt"?:Date;
	"$lte"?:Date;
	"$ne"?:Date;
	"$nin"?:Date[];
}

export interface IDateOperation extends IOperation {

	equals(
		value:Date
	):JSONDateOperation;

	exists(
		exists:boolean
	):JSONDateOperation;

	greaterThan(
		greaterThan:Date
	):JSONDateOperation;

	greaterThanOrEquals(
		greaterThanOrEquals:Date
	):JSONDateOperation;

	isIn(
		values:Date[]
	):JSONDateOperation;

	lessThan(
		lessThan:Date
	):JSONDateOperation;

	lessThanOrEquals(
		lessThanOrEquals:Date
	):JSONDateOperation;

	notEquals(
		value:Date
	):JSONDateOperation;

	notIn(
		values:Date[]
	):JSONDateOperation;

}

export class DateOperation extends Operation implements IDateOperation {

	constructor() {
		super(FieldType.DATE);
	}

	equals(
		value:Date
	):JSONDateOperation {
		return {
			$eq: value
		};
	}

	exists(
		exists:boolean
	):JSONDateOperation {
		return {
			$exists: exists
		};
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

	isIn(
		values:Date[]
	):JSONDateOperation {
		return {
			$in: values
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

	notEquals(
		value:Date
	):JSONDateOperation {
		return {
			$ne: value
		};
	}

	notIn(
		values:Date[]
	):JSONDateOperation {
		return {
			$nin: values
		};
	}

}