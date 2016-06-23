/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IOperation, Operation, JSONOperation} from "./Operation";
import {OperationType} from "./OperationType";
import {FieldType, IQField} from "../field/Field";

export function equals(
	value:boolean | Date | number | string | IQField<any>
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.EQUALS, value);
}

export function exists(
	exists:boolean
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.EXISTS, exists);
}

export function greaterThan(
	greaterThan:Date | number | IQField<any>
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.GREATER_THAN, greaterThan);
}

export function greaterThanOrEquals(
	greaterThanOrEquals:Date | number | IQField<any>
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.GREATER_THAN_OR_EQUALS, greaterThanOrEquals);
}

export function isIn(
	values:boolean[] | Date[] | number[] | string[]
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.IN, values);
}

export function like(
	like:string | RegExp
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.LIKE, like);
}

export function lessThan(
	lessThan:Date | number | IQField<any>
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.LESS_THAN, lessThan);
}

export function lessThanOrEquals(
	lessThanOrEquals:Date | number | IQField<any>
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.LESS_THAN_OR_EQUALS, lessThanOrEquals);
}

export function notEquals(
	value:boolean | number | string | IQField<any>
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.NOT_EQUALS, value);
}

export function notIn(
	values:boolean[] | Date[] | number [] | string[]
):IQueryOperation {
	return QueryOperation.getDefinedInstance(OperationType.NOT_IN, values);
}

export interface IQueryOperation extends IOperation {

}

export class QueryOperation
extends Operation {

	static getDefinedInstance(
		type:OperationType,
		value:any
	):IQueryOperation {
		let definedOperation = new QueryOperation(type);
		definedOperation.isDefined = true;
		definedOperation.value = value;

		return definedOperation;
	}

	isDefined:boolean;
	value:any;

	constructor(
		type:OperationType
	) {
		super(type);
	}

	valueEquals(
		otherOp:IOperation,
		checkValue?:boolean
	):boolean {
		if (this.type !== otherOp.type) {
			return false;
		}

		let otherCOp:QueryOperation = <any>otherOp;

		if (this.value !== otherCOp.value) {
			return false;
		}

		return true;
	}

	toJSON():JSONOperation {
		let operator = {};
		let operation:string;
		switch (this.type) {
			case OperationType.EQUALS:
				operation = "$eq";
				break;
			case OperationType.EXISTS:
				operation = "$exists";
				break;
			case OperationType.GREATER_THAN:
				operation = "$gt";
				break;
			case OperationType.GREATER_THAN_OR_EQUALS:
				operation = "$gte";
				break;
			case OperationType.IN:
				operation = "$in";
				break;
			case OperationType.LESS_THAN:
				operation = "$lt";
				break;
			case OperationType.LESS_THAN_OR_EQUALS:
				operation = "$lte";
				break;
			case OperationType.LIKE:
				operation = "$like";
				break;
			case OperationType.NOT_EQUALS:
				operation = "$ne";
				break;
			case OperationType.NOT_IN:
				operation = "$nin";
				break;
			case OperationType.AND:
				operation = "$and";
				break;
			case OperationType.NOT:
				operation = "$not";
				break;
			case OperationType.OR:
				operation = "$or";
				break;
		}

		let jsonValue = this.value;
		if(this.value instanceof Array) {
			jsonValue = this.value.map((
				aValue
			) => {
				let aJsonValue = aValue;
				if(aValue instanceof QueryOperation) {
					aJsonValue = (<QueryOperation>aValue).toJSON();
				}

				return aJsonValue;
			});
		} else if(this.value instanceof QueryOperation) {
			jsonValue = (<QueryOperation>this.value).toJSON();
		}
		operator[operation] = jsonValue;

		return operator;
	}

}
