/**
 * Created by Papa on 4/21/2016.
 */
import {IQEntity} from "../entity/Entity";
import {IQField} from "../field/Field";
import {PHRawFieldSQLQuery, PHJsonFieldQSLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {JSONClauseField, JSONClauseObject} from "../field/Appliable";

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
	operator: string;
	category: OperationCategory;
}

export interface JSONRawValueOperation<IQF extends IQField<any, any, any, any, any>> extends JSONBaseOperation {
	lValue?: IQF;
	rValue?: any;
}

export interface IOperation<T, JO extends JSONBaseOperation> {
}

export interface IValueOperation<T, JRO extends JSONBaseOperation, IQ extends IQEntity, IQF extends IQField<any, T, JRO, any, any>> extends IOperation<T, JRO> {

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

export abstract class ValueOperation<T, JRO extends JSONRawValueOperation<IQF>, IQ extends IQEntity, IQF extends IQField<any, T, JRO, any, any>> extends Operation<T, JRO> implements IValueOperation<T, JRO, IQ, IQF> {

	constructor(
		public category: OperationCategory
	) {
		super(category);
	}

	equals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			operator: "$eq",
			category: this.category,
			rValue: value
		};
	}

	isNotNull(): JRO {
		return <any>{
			operator: "$isNotNull",
			category: this.category
		};
	}

	isNull(): JRO {
		return <any>{
			operator: "$isNull",
			category: this.category
		};
	}

	isIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO {
		return <any>{
			operator: "$in",
			category: this.category,
			rValue: values
		};
	}

	notEquals(
		value: T | IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			operator: "$ne",
			category: this.category,
			rValue: value
		};
	}

	notIn(
		values: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO {
		return <any>{
			operator: "$nin",
			category: this.category,
			rValue: values
		};
	}

}
