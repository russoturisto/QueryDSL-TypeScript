import {IQStringField, QStringFunction, QStringField} from "./StringField";
import {Appliable, JSONClauseObjectType, JSONClauseObject, JSONClauseField} from "./Appliable";
import {IQEntity} from "../entity/Entity";
import {QNumberFunction, IQNumberField, QNumberField} from "./NumberField";
import {QDateFunction, IQDateField, QDateField} from "./DateField";
import {JSONBaseOperation, OperationCategory, JSONFunctionOperation} from "../operation/Operation";
import {PHRawNonEntitySQLQuery} from "../../query/sql/query/ph/PHNonEntitySQLQuery";
import {QOperableField, IQOperableField} from "./OperableField";
import {IQBooleanField, QBooleanFunction, QBooleanField} from "./BooleanField";
import {PHRawMappedSQLQuery, PHJsonMappedQSLQuery, IMappedEntity} from "../../query/sql/query/ph/PHMappedSQLQuery";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 10/18/2016.
 */

export interface JSONSqlFunctionCall {
	functionType: SqlFunction,
	parameters: any[];
}

/**
 * Extrated from http://www.w3schools.com/sql/sql_functions.asp
 */
export enum SqlFunction {
	// SQL Aggregate Functions
	// SQL aggregate functions return a single value, calculated from values in a column.
	// Useful Aggregate functions:
	ABS, // Returns absolute value of a number
	AVG, // Returns the average value
	COUNT, // Returns the number of rows
		//FIRST, // not in SqLite: Returns the first value
		//LAST, // not in SqLite: Returns the last value
	MAX, // Returns the largest value
	MIN, // Returns the smallest value
	SUM, // Returns the sum

		//SQL Scalar functions
		//SQL scalar functions return a single value, based on the input value.
		// Useful scalar functions:
	UCASE, // Converts a field to upper case
	LCASE, // Converts a field to lower case
	MID, // Extract characters from a text field
	LEN, // Returns the length of a text field
	ROUND, // Rounds a numeric field to the number of decimals specified
	NOW, // Returns the current system date and time
	FORMAT, // Formats how a field is to be displayed
		// Added
	REPLACE, // REPLACE(X, Y, Z) in string X, replace Y with Z
	TRIM, // Trims a string
		// Other
	DISTINCT, // Used for select clauses
	EXISTS // used in where clauses
}

function getSqlFunctionCall(
	sqlFunction: SqlFunction,
	parameters?: any[]
) {
	if (parameters) {
		parameters = parameters.map(( parameter ) => {
			switch (typeof parameter) {
				case "boolean":
					return bool(parameter);
				case "number":
					return num(parameter);
				case "string":
					return str(parameter);
				case "undefined":
					throw `'undefined' cannot be used as a function parameter`;
			}
			if (parameter instanceof Date) {
				return date(parameter);
			}
			return parameter;
		});
	}
	return {
		functionType: sqlFunction,
		parameters: parameters
	};
}

export function abs(
	numeric: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>
): IQNumberField {
	if (numeric instanceof QNumberField) {
		return numeric.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
	} else {
		return new QNumberFunction(<any>numeric).applySqlFunction(getSqlFunctionCall(SqlFunction.ABS));
	}
}

export function avg(
	numeric: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>
): IQNumberField {
	if (numeric instanceof QNumberField) {
		return numeric.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
	} else {
		return new QNumberFunction(<any>numeric).applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
	}
}

export function getFunctionObject<T extends boolean | Date | number | string>(
	value: T | PHRawFieldSQLQuery<any>
): QOperableField<T, any, any, any> {
	switch (typeof value) {
		case 'boolean':
			return new QBooleanFunction(<any>value);
		case 'number':
			return new QNumberFunction(<any>value);
		case 'string':
			return new QStringFunction(<any>value);
	}
	if (value instanceof Date) {
		return new QDateFunction(<any>value);
	}
	let selectClause = (<PHRawFieldSQLQuery<any>>value).select;
	if (selectClause instanceof QDistinctFunction) {
		selectClause = selectClause.getSelectClause();
	}
	if (selectClause instanceof QBooleanField) {
		return new QBooleanFunction(<any>value);
	} else if (selectClause instanceof QDateField) {
		return new QDateFunction(<any>value);
	} else if (selectClause instanceof QNumberField) {
		return new QNumberFunction(<any>value);
	} else if (selectClause instanceof QStringField) {
		return new QStringFunction(<any>value);
	}
	throw `Function rValue must be a primitive, Date, Field or Field query`;
}

export function count<T extends boolean | Date | number | string, IQF extends IQOperableField<T, any, any, any>>(
	value: IQF | T | PHRawFieldSQLQuery<IQF>
): IQF {
	if (value instanceof QOperableField) {
		return value.applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
	} else {
		return getFunctionObject(<any>value).applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
	}
}

export function max<T extends boolean | Date | number | string, IQF extends IQOperableField<T, any, any, any>>(
	value: IQF | T | PHRawFieldSQLQuery<IQF>
): IQF {
	if (value instanceof QOperableField) {
		return value.applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
	} else {
		return getFunctionObject(<any>value).applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
	}
}

export function min<T extends boolean | Date | number | string, IQF extends IQOperableField<T, any, any, any>>(
	value: IQF | T | PHRawFieldSQLQuery<IQF>
): IQF {
	if (value instanceof QOperableField) {
		return value.applySqlFunction(getSqlFunctionCall(SqlFunction.MIN));
	} else {
		return getFunctionObject(<any>value).applySqlFunction(getSqlFunctionCall(SqlFunction.MIN));
	}
}

export function sum(
	numeric: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>
): IQNumberField {
	if (numeric instanceof QNumberField) {
		return numeric.applySqlFunction(getSqlFunctionCall(SqlFunction.SUM));
	} else {
		return new QNumberFunction(<any>numeric).applySqlFunction(getSqlFunctionCall(SqlFunction.SUM));
	}
}

export function ucase(
	stringValue: IQStringField | string | PHRawFieldSQLQuery<IQStringField>
): IQStringField {
	if (stringValue instanceof QStringField) {
		return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
	} else {
		return new QStringFunction(<any>stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
	}
}

export function lcase(
	stringValue: IQStringField | string | PHRawFieldSQLQuery<any>
): IQStringField {
	if (stringValue instanceof QStringField) {
		return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
	} else {
		return <any>new QStringFunction(<any>stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
	}
}

export function mid(
	stringValue: IQStringField | string | PHRawFieldSQLQuery<IQStringField>,
	start: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>,
	length: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>
): IQStringField {
	if (stringValue instanceof QStringField) {
		return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.MID, [start, length]));
	} else {
		return new QStringFunction(<any>stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.MID, [start, length]));
	}
}

export function len(
	stringValue: IQStringField | string | PHRawFieldSQLQuery<IQStringField>
): IQStringField {
	if (stringValue instanceof QStringField) {
		return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
	} else {
		return new QStringFunction(<any>stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
	}
}

export function round(
	numeric: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField>,
	digits: IQNumberField | number | PHRawFieldSQLQuery<IQNumberField> = 0
): IQNumberField {
	if (numeric instanceof QNumberField) {
		return numeric.applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, [digits]));
	} else {
		return new QNumberFunction(<any>numeric).applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, [digits]));
	}
}

export function now(): IQDateField {
	return new QDateFunction(null).applySqlFunction(getSqlFunctionCall(SqlFunction.NOW));
}

export function format<T extends boolean | Date | number | string, IQF extends IQOperableField<T, any, any, IQF>>(
	format: string | IQStringField | PHRawFieldSQLQuery<IQF>,
	...formatParameters: (T | IQF | PHRawFieldSQLQuery<IQF>)[]
): IQStringField {
	if (format instanceof QStringField) {
		return format.applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, formatParameters));
	} else {
		return new QStringFunction(<any>format).applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, formatParameters));
	}
}

export function replace(
	stringValue: IQStringField | string | PHRawFieldSQLQuery<IQStringField>,
	toReplace: IQStringField | string | PHRawFieldSQLQuery<IQStringField>,
	replaceWith: IQStringField | string | PHRawFieldSQLQuery<IQStringField>
): IQStringField {
	if (stringValue instanceof QStringField) {
		return stringValue.applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, [toReplace, replaceWith]));
	} else {
		return new QStringFunction(<any>stringValue).applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, [toReplace, replaceWith]));
	}
}

export function trim(
	stringField: IQStringField | string | PHRawFieldSQLQuery<any>
): IQStringField {
	if (stringField instanceof QStringField) {
		return stringField.applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
	} else {
		return new QStringFunction(<any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
	}
}

export abstract class StandAloneFunction {

}

export function distinct<ISelect>(
	selectClause: ISelect
): IQDistinctFunction<ISelect> {
	let distinctFunction = new QDistinctFunction<ISelect>(selectClause);
	distinctFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.DISTINCT));
	return distinctFunction;
}

export interface IQDistinctFunction<ISelect> {

}

export class QDistinctFunction<ISelect>
extends StandAloneFunction implements IQDistinctFunction<ISelect>, Appliable<JSONClauseObject, any> {

	__appliedFunctions__: JSONSqlFunctionCall[] = [];

	constructor(
		private selectClause: ISelect
	) {
		super();
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): any {
		this.__appliedFunctions__.push(sqlFunctionCall);
		return this;
	}

	getSelectClause(): any {
		return this.selectClause;
	}

	toJSON( parsedSelectClause?: any ): JSONClauseField {
		if (this.__appliedFunctions__.length != 1) {
			throw `Not expecting and parent or child functions on "distinct"`;
		}
		if (!this.selectClause) {
			throw `SELECT clause is missing in "distinct" function.`;
		}
		let appliedFunctions = [
			getSqlFunctionCall(SqlFunction.DISTINCT)
		];
		return {
			__appliedFunctions__: appliedFunctions,
			fieldAlias: null,
			objectType: JSONClauseObjectType.DISTINCT_FUNCTION,
			value: <any>parsedSelectClause
		};
	}

	static getSelect( distinct: QDistinctFunction<any> ): any {
		return distinct.__appliedFunctions__[0].parameters[0];
	}
}

export function exists<IME extends IMappedEntity>( phRawQuery: PHRawMappedSQLQuery<IME> ): IQExistsFunction {
	let selectClause = phRawQuery.select;
	if (!selectClause) {
		throw `Sub-Query must have SELECT clause defined to be used in EXITS function`;
	}
	let existsFunction = new QExistsFunction(phRawQuery);
	return existsFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.EXISTS));
}

export interface IQExistsFunction extends JSONBaseOperation {

}

export class QExistsFunction<IME extends IMappedEntity>
extends StandAloneFunction implements IQExistsFunction, Appliable<JSONClauseObject, any> {

	__appliedFunctions__: JSONSqlFunctionCall[] = [];
	operator = "$exists";
	category = OperationCategory.FUNCTION;

	constructor(
		private subQuery: PHRawMappedSQLQuery<IME>
	) {
		super();
	}

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): any {
		this.__appliedFunctions__.push(sqlFunctionCall);
		return this;
	}

	getQuery(): PHRawMappedSQLQuery<any> {
		return this.subQuery;
	}

	toJSON( parsedQuery?: PHJsonMappedQSLQuery ): JSONFunctionOperation {
		if (this.__appliedFunctions__.length != 1) {
			throw `Not expecting and parent or child functions on "exists"`;
		}
		if (!this.subQuery) {
			throw `Subquery is not defined in "exists" function.`;
		}
		let appliedFunctions = [
			getSqlFunctionCall(SqlFunction.EXISTS)
		];
		return {
			category: this.category,
			object: <JSONClauseObject>{
				__appliedFunctions__: appliedFunctions,
				objectType: JSONClauseObjectType.EXISTS_FUNCTION,
				value: <any>parsedQuery
			},
			operator: this.operator
		};
	}
}

export function bool(
	primitive: boolean
): IQBooleanField {
	return new QBooleanFunction(primitive);
}

export function date(
	primitive: Date
): IQDateField {
	return new QDateFunction(primitive);
}

export function num(
	primitive: number
): IQNumberField {
	return new QNumberFunction(primitive);
}

export function str(
	primitive: string
): IQStringField {
	return new QStringFunction(primitive);
}