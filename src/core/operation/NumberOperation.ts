import {JSONFieldReference, IFieldOperation, FieldOperation} from "./FieldOperation";
import {IQNumberField, FieldType} from "../field/Field";
import {OperationType} from "./OperationType";
import {JSONOperation, JSONBaseOperation} from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONNumberOperation extends JSONBaseOperation {
	"$and"?:JSONNumberOperation[];
	"$eq"?:number | JSONFieldReference;
	"$exists"?:boolean;
	"$gt"?:number | JSONFieldReference ;
	"$gte"?:number | JSONFieldReference;
	"$in"?:number[];
	"$lt"?:number | JSONFieldReference;
	"$lte"?:number | JSONFieldReference;
	"$ne"?:number | JSONFieldReference;
	"$nin"?:number[];
	"$not"?:JSONNumberOperation;
	"$or"?:JSONNumberOperation[];
}

export interface INumberOperation extends IFieldOperation<number> {

	equals(
		value:number | IQNumberField<any>
	):INumberOperation;

	exists(
		exists:boolean
	):INumberOperation;

	greaterThan(
		greaterThan:number | IQNumberField<any>
	):INumberOperation;

	greaterThanOrEquals(
		greaterThanOrEquals:number | IQNumberField<any>
	):INumberOperation;

	isIn(
		values:number[]
	):INumberOperation;

	lessThan(
		lessThan:number | IQNumberField<any>
	):INumberOperation;

	lessThanOrEquals(
		lessThanOrEquals:number | IQNumberField<any>
	):INumberOperation;

	notEquals(
		value:number | IQNumberField<any>
	):INumberOperation;

	notIn(
		values:number[]
	):INumberOperation;

	and(
		...ops:INumberOperation[]
	):INumberOperation;

	or(
		...ops:INumberOperation[]
	):INumberOperation;

	not(
		op:INumberOperation
	):INumberOperation;
}

export class NumberOperation extends FieldOperation<number> implements INumberOperation {

	constructor(
		type:OperationType
	) {
		super(type, FieldType.NUMBER);
	}

	getDefinedInstance(
		type:OperationType,
		value:any
	):INumberOperation {
		let definedOperation = new NumberOperation(type);
		definedOperation.isDefined = true;
		definedOperation.value = value;

		return definedOperation;
	}

	equals(
		value:number | IQNumberField<any>
	):INumberOperation {
		return this.getDefinedInstance(OperationType.EQUALS, value);
	}

	exists(
		exists:boolean
	):INumberOperation {
		return this.getDefinedInstance(OperationType.EXISTS, exists);
	}

	greaterThan(
		greaterThan:number | IQNumberField<any>
	):INumberOperation {
		return this.getDefinedInstance(OperationType.GREATER_THAN, greaterThan);
	}

	greaterThanOrEquals(
		greaterThanOrEquals:number | IQNumberField<any>
	):INumberOperation {
		return this.getDefinedInstance(OperationType.GREATER_THAN_OR_EQUALS, greaterThanOrEquals);
	}

	isIn(
		values:number[]
	):INumberOperation {
		return this.getDefinedInstance(OperationType.IN, values);
	}

	lessThan(
		lessThan:number | IQNumberField<any>
	):INumberOperation {
		return this.getDefinedInstance(OperationType.LESS_THAN, lessThan);
	}

	lessThanOrEquals(
		lessThanOrEquals:number | IQNumberField<any>
	):INumberOperation {
		return this.getDefinedInstance(OperationType.LESS_THAN_OR_EQUALS, lessThanOrEquals);
	}

	notEquals(
		value:number | IQNumberField<any>
	):INumberOperation {
		return this.getDefinedInstance(OperationType.NOT_EQUALS, value);
	}

	notIn(
		values:number[]
	):INumberOperation {
		return this.getDefinedInstance(OperationType.NOT_IN, values);
	}

	and(
		...ops:INumberOperation[]
	):INumberOperation {
		return this.getDefinedInstance(OperationType.AND, ops);
	}

	or(
		...ops:INumberOperation[]
	):INumberOperation {
		return this.getDefinedInstance(OperationType.OR, ops);
	}

	not(
		op:INumberOperation
	):INumberOperation {
		return this.getDefinedInstance(OperationType.NOT, op);
	}

}