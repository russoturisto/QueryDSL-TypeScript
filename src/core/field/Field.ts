/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {JSONBaseOperation} from "../operation/Operation";

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

export interface IQField<IQ extends IQEntity> {

	entityName:string;
	fieldName:string;
	fieldType:FieldType;
	nativeFieldName:string;
	q:IQ;
	qConstructor:new() => IQ;

	getFieldKey():string;

}

export abstract class QField<IQ extends IQEntity> implements IQField<IQ> {

	constructor(
		public q:IQ,
		public qConstructor:new() => IQ,
		public entityName:string,
		public fieldName:string,
		public fieldType:FieldType,
		public nativeFieldName:string = fieldName
	) {
		q.addEntityField(this);
	}

	getFieldKey() {
		let key = `${this.entityName}.${this.fieldName}`;

		return key;
	}

	setOperation(
		jsonOperation:JSONBaseOperation
	):JSONBaseOperation {
		let operation = {};
		operation[this.getFieldKey()] = jsonOperation;

		return operation;
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