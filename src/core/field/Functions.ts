import {IQStringField} from "./StringField";
import {Appliable, JSONClauseObjectType, JSONClauseObject} from "./Applicable";
/**
 * Created by Papa on 10/18/2016.
 */

export interface JSONSqlFunctionCall {
	functionType: SqlFunction,
	parameters: any[];
}

export interface JSONClauseFunction extends JSONClauseObject {
}

/**
 * Extrated from http://www.w3schools.com/sql/sql_functions.asp
 */
export enum SqlFunction {
	// SQL Aggregate Functions
	// SQL aggregate functions return a single value, calculated from values in a column.
	// Useful Aggregate functions:
	AVG, // Returns the average value
	COUNT, // Returns the number of rows
	FIRST, // Returns the first value
	LAST, //  Returns the last value
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
	TRIM // Trims a string
}

var strFld:IQStringField<any>;

export function avg<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
}

function getSqlFunctionCall(
	sqlFunction: SqlFunction,
	parameters?: any[]
) {
	return {
		functionType: sqlFunction,
		parameters: parameters
	};
}

export function count<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
}

export function first<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.FIRST));
}

export function last<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LAST));
}

export function max<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
}

export function min<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.MIN));
}

export function sum<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.SUM));
}

export function ucase<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
}

export function lcase<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
}

export function mid<A extends Appliable<any, any>>(
	appliable: A,
	start: number,
	length: number
): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.MID, [start, length]));
}

export function len<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
}

export function round<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND));
}

export function now(): Appliable<any, any> {
	return new FunctionApplicable().applySqlFunction(getSqlFunctionCall(SqlFunction.NOW));
}

export function format<A extends Appliable<any, any>>(
	appliable: A,
	format: string
): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, [format]));
}

export function trim<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
}

export class FunctionApplicable implements Appliable<JSONClauseFunction, any> {

	fieldName: string;
	q: any;
	appliedFunctions: JSONSqlFunctionCall[] = [];

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): Appliable<JSONClauseFunction, any> {
		let functionApplicable = new FunctionApplicable();
		functionApplicable.appliedFunctions = functionApplicable.appliedFunctions.concat(this.appliedFunctions);
		functionApplicable.appliedFunctions.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON():JSONClauseFunction {
		return {
			appliedFunctions: this.appliedFunctions,
			type: JSONClauseObjectType.FUNCTION
		};
	}
}