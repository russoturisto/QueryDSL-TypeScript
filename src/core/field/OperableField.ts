import {IQField, QField, FieldType} from "./Field";
import {JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation} from "../operation/Operation";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQEntity} from "../entity/Entity";
/**
 * Created by Papa on 10/25/2016.
 */

export interface IQOperableField<T, JO extends JSONBaseOperation, IO extends IOperation<T, JO>, IQF extends IQOperableField<T, JO, IO, any>>
extends IQField<IQF> {

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

export abstract class QOperableField<T, JO extends JSONRawValueOperation<T, IQF>, IO extends IValueOperation<T, JO, IQF>, IQF extends IQOperableField<T, JO, IO, IQF>>
extends QField<IQF> implements IQOperableField<T, JO, IO, IQF>  {

	constructor(
		// All child field constructors must have the following signature (4 parameters):
		childConstructor: new(
			...args:any[]
		) => IQOperableField<T, JO, IO, IQF>,
		q: IQEntity,
		qConstructor: new() => IQEntity,
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

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.equals(<any>this, value);
	}

	greaterThan(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.greaterThan(<any>this, value);
	}

	greaterThanOrEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.greaterThanOrEquals(<any>this, value);
	}

	isNotNull(): JO {
		return this.operation.isNotNull(<any>this);
	}

	isNull(): JO {
		return this.operation.isNull(<any>this);
	}

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO {
		return this.operation.isIn(<any>this, values);
	}

	lessThan(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.lessThan(<any>this, value);
	}

	lessThanOrEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.lessThanOrEquals(<any>this, value);
	}

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.notEquals(<any>this, value);
	}

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO {
		return this.operation.notIn(<any>this, values);
	}

}