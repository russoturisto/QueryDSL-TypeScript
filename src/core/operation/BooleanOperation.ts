import {IFieldOperation, JSONFieldReference, FieldOperation} from "./FieldOperation";
import {IQBooleanField, FieldType} from "../field/Field";
import {OperationType} from "./OperationType";
import {JSONBaseOperation} from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */

export interface JSONBooleanOperation extends JSONBaseOperation {
	"$and"?:JSONBooleanOperation[];
	"$eq"?:boolean | JSONFieldReference;
	"$exists"?:boolean;
	"$ne"?:boolean | JSONFieldReference;
	"$not"?:JSONBooleanOperation;
	"$or"?:JSONBooleanOperation[];
}

export interface IBooleanOperation
extends IFieldOperation<Date> {

	equals(
		value:boolean | IQBooleanField<any>
	):IBooleanOperation;

	exists(
		exists:boolean
	):IBooleanOperation;

	notEquals(
		value:boolean | IQBooleanField<any>
	):IBooleanOperation;

	and(
		...ops:IBooleanOperation[]
	):IBooleanOperation;

	or(
		...ops:IBooleanOperation[]
	):IBooleanOperation;

	not(
		op:IBooleanOperation
	):IBooleanOperation;
}

export class BooleanOperation
extends FieldOperation<boolean> implements IBooleanOperation {

	constructor(
		type:OperationType
	) {
		super(type, FieldType.BOOLEAN);
	}

	getDefinedInstance(
		type:OperationType,
		value:any
	):IBooleanOperation {
		let definedOperation = new BooleanOperation(type);
		definedOperation.isDefined = true;
		definedOperation.value = value;

		return definedOperation;
	}

	equals(
		value:boolean | IQBooleanField<any>
	):IBooleanOperation {
		return this.getDefinedInstance(OperationType.EQUALS, value);
	}

	exists(
		exists:boolean
	):IBooleanOperation {
		return this.getDefinedInstance(OperationType.EXISTS, exists);
	}

	notEquals(
		value:boolean | IQBooleanField<any>
	):IBooleanOperation {
		return this.getDefinedInstance(OperationType.NOT_EQUALS, value);
	}

	and(
		...ops:IBooleanOperation[]
	):IBooleanOperation {
		return this.getDefinedInstance(OperationType.AND, ops);
	}

	or(
		...ops:IBooleanOperation[]
	):IBooleanOperation {
		return this.getDefinedInstance(OperationType.OR, ops);
	}

	not(
		op:IBooleanOperation
	):IBooleanOperation {
		return this.getDefinedInstance(OperationType.NOT, op);
	}

}