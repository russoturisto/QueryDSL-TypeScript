/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IOperation, Operation} from "./Operation";
import {OperationType} from "./OperationType";

export function and(
	...ops:IOperation[]
):ILogicalOperation {
	return LogicalOperation.addOperation(OperationType.AND, ops);
}

export function or(
	...ops:IOperation[]
):ILogicalOperation {
	return LogicalOperation.addOperation(OperationType.OR, ops);
}

export function not(
	op:IOperation
):ILogicalOperation {
	return LogicalOperation.addOperation(OperationType.NOT, [op]);
}

export interface ILogicalOperation extends IOperation {

	and(
		...ops:IOperation[]
	):IOperation;

	or(
		...ops:IOperation[]
	):IOperation;

	not(
		op:IOperation
	):IOperation;

}

export class LogicalOperation extends Operation implements ILogicalOperation {

	static verifyChildOps(
		ops:IOperation[]
	):void {
		if (!ops || !ops.length) {
			throw `No child operations provided`;
		}
	}

	static addOperation(
		operationType:OperationType,
		ops:IOperation[]
	):ILogicalOperation {
		LogicalOperation.verifyChildOps(ops);

		let logicalOperation:LogicalOperation = new LogicalOperation(operationType, ops);

		return logicalOperation;
	}

	constructor(
		type?:OperationType,
		public childOps?:IOperation[]
	) {
		super(type);
	}

	private verifyChildOps(
		ops:IOperation[] = this.childOps
	):void {
		LogicalOperation.verifyChildOps(ops);
		ops.forEach((
			operation:IOperation
		) => {
			// TODO: additional validation, if any
		});
	}

	protected addOperation(
		operationType:OperationType,
		ops:IOperation[]
	):IOperation {
		this.verifyChildOps(ops);

		let logicalOperation:LogicalOperation = new LogicalOperation(operationType, ops);

		this.childOps.push(logicalOperation);

		return this;
	}

	and(
		...ops:IOperation[]
	):IOperation {
		return this.addOperation(OperationType.AND, ops);
	}

	or(
		...ops:IOperation[]
	):IOperation {
		return this.addOperation(OperationType.OR, ops);
	}

	not(
		op:IOperation
	):IOperation {
		return this.addOperation(OperationType.NOT, [op]);
	}

	getChildOps():IOperation[] {
		return this.childOps;
	}


	objectEquals<OP extends Operation>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {
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

	toJSON():any {
		let jsonOperation = {};
		let operator:string;
		switch (this.type) {
			case OperationType.AND:
				operator = '&and';
				break;
			case OperationType.NOT:
				operator = '&not';
				break;
			case OperationType.OR:
				operator = '&or';
				break;
			default:
				throw `Not Implemented`;
		}
		let childJsonOps = this.childOps.map((
			childOp:IOperation
		) => {
			return childOp.toJSON();
		});
		jsonOperation[operator] = childJsonOps;

		return jsonOperation;
	}

	protected valueEquals<OP extends Operation>(
		otherOp:OP,
		checkChildValues?:boolean
	):boolean {
		let otherLOp:LogicalOperation = <any> otherOp;
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
