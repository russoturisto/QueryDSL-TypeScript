/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IOperation, Operation} from "./Operation";
import {OperationType} from "./OperationType";

export interface IComparisonOperation<T, Q extends IQEntity>
extends IOperation<Q> {

	equals(
		value:T | IComparisonOperation
	):IComparisonOperation<Q>;

}

export class ComparisonOperation<T, Q extends IQEntity> extends Operation<Q> implements IComparisonOperation<T, Q> {

	value:T;
	operationValue:ComparisonOperation;

	constructor(
		q:Q,
		fieldName:string,
		nativeFieldName:string = fieldName
	) {
		super(q, fieldName);
	}

	equals(
		value:T | IComparisonOperation
	):ComparisonOperation<T, Q> {
		this.type = OperationType.EQUALS;
		if (value instanceof ComparisonOperation) {
			this.operationValue = value;
		} else {
			this.value = value;
		}

		return this;
	}

	valueEquals<OP extends Operation<Q>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {
		if (this.type !== otherOp.type) {
			return false;
		}

		let otherCOp:ComparisonOperation = <ComparisonOperation>otherOp;
		if (checkValue) {
			return this.value === otherCOp.value;
		}

		return true;
	}

}
