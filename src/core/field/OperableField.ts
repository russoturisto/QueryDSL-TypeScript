import {IQField, QField, FieldType} from "./Field";
import {IQEntity} from "../entity/Entity";
import {JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation} from "../operation/Operation";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {Appliable} from "./Appliable";
/**
 * Created by Papa on 10/25/2016.
 */


export interface IQOperableField<IQ extends IQEntity, T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>, IQF extends IQOperableField<IQ, T, JO, IO, any>>
extends IQField<IQ, IQF> {

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO;

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO;


	isNotNull(): JO;

	isNull(): JO;

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO;

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO;

}

export abstract class QOperableField<IQ extends IQEntity, T, JO extends JSONRawValueOperation<IQF>, IO extends IValueOperation<T, JO, IQ, IQF>, IQF extends IQOperableField<any, T, JO, IO, any>>
extends QField<IQ, IQF> implements IQOperableField<IQ, T, JO, IO, IQF>  {

	constructor(
		// All child field constructors must have the following signature (4 parameters):
		childConstructor: new(
			...args:any[]
		) => IQOperableField<IQ, T, JO, IO, IQF>,
		q: IQ,
		qConstructor: new() => IQ,
		entityName: string,
		fieldName: string,
		fieldType: FieldType,
		public operation: IO
	) {
		super(childConstructor, q, qConstructor, entityName, fieldName, fieldType);
		if (q) {
			q.addEntityField(fieldName, this);
		}
	}

	getInstance():any {
		return new this.childConstructor(this.q, this.qConstructor, this.entityName, this.fieldName, this.fieldType, this.operation);
	}

	setOperation(
		jsonOperation: JO
	): JO {
		jsonOperation.lValue = <any>this;

		return jsonOperation;
	}

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.setOperation(this.operation.equals(value));
	}


	isNotNull(): JO {
		return this.setOperation(this.operation.isNotNull());
	}

	isNull(): JO {
		return this.setOperation(this.operation.isNull());
	}

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO {
		return this.setOperation(this.operation.isIn(values));
	}

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.setOperation(this.operation.notEquals(value));
	}

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO {
		return this.setOperation(this.operation.notIn(values));
	}

}