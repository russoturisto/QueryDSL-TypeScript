/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {OperationType} from "./OperationType";

export interface IOperation<Q extends IQEntity<Q>> {

	objectEquals<OP extends IOperation<Q>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean;

	getQ():Q;

}

export abstract class Operation<Q extends IQEntity<Q>> implements IOperation<Q> {

	constructor(
		public q:Q,
		public fieldName?:string,
		public type?:OperationType,
		public nativeFieldName:string = fieldName
	) {
	}

	getQ():Q {
		return this.q;
	}

	objectEquals<OP extends Operation<Q>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {

		if (this.q.constructor !== otherOp.q.constructor) {
			return false;
		}
		if (this.constructor !== otherOp.constructor) {
			return false;
		}
		if (this.type !== otherOp.type) {
			return false;
		}
		if (this.fieldName !== otherOp.fieldName) {
			return false;
		}

		if (checkValue && !this.valueEquals(otherOp, checkValue)) {
			return false;
		}

		return true;
	}

	protected abstract valueEquals<OP extends Operation<Q>>(
		otherOp:OP,
		checkChildValues?:boolean
	):boolean;

}
