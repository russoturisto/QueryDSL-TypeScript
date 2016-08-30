/**
 * Created by Papa on 4/21/2016.
 */
import {IOperation, Operation, JSONBaseOperation} from "./Operation";

export function and(
	...ops:JSONBaseOperation[]
):JSONLogicalOperation {
	return new LogicalOperation().and(ops);
}

export function or(
	...ops:JSONBaseOperation[]
):JSONLogicalOperation {
	return new LogicalOperation().or(ops);
}

export function not(
	op:JSONBaseOperation
):JSONLogicalOperation {
	return new LogicalOperation().not([op]);
}

export interface JSONLogicalOperation extends JSONBaseOperation {
	"$and"?:JSONBaseOperation[];
	"$not"?:JSONBaseOperation;
	"$or"?:JSONBaseOperation[];
}

export interface ILogicalOperation extends IOperation<any, JSONLogicalOperation> {

	and(
		...ops:JSONBaseOperation[]
	):JSONLogicalOperation;

	or(
		...ops:JSONBaseOperation[]
	):JSONLogicalOperation;

	not(
		op:JSONBaseOperation
	):JSONLogicalOperation;

}

export class LogicalOperation extends Operation<any, JSONLogicalOperation> implements ILogicalOperation {

	static verifyChildOps(
		ops:IOperation<any, JSONLogicalOperation>[]
	):void {
		if (!ops || !ops.length) {
			throw `No child operations provided`;
		}
	}

	constructor() {
		super(null);
	}

	and(
		...ops:JSONBaseOperation[]
	):JSONLogicalOperation {
		return {
			$and: ops
		};
	}

	or(
		...ops:JSONBaseOperation[]
	):JSONLogicalOperation {
		return {
			$or: ops
		};
	}

	not(
		op:JSONBaseOperation
	):JSONLogicalOperation {
		return {
			$not: op
		};
	}

}
