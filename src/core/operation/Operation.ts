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
	rValue?: JSONClauseField | JSONClauseField[] | PHJsonFieldQSLQuery;
}

export interface JSONBaseOperation {
	category: OperationCategory;
	operator: string;
}

export interface JSONRawValueOperation<IQF extends IQOperableField<any, any, any, any>> extends JSONBaseOperation {
	lValue?: IQF;
	rValue?: IQF | IQF[] | PHRawFieldSQLQuery<IQF> | PHRawFieldSQLQuery<IQF>[];
}

export interface IOperation {
}

export interface IValueOperation<JRO extends JSONBaseOperation, IQF extends IQOperableField<any, JRO, any, any>> extends IOperation {

	category: OperationCategory;

	equals(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	greaterThan(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	greaterThanOrEquals(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	isIn(
		lValue: IQF,
		rValue: (IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO;

	lessThan(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	lessThanOrEquals(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	isNotNull( lValue: IQF ): JRO;

	isNull( lValue: IQF ): JRO;

	notEquals(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO;

	notIn(
		lValue: IQF,
		rValue: (IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO;


}

export abstract class Operation implements IOperation {

	constructor(
		public category: OperationCategory
	) {
	}

}

export abstract class ValueOperation<JRO extends JSONRawValueOperation<IQF>, IQF extends IQOperableField<any, JRO, any, any>> extends Operation implements IValueOperation<JRO, IQF> {

	constructor(
		public category: OperationCategory
	) {
		super(category);
	}

	equals(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$eq",
			rValue: rValue
		};
	}

	greaterThan(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "gt",
			rValue: rValue
		};
	}

	greaterThanOrEquals(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$gte",
			rValue: rValue
		};
	}

	isNotNull( lValue: IQF ): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$isNotNull"
		};
	}

	isNull(
		lValue: IQF
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$isNull"
		};
	}

	isIn(
		lValue: IQF,
		rValue: (IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$in",
			rValue: rValue
		};
	}

	lessThan(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$lt",
			rValue: rValue
		};
	}

	lessThanOrEquals(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$lte",
			rValue: rValue
		};
	}

	notEquals(
		lValue: IQF,
		rValue: IQF | PHRawFieldSQLQuery<IQF>
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$ne",
			rValue: lValue
		};
	}

	notIn(
		lValue: IQF,
		rValue: (IQF | PHRawFieldSQLQuery<IQF>)[]
	): JRO {
		return <any>{
			category: this.category,
			lValue: lValue,
			operation: "$nin",
			rValue: rValue
		};
	}

}
