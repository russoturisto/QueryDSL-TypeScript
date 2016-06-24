/**
 * Created by Papa on 4/21/2016.
 */
import {IQField} from "../field/Field";
import {IQRelation} from "./Relation";

/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
	__operator__?:'$and' | '$or';
}

export interface IQEntity {

	__entityConstructor__:Function;
	__entityFields__:IQField<IQEntity>[];
	__entityRelations__:IQRelation<IQEntity, any, IQEntity>[];

	addEntityRelation<IQR extends IQEntity, R>(
		relation:IQRelation<IQR, R, IQEntity>
	):void;

	addEntityField<IQF extends IQField<IQEntity>>(
		field:IQF
	):void;

	fields(
		fields:IQField<IQEntity>[]
	):IQEntity;

	/*
	 joinOn<T, C extends IQField<IQ>>(
	 comparisonOp:IQField<IQ>
	 );
	 */

}

export abstract class QEntity<IQ extends IQEntity> implements IQEntity {

	__entityFields__:IQField<IQ>[] = [];
	__entityRelations__:IQRelation<any, any, IQ>[] = [];

	// rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);

	constructor(
		public __entityConstructor__:Function,
		public __entityName__:string,
		private __isTemplateEntity__ = false,
		private __nativeEntityName__?:string
	) {
		// TODO: convert class name to native name if it's not provided
	}

	addEntityRelation<IQR extends IQEntity, R>(
		relation:IQRelation<IQR, R, IQ>
	):void {
		this.__entityRelations__.push(relation);
	}

	addEntityField<T, IQF extends IQField<IQ>>(
		field:IQF
	):void {
		this.__entityFields__.push(field);
	}

	/*
	 addOperation<O extends IOperation<IQ>>(
	 op:O
	 ):void {
	 this.rootOperation.getChildOps().push(op);
	 }
	 */

	getQ():IQ {
		return <any>this;
	}

	fields(
		fields:IQField<IQ>[]
	):IQ {
		throw `Not implemented`;
	}

	/*
	 joinOn<T, C extends IQField<IQ>>(
	 comparisonOp:IQField<IQ>
	 ) {
	 throw `Not Implemented`;
	 }
	 */

	/*
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
	 */

	/*
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
	 */

	abstract toJSON();

}
