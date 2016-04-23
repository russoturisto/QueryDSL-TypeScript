/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IOperation, Operation} from "./Operation";
import {OperationType} from "./OperationType";

export interface IComparisonOperation<T, Q extends IQEntity<Q>>
extends IOperation<Q> {

	equals(
		value:T | IComparisonOperation<T, Q>
	):IComparisonOperation<T, Q>;

}

export class ComparisonOperation<T, Q extends IQEntity<Q>> extends Operation<Q> implements IComparisonOperation<T, Q> {

	value:T;
	operationValue:ComparisonOperation<T, Q>;

	constructor(
		q:Q,
		fieldName:string,
		nativeFieldName:string = fieldName
	) {
		super(q, fieldName);
	}

	equals(
		value:T | IComparisonOperation<T, Q>
	):ComparisonOperation<T, Q> {
		this.type = OperationType.EQUALS;
		if (value instanceof ComparisonOperation) {
			this.operationValue = value;
		} else {
			this.value = <T>value;
		}

		return this;
	}

	valueEquals<OQ extends IQEntity<OQ>, OP extends Operation<Q>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {
		if (this.type !== otherOp.type) {
			return false;
		}

		let otherCOp:ComparisonOperation<T, OQ> = <any>otherOp;
		if (checkValue) {
			return this.value === otherCOp.value;
		}

		return true;
	}

}
