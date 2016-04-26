/**
 * Created by Papa on 4/21/2016.
 */
import {ILogicalOperation, LogicalOperation} from "../operation/LogicalOperation";
import {IOperation} from "../operation/Operation";
import {OperationType} from "../operation/OperationType";
import {IComparisonOperation} from "../operation/ComparisonOperation";
import {IQRelation, QRelation} from "./Relation";

export interface IQEntity<Q extends IQEntity<Q>> extends ILogicalOperation<Q> {

	fields(
		fields:IOperation<Q>[]
	):Q;

	joinOn<T, C extends IComparisonOperation<T, Q>>(
		comparisonOp:IComparisonOperation<T, Q>
	);

	addOneRelation<OQ extends IQEntity<OQ>>(
		otherEntity:OQ,
		foreignKeyProperty:string
	);

	addManyRelation<OQ extends IQEntity<OQ>>(
		otherEntity:OQ
	);

}

export class QEntity<Q extends QEntity<Q>> implements IQEntity<Q> {

	relations:IQRelation<any>[] = [];

	rootOperation:LogicalOperation<Q> = new LogicalOperation<Q>(<any>this, OperationType.AND, []);

	constructor(
		private nativeName?:string
	) {
		// TODO: convert class name to native name if it's not provided
	}

	addOneRelation<OQ extends IQEntity<OQ>>(
		otherEntity:OQ,
		foreignKeyProperty:string
	) {
		let relation = new QRelation(otherEntity, foreignKeyProperty);
		this.relations.push(relation);
	}

	addManyRelation<OQ extends IQEntity<OQ>>(
		otherEntity:OQ
	) {
		let relation = new QRelation(otherEntity);
		this.relations.push(relation);
	}

	addOperation<O extends IOperation<Q>>(
		op:O
	):void {
		this.rootOperation.getChildOps().push(op);
	}

	getQ():Q {
		return <any>this;
	}

	fields(
		fields:IOperation<Q>[]
	):Q {
		throw `Not implemented`;
	}

	joinOn<T, C extends IComparisonOperation<T, Q>>(
		comparisonOp:IComparisonOperation<T, Q>
	) {
		if (<any>comparisonOp.getQ() !== this) {
			throw `Must join on own field`;
		}
		throw `Not Implemented`;
	}

	and(
		...ops:IOperation<Q>[]
	):IOperation<Q> {
		return this.rootOperation.and.apply(this.rootOperation, ops);
	}

	or(
		...ops:IOperation<Q>[]
	):IOperation<Q> {
		return this.rootOperation.or.apply(this.rootOperation, ops);
	}

	not(
		op:IOperation<Q>
	):IOperation<Q> {
		return this.rootOperation.not(op);
	}

	objectEquals<OP extends IOperation<Q>>(
		otherOp:OP,
		checkValues?:boolean
	):boolean {
		if (this.constructor !== otherOp.constructor) {
			return false;
		}
		let otherQ:Q = <Q><any>otherOp;
		return this.rootOperation.objectEquals(otherQ.rootOperation, checkValues);
	}

}
