/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {PHRawFieldSQLQuery, PHJsonFieldQSLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {JSONClauseField, JSONClauseObject} from "../field/Appliable";
import {IQOperableField} from "../field/OperableField";

export enum OperationCategory {
	BOOLEAN,
	DATE,
	FUNCTION,
	LOGICAL,
	NUMBER,
	STRING
}

export interface JSONFunctionOperation extends JSONBaseOperation {
	object: JSONClauseObject;
}

export interface JSONValueOperation extends JSONBaseOperation {
	lValue: JSONClauseField;
	rValue?: boolean | boolean[] | Date | Date[] | number | number[] | string | string[] | JSONClauseField | JSONClauseField[] | PHJsonFieldQSLQuery;
}

export interface JSONBaseOperation {
	category: OperationCategory;
	operation: string;
}

export interface JSONRawValueOperation<T, IQF extends IQOperableField<any, any, any, any>> extends JSONBaseOperation {
	lValue?: T | IQF;
	rValue?: T | T[] | IQF | IQF[] | PHRawFieldSQLQuery<IQF> | PHRawFieldSQLQuery<IQF>[];
}

export interface IOperation<T, JO extends JSONBaseOperation> {
}

export interface IValueOperation<T, JRO extends JSONBaseOperation, IQF extends IQOperableField<T, JRO, any, any>> extends IOperation<T, JRO> {

	category: OperationCategory;

	equals(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	greaterThan(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	greaterThanOrEquals(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	isIn(
		lValue: T | IQF,
		rValue: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO;

	lessThan(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	lessThanOrEquals(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	isNotNull( lValue: T | IQF ): JRO;

	isNull( lValue: T | IQF ): JRO;

	notEquals(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	notIn(
		lValue: T | IQF,
		rValue: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO;


}

export abstract class Operation<T, JRO extends JSONBaseOperation> implements IOperation<T, JRO> {

	constructor(
		public category: OperationCategory
	) {
	}

}

export abstract class ValueOperation<T, JRO extends JSONRawValueOperation<T, IQF>, IQF extends IQOperableField<T, JRO, any, any>> extends Operation<T, JRO> implements IValueOperation<T, JRO, IQF> {

	constructor(
		public category: OperationCategory
	) {
		super(category);
	}

	equals(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$eq",
			rValue: rValue
		};
	}

	greaterThan(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "gt",
			rValue: rValue
		};
	}

	greaterThanOrEquals(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$gte",
			rValue: rValue
		};
	}

	isNotNull(lValue: T | IQF): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$isNotNull"
		};
	}

	isNull(
		lValue: T | IQF
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$isNull"
		};
	}

	isIn(
		lValue: T | IQF,
		rValue: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$in",
			rValue: rValue
		};
	}

	lessThan(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO{
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$lt",
			rValue: rValue
		};
	}

	lessThanOrEquals(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$lte",
			rValue: rValue
		};
	}

	notEquals(
		lValue: T | IQF,
		rValue: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$ne",
			rValue: lValue
		};
	}

	notIn(
		lValue: T | IQF,
		rValue: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$nin",
			rValue: rValue
		};
	}

}
