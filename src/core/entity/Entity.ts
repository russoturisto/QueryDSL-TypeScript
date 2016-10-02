/**
 * Created by Papa on 4/21/2016.
 */
import {IQField} from "../field/Field";
import {IQRelation, JSONRelation} from "./Relation";
import {JoinType} from "../../query/sql/PHSQLQuery";
import {JSONBaseOperation, IOperation} from "../operation/Operation";

/**
 * Marker interface for all query interfaces
 */
export interface IEntity {
	'*'?: null | undefined;
}

export interface IQEntity {

	__entityConstructor__: {new (): any};
	__entityFieldMap__: {[propertyName: string]: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>};
	__entityName__: string;
	__entityRelationMap__: {[propertyName: string]: IQRelation<IQEntity, any, IQEntity>};

	alias: string;
	parentEntityAlias: string;
	joinType: JoinType;

	addEntityRelation<IQR extends IQEntity, R>(
		propertyName: string,
		relation: IQRelation<IQR, R, IQEntity>
	): void;

	addEntityField<IQF extends IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>>(
		propertyName: string,
		field: IQF
	): void;

	fields(
		fields: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>[]
	): IQEntity;

	/*
	 joinOn<T, C extends IQField<IQ>>(
	 comparisonOp:IQField<IQ>
	 );
	 */

	getRelationJson(): JSONRelation;

}

export abstract class QEntity<IQ extends IQEntity> implements IQEntity {

	__entityFieldMap__: {[propertyName: string]: IQField<IQEntity, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>} = {};
	__entityRelationMap__: {[propertyName: string]: IQRelation<IQEntity, any, IQEntity>} = {};

	// rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);

	constructor(
		public __entityConstructor__: {new(): any},
		public __entityName__: string,
		public alias: string,
		public parentEntityAlias = null,
		public relationPropertyName = null,
		public joinType: JoinType = null
	) {
		// TODO: convert class name to native name if it's not provided
	}

	addEntityRelation<IQR extends IQEntity, R>(
		propertyName: string,
		relation: IQRelation<IQR, R, IQ>
	): void {
		this.__entityRelationMap__[propertyName] = relation;
	}

	addEntityField<T, IQF extends IQField<IQ, T, JSONBaseOperation, IOperation<T, JSONBaseOperation>>>(
		propertyName: string,
		field: IQF
	): void {
		this.__entityFieldMap__[propertyName] = field;
	}

	getRelationJson(): JSONRelation {
		return {
			alias: this.alias,
			entityName: this.__entityName__,
			joinType: this.joinType,
			parentEntityAlias: this.parentEntityAlias,
			relationPropertyName: this.relationPropertyName
		};
	}

	/*
	 addOperation<O extends IOperation<IQ>>(
	 op:O
	 ):void {
	 this.rootOperation.getChildOps().push(op);
	 }
	 */

	getQ(): IQ {
		return <any>this;
	}

	fields(
		fields: IQField<IQ, any, JSONBaseOperation, IOperation<any, JSONBaseOperation>>[]
	): IQ {
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
