/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {OperationType} from "./OperationType";
import {QueryFragment} from "../QueryFragment";
import {FieldType} from "../field/Field";

export interface IOperation<IQ extends IQEntity<IQ>> {

	objectEquals<OP extends IOperation<IQ>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean;

	getQ():IQ;

}

export abstract class Operation<IQ extends IQEntity<IQ>> extends QueryFragment implements IOperation<IQ> {

	constructor(
		public q:IQ,
		public fieldType?:FieldType,
		public fieldName?:string,
		public nativeFieldName:string = fieldName,
		public type?:OperationType
	) {
		super();
	}

	getQ():IQ {
		return this.q;
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
		if (this.fieldName !== otherOp.fieldName) {
			return false;
		}

		if (checkValue && !this.valueEquals(otherOp, checkValue)) {
			return false;
		}

		return true;
	}

	protected abstract valueEquals<OP extends Operation<IQ>>(
		otherOp:OP,
		checkChildValues?:boolean
	):boolean;

}
