/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IOperation, Operation} from "./Operation";
import {OperationType} from "./OperationType";

export function and<IQ extends IQEntity<IQ>>(
	...ops:IOperation<IQ>[]
):IOperation<IQ> {
	return LogicalOperation.addOperation(OperationType.AND, ops);
}

export function or<IQ extends IQEntity<IQ>>(
	...ops:IOperation<IQ>[]
):IOperation<IQ> {
	return LogicalOperation.addOperation(OperationType.OR, ops);
}

export function not<IQ extends IQEntity<IQ>>(
	op:IOperation<IQ>
):IOperation<IQ> {
	return LogicalOperation.addOperation(OperationType.NOT, [op]);
}

export interface ILogicalOperation<IQ extends IQEntity<IQ>>
extends IOperation<IQ> {

	and(
		...ops:IOperation<IQ>[]
	):IOperation<IQ>;

	or(
		...ops:IOperation<IQ>[]
	):IOperation<IQ>;

	not(
		op:IOperation<IQ>
	):IOperation<IQ>;

}

export class LogicalOperation<IQ extends IQEntity<IQ>>
extends Operation<IQ> {

	static verifyChildOps<IQ extends IQEntity<IQ>>(
		ops:IOperation<IQ>[]
	):void {
		if (!ops || !ops.length) {
			throw `No child operations provided`;
		}
	}

	static addOperation<IQ extends IQEntity<IQ>>(
		operationType:OperationType,
		ops:IOperation<IQ>[]
	):IOperation<IQ> {
		LogicalOperation.verifyChildOps(ops);

		let logicalOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(null, operationType, ops);

		return logicalOperation;
	}

	constructor(
		q:IQ,
		type?:OperationType,
		public childOps?:IOperation<IQ>[]
	) {
		super(q, null, null, null, type);
	}

	private verifyChildOps(
		ops:IOperation<IQ>[] = this.childOps
	):void {
		LogicalOperation.verifyChildOps(ops);
		ops.forEach((
			operation:IOperation<IQ>
		) => {
			if (this.q !== operation.getQ()) {
				throw `Query object does not match`;
			}
		})
	}

	private addOperation(
		operationType:OperationType,
		ops:IOperation<IQ>[]
	):IOperation<IQ> {
		this.verifyChildOps(ops);

		let logicalOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(this.q, operationType, ops);

		this.childOps.push(logicalOperation);

		return this;
	}

	and(
		...ops:IOperation<IQ>[]
	):IOperation<IQ> {
		return this.addOperation(OperationType.AND, ops);
	}

	or(
		...ops:IOperation<IQ>[]
	):IOperation<IQ> {
		return this.addOperation(OperationType.OR, ops);
	}

	not(
		op:IOperation<IQ>
	):IOperation<IQ> {
		return this.addOperation(OperationType.NOT, [op]);
	}

	getChildOps():IOperation<IQ>[] {
		return this.childOps;
	}


	objectEquals<OP extends Operation<IQ>>(
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

	protected valueEquals<OP extends Operation<IQ>>(
		otherOp:OP,
		checkChildValues?:boolean
	):boolean {
		let otherLOp:LogicalOperation<IQ> = <any> otherOp;
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
