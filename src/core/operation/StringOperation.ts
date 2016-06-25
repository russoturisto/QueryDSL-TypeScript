import {JSONFieldReference, IFieldOperation, FieldOperation} from "./FieldOperation";
import {IQStringField, FieldType} from "../field/Field";
import {OperationType} from "./OperationType";
import {JSONBaseOperation} from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONStringOperation extends JSONBaseOperation {
	"$and"?:JSONStringOperation[];
	"$eq"?:JSONFieldReference | string;
	"$exists"?:boolean;
	"$in"?:Date[] | string[];
	"$like"?:string | RegExp;
	"$ne"?:JSONFieldReference | string;
	"$nin"?:string[];
	"$not"?:JSONStringOperation;
	"$or"?:JSONStringOperation[];
}

export interface IStringOperation
extends IFieldOperation<string> {

	equals(
		value:string | IQStringField<any>
	):IStringOperation;

	exists(
		exists:boolean
	):IStringOperation;

	isIn(
		values:string[]
	):IStringOperation;

	like(
		like:string | RegExp
	):IStringOperation;

	notEquals(
		value:string | IQStringField<any>
	):IStringOperation;

	notIn(
		values:string[]
	):IStringOperation;

	and(
		...ops:IStringOperation[]
	):IStringOperation;

	or(
		...ops:IStringOperation[]
	):IStringOperation;

	not(
		op:IStringOperation
	):IStringOperation;
}

export class StringOperation
extends FieldOperation<string> implements IStringOperation {

	constructor(
		type:OperationType
	) {
		super(type, FieldType.NUMBER);
	}

	getDefinedInstance(
		type:OperationType,
		value:any
	):IStringOperation {
		let definedOperation = new StringOperation(type);
		definedOperation.isDefined = true;
		definedOperation.value = value;

		return definedOperation;
	}

	equals(
		value:string | IQStringField<any>
	):IStringOperation {
		return this.getDefinedInstance(OperationType.EQUALS, value);
	}

	exists(
		exists:boolean
	):IStringOperation {
		return this.getDefinedInstance(OperationType.EXISTS, exists);
	}

	isIn(
		values:string[]
	):IStringOperation {
		return this.getDefinedInstance(OperationType.IN, values);
	}

	like(
		like:string | RegExp
	):IStringOperation {
		return this.getDefinedInstance(OperationType.LIKE, like);
	}

	notEquals(
		value:string | IQStringField<any>
	):IStringOperation {
		return this.getDefinedInstance(OperationType.NOT_EQUALS, value);
	}

	notIn(
		values:string[]
	):IStringOperation {
		return this.getDefinedInstance(OperationType.NOT_IN, values);
	}

	and(
		...ops:IStringOperation[]
	):IStringOperation {
		return this.getDefinedInstance(OperationType.AND, ops);
	}

	or(
		...ops:IStringOperation[]
	):IStringOperation {
		return this.getDefinedInstance(OperationType.OR, ops);
	}

	not(
		op:IStringOperation
	):IStringOperation {
		return this.getDefinedInstance(OperationType.NOT, op);
	}

}