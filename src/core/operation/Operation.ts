/**
 * Created by Papa on 4/21/2016.
 */
import {FieldType} from "../field/Field";
import {JSONClauseObject, Appliable} from "../field/Appliable";
import {IQEntity} from "../entity/Entity";
import {PHSQLQuery, PHRawSQLQuery, PHFlatSQLQuery, PHRawFlatSQLQuery} from "../../query/sql/PHSQLQuery";

export enum OperationCategory {
	BOOLEAN,
	DATE,
	LOGICAL,
	NUMBER,
	STRING
}

export interface JSONBaseOperation {
	operator: string;
	category: OperationCategory;
}

export interface JSONValueOperation<T> extends JSONBaseOperation {
	lValue:JSONClauseObject;
	rValue:JSONClauseObject | JSONClauseObject[] | T | T[];
}

export interface IOperation<T, JO extends JSONBaseOperation> {
}

export interface IValueOperation<T, JO extends JSONBaseOperation> extends IOperation<T, JO> {

	type: FieldType;

	equals<JCO extends JSONClauseObject, IQ extends IQEntity>(
		value: T | Appliable<JCO, IQ> | PHRawSQLQuery
	): JO;

	exists(
		exists: PHRawFlatSQLQuery
	): JO;

	isIn<JCO extends JSONClauseObject, IQ extends IQEntity>(
		values: (T | Appliable<JCO, IQ>)[]
	): JO;


	isNotNull(): JO;

	isNull(): JO;

	TODO: work here next
	notEquals(
		value: T | PHRawFlatSQLQuery
	): JO;

	notIn(
		values: T[]
	): JO;


}

export abstract class Operation<T, JO extends JSONBaseOperation> implements IOperation<T, JO> {

	constructor(
		public type: FieldType
	) {
	}

}

export abstract class ValueOperation<T, JO extends JSONValueOperation> extends Operation<T, JO> implements IValueOperation<T, JO> {

	constructor(
		public type: FieldType
	) {
		super(type);
	}

	equals(
		value: T
	): JO {
		return <any>{
			$eq: value
		};
	}

	exists(
		exists: boolean
	): JO {
		return <any>{
			$exists: exists
		};
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
		return <any>{
			$in: values
		};
	}

	notEquals(
		value: T
	): JO {
		return <any>{
			$ne: value
		};
	}

	notIn(
		values: T[]
	): JO {
		return <any>{
			$nin: values
		};
	}

}
