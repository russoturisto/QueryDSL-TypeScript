import {JSONFieldReference, IFieldOperation, FieldOperation} from "./FieldOperation";
import {IQDateField, FieldType} from "../field/Field";
import {OperationType} from "./OperationType";
import {JSONBaseOperation} from "./Operation";
/**
 * Created by Papa on 6/20/2016.
 */


export interface JSONDateOperation extends JSONBaseOperation {
	"$and"?:JSONDateOperation[];
	"$eq"?:Date | JSONFieldReference;
	"$exists"?:boolean;
	"$gt"?:Date | JSONFieldReference ;
	"$gte"?:Date | JSONFieldReference;
	"$in"?:Date[];
	"$lt"?:Date | JSONFieldReference;
	"$lte"?:Date | JSONFieldReference;
	"$ne"?:Date | JSONFieldReference;
	"$nin"?:Date[];
	"$not"?:JSONDateOperation;
	"$or"?:JSONDateOperation[];
}

export interface IDateOperation
extends IFieldOperation<Date> {

	equals(
		value:Date | IQDateField<any>
	):IDateOperation;

	exists(
		exists:boolean
	):IDateOperation;

	greaterThan(
		greaterThan:Date | IQDateField<any>
	):IDateOperation;

	greaterThanOrEquals(
		greaterThanOrEquals:Date | IQDateField<any>
	):IDateOperation;

	isIn(
		values:Date[]
	):IDateOperation;

	lessThan(
		lessThan:Date | IQDateField<any>
	):IDateOperation;

	lessThanOrEquals(
		lessThanOrEquals:Date | IQDateField<any>
	):IDateOperation;

	notEquals(
		value:Date | IQDateField<any>
	):IDateOperation;

	notIn(
		values:Date[]
	):IDateOperation;

	and(
		...ops:IDateOperation[]
	):IDateOperation;

	or(
		...ops:IDateOperation[]
	):IDateOperation;

	not(
		op:IDateOperation
	):IDateOperation;
}

export class DateOperation
extends FieldOperation<Date> implements IDateOperation {

	fieldType = FieldType.DATE;

	getDefinedInstance(
		type:OperationType,
		value:any
	):IDateOperation {
		let definedOperation = new DateOperation(type, this.fieldType);
		definedOperation.isDefined = true;
		definedOperation.value = value;

		return definedOperation;
	}

	equals(
		value:Date | IQDateField<any>
	):IDateOperation {
		return this.getDefinedInstance(OperationType.EQUALS, value);
	}

	exists(
		exists:boolean
	):IDateOperation {
		return this.getDefinedInstance(OperationType.EXISTS, exists);
	}

	greaterThan(
		greaterThan:Date | IQDateField<any>
	):IDateOperation {
		return this.getDefinedInstance(OperationType.GREATER_THAN, greaterThan);
	}

	greaterThanOrEquals(
		greaterThanOrEquals:Date | IQDateField<any>
	):IDateOperation {
		return this.getDefinedInstance(OperationType.GREATER_THAN_OR_EQUALS, greaterThanOrEquals);
	}

	isIn(
		values:Date[]
	):IDateOperation {
		return this.getDefinedInstance(OperationType.IN, values);
	}

	lessThan(
		lessThan:Date | IQDateField<any>
	):IDateOperation {
		return this.getDefinedInstance(OperationType.LESS_THAN, lessThan);
	}

	lessThanOrEquals(
		lessThanOrEquals:Date | IQDateField<any>
	):IDateOperation {
		return this.getDefinedInstance(OperationType.LESS_THAN_OR_EQUALS, lessThanOrEquals);
	}

	notEquals(
		value:Date | IQDateField<any>
	):IDateOperation {
		return this.getDefinedInstance(OperationType.NOT_EQUALS, value);
	}

	notIn(
		values:Date[]
	):IDateOperation {
		return this.getDefinedInstance(OperationType.NOT_IN, values);
	}

	and(
		...ops:IDateOperation[]
	):IDateOperation {
		return this.getDefinedInstance(OperationType.AND, ops);
	}

	or(
		...ops:IDateOperation[]
	):IDateOperation {
		return this.getDefinedInstance(OperationType.OR, ops);
	}

	not(
		op:IDateOperation
	):IDateOperation {
		return this.getDefinedInstance(OperationType.NOT, op);
	}

}