import {IQField, QField} from "./Field";
import {JSONBaseOperation, IOperation, JSONRawValueOperation, IValueOperation} from "../operation/Operation";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQEntity} from "../entity/Entity";
import {bool, num, str, date} from "./Functions";
import {JSONClauseObjectType, SQLDataType} from "./Appliable";
/**
 * Created by Papa on 10/25/2016.
 */

export interface IQFunction<V extends boolean | Date | number | string | PHRawFieldSQLQuery<any>> {
	parameterAlias: string;
	value: V;
}

export interface IQOperableField<T, JO extends JSONBaseOperation, IO extends IOperation, IQF extends IQOperableField<T, JO, IO, any>>
extends IQField<IQF> {

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO;

	greaterThan(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	);

	greaterThanOrEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	);

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO;


	isNotNull(): JO;

	isNull(): JO;

	lessThan(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	);

	lessThanOrEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	);

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO;

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO;

}

export abstract class QOperableField<T, JO extends JSONRawValueOperation<IQF>, IO extends IValueOperation<JO, IQF>, IQF extends IQOperableField<T, JO, IO, IQF>>
extends QField<IQF> implements IQOperableField<T, JO, IO, IQF> {

	constructor(
		q: IQEntity,
		qConstructor: new() => IQEntity,
		entityName: string,
		fieldName: string,
		objectType: JSONClauseObjectType,
		dataType: SQLDataType,
		public operation: IO
	) {
		super(q, qConstructor, entityName, fieldName, objectType, dataType);
		if (q) {
			q.addEntityField(fieldName, this);
		}
	}

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.equals(<any>this, QOperableField.wrapPrimitive(value));
	}

	greaterThan(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.greaterThan(<any>this, QOperableField.wrapPrimitive(value));
	}

	greaterThanOrEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.greaterThanOrEquals(<any>this, QOperableField.wrapPrimitive(value));
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
		return this.operation.isIn(<any>this, QOperableField.wrapPrimitive(values));
	}

	lessThan(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.lessThan(<any>this, QOperableField.wrapPrimitive(value));
	}

	lessThanOrEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.lessThanOrEquals(<any>this, QOperableField.wrapPrimitive(value));
	}

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JO {
		return this.operation.notEquals(<any>this, QOperableField.wrapPrimitive(value));
	}

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JO {
		return this.operation.notIn(<any>this, QOperableField.wrapPrimitive(values));
	}

	static wrapPrimitive(
		value: any
	): any {
		switch (typeof value) {
			case "boolean":
				return bool(value);
			case "number":
				return num(value);
			case "string":
				return str(value);
			case "undefined":
				throw `Cannot use an 'undefined' value in an operation`;
		}
		if (value instanceof Date) {
			return date(value);
		}
		return value;
	}

}