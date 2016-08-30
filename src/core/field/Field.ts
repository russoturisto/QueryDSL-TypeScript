/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {JSONBaseOperation, IOperation} from "../operation/Operation";

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

export interface IQField<IQ extends IQEntity, T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>> {

	entityName: string;
	fieldName: string;
	fieldType: FieldType;
	operation: IO;
	q: IQ;
	qConstructor: new() => IQ;

	getFieldKey(): string;

	equals(
		value: T
	): JO;

	exists(
		exists: boolean
	): JO;

	isIn(
		values: T[]
	): JO;


	isNotNull(): JO;

	isNull(): JO;

	notEquals(
		value: T
	): JO;

	notIn(
		values: T[]
	): JO;


}

export abstract class QField<IQ extends IQEntity, T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>>
implements IQField<IQ, T, JO, IO> {

	constructor(
		public q: IQ,
		public qConstructor: new() => IQ,
		public entityName: string,
		public fieldName: string,
		public fieldType: FieldType,
		public operation: IO
	) {
		q.addEntityField(fieldName, this);
	}

	getFieldKey() {
		let key = `${this.q.alias}.${this.fieldName}`;

		return key;
	}

	setOperation(
		jsonOperation: JO
	): JO {
		let operation = <any>{};
		operation[this.getFieldKey()] = jsonOperation;

		return operation;
	}

	objectEquals<IQF extends IQField<any, any, JOE, IOE>, JOE extends JSONBaseOperation, IOE extends IOperation<any, JOE>>(
		otherField: IQF,
		checkValue?: boolean
	): boolean {

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

	equals(
		value: T
	): JO {
		return this.setOperation(this.operation.equals(value));
	}

	exists(
		exists: boolean
	): JO {
		return this.setOperation(this.operation.exists(exists));
	}

	isNotNull(): JO {
		return this.exists(false);
	}

	isNull(): JO {
		return this.exists(true);
	}

	isIn(
		values: T[]
	): JO {
		return this.setOperation(this.operation.isIn(values));
	}

	notEquals(
		value: T
	): JO {
		return this.setOperation(this.operation.notEquals(value));
	}

	notIn(
		values: T[]
	): JO {
		return this.setOperation(this.operation.notIn(values));
	}

}