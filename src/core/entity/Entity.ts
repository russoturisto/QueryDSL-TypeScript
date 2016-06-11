/**
 * Created by Papa on 4/21/2016.
 */
import {ILogicalOperation, LogicalOperation} from "../operation/LogicalOperation";
import {IOperation} from "../operation/Operation";
import {OperationType} from "../operation/OperationType";
import {IComparisonOperation} from "../operation/ComparisonOperation";
import {IQField} from "../field/Field";
import {IQRelation} from "./Relation";

export interface IQEntity<IQ extends IQEntity<IQ>> extends ILogicalOperation<IQ> {

	addEntityRelation<IQR extends IQEntity<IQR>, R>(
		relation:IQRelation<IQR, R, IQ>
	):void;

	addEntityField<T, IQF extends IComparisonOperation<T, IQ>>(
		field:IQF
	):void;

	entityConstructor:Function;

	fields(
		fields:IOperation<IQ>[]
	):IQ;

	joinOn<T, C extends IComparisonOperation<T, IQ>>(
		comparisonOp:IComparisonOperation<T, IQ>
	);

}

export class QEntity<IQ extends IQEntity<IQ>> implements IQEntity<IQ> {

	entityFields:IQField<any, IQ>[] = [];
	entityRelations:IQRelation<any, any, IQ>[] = [];

	rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);

	constructor(
		public entityConstructor:Function,
		private isTemplate = false,
		private nativeName?:string
	) {
		// TODO: convert class name to native name if it's not provided
	}

	addEntityRelation<IQR extends IQEntity<IQR>, R>(
		relation:IQRelation<IQR, R, IQ>
	):void {
		this.entityRelations.push(relation);
	}

	addEntityField<T, IQF extends IQField<T, IQ>>(
		field:IQF
	):void {
		this.entityFields.push(field);
	}

	addOperation<O extends IOperation<IQ>>(
		op:O
	):void {
		this.rootOperation.getChildOps().push(op);
	}

	getQ():IQ {
		return <any>this;
	}

	fields(
		fields:IOperation<IQ>[]
	):IQ {
		throw `Not implemented`;
	}

	joinOn<T, C extends IComparisonOperation<T, IQ>>(
		comparisonOp:IComparisonOperation<T, IQ>
	) {
		if (<any>comparisonOp.getQ() !== this) {
			throw `Must join on own field`;
		}
		throw `Not Implemented`;
	}

	and(
		...ops:IOperation<IQ>[]
	):IOperation<IQ> {
		return this.rootOperation.and.apply(this.rootOperation, ops);
	}

	or(
		...ops:IOperation<IQ>[]
	):IOperation<IQ> {
		return this.rootOperation.or.apply(this.rootOperation, ops);
	}

	not(
		op:IOperation<IQ>
	):IOperation<IQ> {
		return this.rootOperation.not(op);
	}

	objectEquals<OP extends IOperation<IQ>>(
		otherOp:OP,
		checkValues?:boolean
	):boolean {
		if (this.constructor !== otherOp.constructor) {
			return false;
		}
		let otherQ:QEntity<IQ> = <QEntity<IQ>><any>otherOp;
		return this.rootOperation.objectEquals(otherQ.rootOperation, checkValues);
	}

}
