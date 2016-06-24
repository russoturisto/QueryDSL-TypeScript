/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {JSONOperation, IOperation} from "../operation/Operation";
import {PH_JOIN_TO_ENTITY, PH_JOIN_TO_FIELD} from "../../query/PHQuery";

export enum FieldType {
	BOOLEAN,
	BOOLEAN_ARRAY,
	DATE,
	DATE_ARRAY,
	NUMBER,
	NUMBER_ARRAY,
	STRING,
	STRING_ARRAY
}

export interface IQBooleanField<IQ extends IQEntity> extends IQField<IQ> {

}

export class QBooleanField<IQ extends IQEntity> extends QField<IQ> implements IQBooleanField<IQ> {

	constructor(
		q:IQ,
		qConstructor:new() => IQ,
		entityName:string,
		fieldName:string,
		nativeFieldName:string = fieldName
	) {
		super(q, qConstructor, entityName, fieldName, nativeFieldName);
		this.fieldType = FieldType.BOOLEAN;
		q.addEntityField(this);
	}

}

export interface IQDateField<IQ extends IQEntity> extends IQField<IQ> {

}

export class QDateField<IQ extends IQEntity> extends QField<IQ> implements IQDateField<IQ> {

	constructor(
		q:IQ,
		qConstructor:new() => IQ,
		entityName:string,
		fieldName:string,
		nativeFieldName:string = fieldName
	) {
		super(q, qConstructor, entityName, fieldName, nativeFieldName);
		this.fieldType = FieldType.DATE;
		q.addEntityField(this);
	}

}

export interface IQNumberField<IQ extends IQEntity> extends IQField<IQ> {

}

export class QNumberField<IQ extends IQEntity> extends QField<IQ> implements IQNumberField<IQ> {

	constructor(
		q:IQ,
		qConstructor:new() => IQ,
		entityName:string,
		fieldName:string,
		nativeFieldName:string = fieldName
	) {
		super(q, qConstructor, entityName, fieldName, nativeFieldName);
		this.fieldType = FieldType.NUMBER;
		q.addEntityField(this);
	}
}

export interface IQStringField<IQ extends IQEntity> extends IQField<IQ> {

}

export class QStringField<IQ extends IQEntity> extends QField<IQ> implements IQStringField<IQ> {

	constructor(
		q:IQ,
		qConstructor:new() => IQ,
		entityName:string,
		fieldName:string,
		nativeFieldName:string = fieldName
	) {
		super(q, qConstructor, entityName, fieldName, nativeFieldName);
		this.fieldType = FieldType.STRING;
		q.addEntityField(this);
	}

}

export interface IQField<IQ extends IQEntity> {

	entityName:string;
	fieldName:string;
	fieldType:FieldType;
	nativeFieldName:string;
	q:IQ;
	qConstructor:new() => IQ;

	objectEquals<OP extends IOperation>(
		otherOp:OP,
		checkValue?:boolean
	):boolean;

	getQ():IQ;

	toJSON():JSONOperation;

}

export abstract class QField<IQ extends IQEntity> implements IQField<IQ> {

	fieldType:FieldType;

	constructor(
		public q:IQ,
		public qConstructor:new() => IQ,
		public entityName:string,
		public fieldName:string,
		public nativeFieldName:string = fieldName
	) {
		q.addEntityField(this);
	}

	toJSON():JSONOperation {
		let jsonOperation = {};
		jsonOperation[PH_JOIN_TO_ENTITY] = this.entityName;
		jsonOperation[PH_JOIN_TO_FIELD] = this.fieldName;

		return jsonOperation;
	}

	getQ():IQ {
		return this.q;
	}

	objectEquals<IQF extends IQField<any>>(
		otherField:IQF,
		checkValue?:boolean
	):boolean {

		if (this.q.constructor !== otherField.q.constructor) {
			return false;
		}
		if (this.constructor !== otherField.constructor) {
			return false;
		}
		if (this.fieldType !== otherField.fieldType) {
			return false;
		}
		if (this.fieldName !== otherField.fieldName) {
			return false;
		}

		return true;
	}

}