import {FieldType} from "../field/Field";
import {OperationType} from "./OperationType";
import {JSONBaseOperation, Operation, IOperation} from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONNumberOperation extends JSONBaseOperation {
	"$eq"?:number;
	"$exists"?:boolean;
	"$gt"?:number;
	"$gte"?:number;
	"$in"?:number[];
	"$lt"?:number;
	"$lte"?:number;
	"$ne"?:number;
	"$nin"?:number[];
}

export interface INumberOperation extends IOperation {

	equals(
		value:number
	):JSONNumberOperation;

	exists(
		exists:boolean
	):JSONNumberOperation;

	greaterThan(
		greaterThan:number
	):JSONNumberOperation;

	greaterThanOrEquals(
		greaterThanOrEquals:number
	):JSONNumberOperation;

	isIn(
		values:number[]
	):JSONNumberOperation;

	lessThan(
		lessThan:number
	):JSONNumberOperation;

	lessThanOrEquals(
		lessThanOrEquals:number
	):JSONNumberOperation;

	notEquals(
		value:number
	):JSONNumberOperation;

	notIn(
		values:number[]
	):JSONNumberOperation;

}

export class NumberOperation extends Operation implements INumberOperation {

	constructor() {
		super(FieldType.NUMBER);
	}

	equals(
		value:number
	):JSONNumberOperation {
		return {
			$eq: value
		};
	}

	exists(
		exists:boolean
	):JSONNumberOperation {
		return {
			$exists: exists
		};
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

	isIn(
		values:number[]
	):JSONNumberOperation {
		return {
			$in: values
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

	notEquals(
		value:number
	):JSONNumberOperation {
		return {
			$ne: value
		};
	}

	notIn(
		values:number[]
	):JSONNumberOperation {
		return {
			$nin: values
		};
	}

}