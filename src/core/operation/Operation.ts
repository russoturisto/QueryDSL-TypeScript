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
	operation: string;
	category: OperationCategory;
}

export interface JSONRawValueOperation<T, IQF extends IQOperableField<any, any, any, any>> extends JSONBaseOperation {
	lValue?: T | IQF | PHRawFieldSQLQuery<IQF>;
	rValue?: T | IQF | PHRawFieldSQLQuery<IQF>;
}

export interface IOperation<T, JO extends JSONBaseOperation> {
}

export interface IValueOperation<T, JRO extends JSONBaseOperation, IQF extends IQOperableField<T, JRO, any, any>> extends IOperation<T, JRO> {

	category: OperationCategory;

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO;

	isNotNull(): JRO;

	isNull(): JRO;

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
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
		private category: OperationCategory,
	  private lValue: T | IQF | PHRawFieldSQLQuery<IQF>
	) {
		super(category);
	}

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return {
			category: this.category,
			lValue: this.lValue,
			operation: "$eq",
			rValue: value
		};
	}

	isNotNull(): JRO {
		return <any>{
			operation: "$isNotNull",
			category: this.category
		};
	}

	isNull(): JRO {
		return <any>{
			operation: "$isNull",
			category: this.category
		};
	}

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO {
		return <any>{
			operation: "$in",
			category: this.category,
			rValue: values
		};
	}

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			operation: "$ne",
			category: this.category,
			rValue: value
		};
	}

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO {
		return <any>{
			operation: "$nin",
			category: this.category,
			rValue: values
		};
	}

}
