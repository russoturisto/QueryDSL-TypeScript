/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IOperation, Operation} from "./Operation";
import {OperationType} from "./OperationType";

export interface ILogicalOperation<Q extends IQEntity>
extends IOperation<Q> {

	and(
		...ops:IOperation<Q>[]
	):IOperation<Q>;

	or(
		...ops:IOperation<Q>[]
	):IOperation<Q>;

	not(
		op:IOperation<Q>
	):IOperation<Q>;

}

export class LogicalOperation<Q extends IQEntity>
extends Operation<Q> {

	constructor(
		q:Q,
		type?:OperationType,
		public childOps?:IOperation<Q>[]
	) {
		super(q, null, type);
	}

	private verifyChildOps(
		ops:IOperation<Q>[] = this.childOps
	):void {
		if (!ops || !ops.length) {
			throw `No child operations provided`;
		}
		ops.forEach((
			operation:IOperation<Q>
		) => {
			if (this.q !== operation.getQ()) {
				throw `Query object does not match`;
			}
		})
	}

	private addOperation(
		operationType:OperationType,
		ops:IOperation<Q>[]
	):IOperation<Q> {
		this.verifyChildOps(ops);

		let andOperation:LogicalOperation<Q> = new LogicalOperation<Q>(this.q, operationType, ops);

		this.childOps.push(andOperation);

		return this;
	}

	and(
		...ops:IOperation<Q>[]
	):IOperation<Q> {
		return this.addOperation(OperationType.AND, ops);
	}

	or(
		...ops:IOperation<Q>[]
	):IOperation<Q> {
		return this.addOperation(OperationType.OR, ops);
	}

	not(
		op:IOperation<Q>
	):IOperation<Q> {
		return this.addOperation(OperationType.OR, [op]);
	}

	getChildOps():IOperation<Q>[] {
		return this.childOps;
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

		if (!this.valueEquals(otherOp, checkValue)) {
			return false;
		}

		return true;
	}

	protected valueEquals<OP extends Operation<Q>>(
		otherOp:OP,
		checkChildValues?:boolean
	):boolean {
		let otherLOp:LogicalOperation<Q> = <any> otherOp;
		this.verifyChildOps();
		otherLOp.verifyChildOps();
		if (this.childOps.length !== otherLOp.childOps.length) {
			return false;
		}
		for (let i = 0; i < this.childOps.length; i++) {
			let ownChildOp = this.childOps[i];
			let otherChildOp = otherLOp.childOps[i];
			if (!ownChildOp.objectEquals(otherChildOp, checkChildValues)) {
				return false;
			}
		}
		return true;
	}

}
