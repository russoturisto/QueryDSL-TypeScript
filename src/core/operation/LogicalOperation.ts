/**
 * Created by Papa on 4/21/2016.
 */
import {IOperation, Operation, JSONBaseOperation} from "./Operation";

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
