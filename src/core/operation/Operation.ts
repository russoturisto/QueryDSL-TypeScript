/**
 * Created by Papa on 4/21/2016.
 */
import {OperationType} from "./OperationType";
import {JSONFieldReference} from "./FieldOperation";


export interface JSONBaseOperation {
	order:number;
	__include__?:boolean;
}

export interface JSONOperation {
	"$and"?:JSONOperation[];
	"$eq"?:boolean | Date | JSONFieldReference | number | string;
	"$exists"?:boolean;
	"$gt"?:Date | JSONFieldReference | number;
	"$gte"?:Date | JSONFieldReference | number;
	"$in"?:Date[] | number[] | string[];
	"$lt"?:Date | JSONFieldReference | number;
	"$lte"?:Date | JSONFieldReference | number;
	"$like"?:string | RegExp;
	"$ne"?:boolean | Date | JSONFieldReference | number | string;
	"$nin"?:Date[] | number[] | string[];
	"$not"?:JSONOperation;
	"$or"?:JSONOperation[];
}

export interface IOperation {

	type:OperationType;

	objectEquals<OP extends IOperation>(
		otherOp:OP,
		checkValue?:boolean
	):boolean;

	toJSON():JSONOperation;

}

export abstract class Operation implements IOperation {

	constructor(
		public type:OperationType
	) {
	}

	abstract toJSON():JSONOperation;

	objectEquals<OP extends Operation>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {

		if (this.constructor !== otherOp.constructor) {
			return false;
		}
		if (this.type !== otherOp.type) {
			return false;
		}

		if (checkValue && !this.valueEquals(otherOp, checkValue)) {
			return false;
		}

		return true;
	}

	protected abstract valueEquals<OP extends Operation>(
		otherOp:OP,
		checkChildValues?:boolean
	):boolean;

}
