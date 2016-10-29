import {IQStringField, QStringFunction, QStringField} from "./StringField";
import {Appliable, JSONClauseObjectType, JSONClauseObject, JSONClauseField} from "./Appliable";
import {IQEntity} from "../entity/Entity";
import {QNumberFunction, IQNumberField} from "./NumberField";
import {QDateFunction, IQDateField} from "./DateField";
import {JSONBaseOperation, OperationCategory, JSONFunctionOperation} from "../operation/Operation";
import {PHRawNonEntitySQLQuery} from "../../query/sql/query/ph/PHNonEntitySQLQuery";
import {QOperableField, IQOperableField} from "./OperableField";
import {IQBooleanField, QBooleanFunction} from "./BooleanField";
import {PHRawMappedSQLQuery, PHJsonMappedQSLQuery, IMappedEntity} from "../../query/sql/query/ph/PHMappedSQLQuery";
import {PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
/**
 * Created by Papa on 10/18/2016.
 */

export interface JSONSqlFunctionCall {
	functionType: SqlFunction,
	parameters: any[];
	valueIsPrimitive: boolean;
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

var strFld: IQStringField<any>;

export function abs<IQ extends IQEntity, IQF extends IQNumberField<IQ>>( numberField: IQF | number ): IQF {
	if (typeof numberField === "number") {
		return <any>new QNumberFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.ABS, true, [numberField]));
	} else {
		(<Appliable<any, any, any>><any>numberField).applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
		return numberField;
	}
}

export function avg<IQ extends IQEntity, IQF extends IQNumberField<IQ>>( numberField: IQF ): IQF {
	(<Appliable<any, any, any>><any>numberField).applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
	return numberField;
}

function getSqlFunctionCall(
	sqlFunction: SqlFunction,
	valueIsPrimitive: boolean = false,
	parameters?: any[]
) {
	return {
		functionType: sqlFunction,
		parameters: parameters,
		valueIsPrimitive: valueIsPrimitive
	};
}

export function count<IQ extends IQEntity, IQF extends IQOperableField<IQ, any, any, any, IQF>>( field: IQF ): IQF {
	(<Appliable<any, any, any>><any>field).applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
	return field;
}

export function max<IQ extends IQEntity, IQF extends IQOperableField<IQ, any, any, any, IQF>>( field: IQF ): IQF {
	(<Appliable<any, any, any>><any>field).applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
	return field;
}

export function min<IQ extends IQEntity, IQF extends IQOperableField<IQ, any, any, any, IQF>>( field: IQF ): IQF {
	(<Appliable<any, any, any>><any>field).applySqlFunction(getSqlFunctionCall(SqlFunction.MIN));
	return field;
}

export function sum<IQ extends IQEntity>( numberField: IQNumberField<IQ> ): IQNumberField<IQ> {
	(<Appliable<any, any, any>><any>numberField).applySqlFunction(getSqlFunctionCall(SqlFunction.SUM));
	return numberField;
}

export function ucase<IQ extends IQEntity>( stringField: IQStringField<IQ> | string ): IQStringField<IQ> {
	if (typeof stringField === "string") {
		return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE, true, [stringField]));
	} else {
		(<Appliable<any, any, any>><any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
		return stringField;
	}
}

export function lcase<IQ extends IQEntity>( stringField: IQStringField<IQ> | string ): IQStringField<IQ> {
	if (typeof stringField === "string") {
		return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE, true, [stringField]));
	} else {
		(<Appliable<any, any, any>><any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
		return stringField;
	}
}

export function mid<IQ extends IQEntity>(
	stringField: IQStringField<IQ> | string,
	start: number,
	length: number
): IQStringField<IQ> {
	if (typeof stringField === "string") {
		return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.MID, true, [stringField, start, length]));
	} else {
		(<Appliable<any, any, any>><any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.MID, false, [start, length]));
		return stringField;
	}
}

export function len<IQ extends IQEntity>( stringField: IQStringField<IQ> | string ): IQStringField<IQ> {
	if (typeof stringField === "string") {
		return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.LEN, true, [stringField]));
	} else {
		(<Appliable<any, any, any>><any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
		return stringField;
	}
}

export function round<IQ extends IQEntity>(
	numberField: IQNumberField<IQ> | number,
	digits: number = 0
): IQNumberField<IQ> {
	if (typeof numberField === "number") {
		return <any>new QNumberFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, true, [numberField, digits]));
	} else {
		(<Appliable<any, any, any>><any>numberField).applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, false, [digits]));
		return numberField;
	}
}

export function now(): IQDateField<any> {
	return new QDateFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.NOW));
}

export function format(
	format: string | IQStringField<any>,
	...formatParameters: any[]
): IQStringField<any> {
	let allParams = formatParameters.slice();
	allParams.unshift(format);
	return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, true, allParams));
}

export function replace<IQ extends IQEntity>(
	stringField: IQStringField<IQ> | string,
	toReplace: IQStringField<IQ> | string,
	replaceWith: IQStringField<IQ> | string
): IQStringField<IQ> {
	if (typeof stringField === "string") {
		return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, true, [stringField, toReplace, replaceWith]));
	} else {
		(<Appliable<any, any, any>><any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, false, [toReplace, replaceWith]));
		return stringField;
	}
}


export function trim<IQ extends IQEntity>( stringField: IQStringField<IQ> | string | PHRawFieldSQLQuery<any>): IQStringField<IQ> {
	if (stringField instanceof QStringField) {
		(<Appliable<any, any, any>><any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
		return stringField;
	} else {
		return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM, true, [stringField]));
	}
}

export abstract class StandAloneFunction {

}

export function distinct<ISelect>(
	selectClause: ISelect
): IQDistinctFunction<ISelect> {
	let distinctFunction = new QDistinctFunction<ISelect>();
	distinctFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.DISTINCT, false, [selectClause]));
	return distinctFunction;
}

export interface IQDistinctFunction<ISelect> {

}

export class QDistinctFunction<ISelect> extends StandAloneFunction implements IQDistinctFunction<ISelect>, Appliable<JSONClauseObject, any, any> {

	__appliedFunctions__: JSONSqlFunctionCall[] = [];

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): any {
		this.__appliedFunctions__.push(sqlFunctionCall);
		return this;
	}

	getSelectClause(): any {
		return this.__appliedFunctions__[0].parameters[0];
	}

	toJSON( parsedSelectClause?: any ): JSONClauseField {
		if (this.__appliedFunctions__.length != 1) {
			throw `Not expecting and parent or child functions on "distinct"`;
		}
		if (this.__appliedFunctions__[0].parameters.length != 1) {
			throw `Expecting only 1 parameter on "distinct" function.`;
		}
		let appliedFunctions = [
			getSqlFunctionCall(SqlFunction.DISTINCT, false, [parsedSelectClause])
		];
		return {
			__appliedFunctions__: appliedFunctions,
			type: JSONClauseObjectType.DISTINCT_FUNCTION
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
	let existsFunction = new QExistsFunction();
	existsFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.EXISTS, false, [phRawQuery]));
	return existsFunction;
}

export interface IQExistsFunction extends JSONBaseOperation {

}

export class QExistsFunction extends StandAloneFunction implements IQExistsFunction, Appliable<JSONClauseObject, any, any> {

	__appliedFunctions__: JSONSqlFunctionCall[] = [];
	operator = "$exists";
	category = OperationCategory.FUNCTION;

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): any {
		this.__appliedFunctions__.push(sqlFunctionCall);
		return this;
	}

	getQuery(): PHRawMappedSQLQuery<any> {
		return this.__appliedFunctions__[0].parameters[0];
	}

	toJSON( parsedQuery?: PHJsonMappedQSLQuery ): JSONFunctionOperation {
		if (this.__appliedFunctions__.length != 1) {
			throw `Not expecting and parent or child functions on "exists"`;
		}
		if (this.__appliedFunctions__[0].parameters.length != 1) {
			throw `Expecting only 1 parameter on "exists" function.`;
		}
		let appliedFunctions = [
			getSqlFunctionCall(SqlFunction.EXISTS, false, [parsedQuery])
		];
		return {
			category: this.category,
			object: {
				__appliedFunctions__: appliedFunctions,
				type: JSONClauseObjectType.EXISTS_FUNCTION
			},
			operator: this.operator
		};
	}
}

export function bool(
	primitive: boolean
): IQBooleanField<any> {
	return new QBooleanFunction(primitive);
}

export function date(
	primitive: Date
): IQDateField<any> {
	return new QDateFunction(primitive);
}

export function num(
	primitive: number
): IQNumberField<any> {
	return new QNumberFunction(primitive);
}

export function str(
	primitive: string
): IQStringField<any> {
	return new QStringFunction(primitive);
}