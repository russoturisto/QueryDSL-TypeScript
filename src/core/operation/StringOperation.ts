import {FieldType} from "../field/Field";
import {JSONBaseOperation, Operation, IOperation} from "./Operation";
import {JSONStringFieldOperation} from "../field/StringField";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONStringOperation extends JSONBaseOperation {
	"$eq"?:string;
	"$exists"?:boolean;
	"$in"?:Date[] | string[];
	"$like"?:string | RegExp;
	"$ne"?:string;
	"$nin"?:string[];
}

export interface IStringOperation extends IOperation {

	equals(
		value:string
	):JSONStringFieldOperation;

	exists(
		exists:boolean
	):JSONStringFieldOperation;

	isIn(
		values:string[]
	):JSONStringFieldOperation;

	like(
		like:string | RegExp
	):JSONStringFieldOperation;

	notEquals(
		value:string
	):JSONStringFieldOperation;

	notIn(
		values:string[]
	):JSONStringFieldOperation;

}

export class StringOperation extends Operation implements IStringOperation {

	constructor() {
		super(FieldType.NUMBER);
	}

	equals(
		value:string
	):JSONStringFieldOperation{
		return {
			$eq: value
		};
	}

	exists(
		exists:boolean
	):JSONStringFieldOperation{
		return {
			$exists: exists
		};
	}

	isIn(
		values:string[]
	):JSONStringFieldOperation{
		return {
			$in: values
		};
	}

	like(
		like:string | RegExp
	):JSONStringFieldOperation{
		return {
			$like: like
		};
	}

	notEquals(
		value:string
	):JSONStringFieldOperation{
		return {
			$ne: value
		};
	}

	notIn(
		values:string[]
	):JSONStringFieldOperation{
		return {
			$nin: values
		};
	}

}