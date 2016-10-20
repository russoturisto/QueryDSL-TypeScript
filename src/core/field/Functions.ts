import {IQStringField} from "./StringField";
import {Appliable, JSONClauseObjectType, JSONClauseObject} from "./Appliable";
/**
 * Created by Papa on 10/18/2016.
 */

export interface JSONSqlFunctionCall {
	functionType: SqlFunction,
	parameters: any[];
	valueIsPrimitive: boolean;
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
	TRIM // Trims a string
}

var strFld: IQStringField<any>;

export function abs<A extends Appliable<any, any>>( appliable: A | number ): A {
	if (typeof appliable === "number") {
		return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.ABS, true, [appliable]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
	}
}

export function avg<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
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

export function count<A extends Appliable<any, any>>( appliable: A ): A {
	return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
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

export function ucase<A extends Appliable<any, any>>( appliable: A | string ): A {
	if (typeof appliable === "string") {
		return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE, true, [appliable]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.UCASE));
	}
}

export function lcase<A extends Appliable<any, any>>( appliable: A | string ): A {
	if (typeof appliable === "string") {
		return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE, true, [appliable]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LCASE));
	}
}

export function mid<A extends Appliable<any, any>>(
	appliable: A | string,
	start: number,
	length: number
): A {
	if (typeof appliable === "string") {
		return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.MID, true, [appliable, start, length]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.MID, false, [start, length]));
	}
}

export function len<A extends Appliable<any, any>>( appliable: A | string ): A {
	if (typeof appliable === "string") {
		return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.LEN, true, [appliable]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.LEN));
	}
}

export function round<A extends Appliable<any, any>>(
	appliable: A | number,
	digits: number = 0
): A {
	if (typeof appliable === "number") {
		return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, true, [appliable, digits]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.ROUND, false, [digits]));
	}
}

export function now(): Appliable<any, any> {
	return new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.NOW));
}

export function format<A extends Appliable<any, any>>(
	format: string,
	...appliables: any[]
): A {
	return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, true, appliables));
}

export function replace<A extends Appliable<any, any>>(
	appliable: A | string,
	toReplace: string,
	replaceWith: string
): A {
	if (typeof appliable === "string") {
		return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, true, [appliable, toReplace, replaceWith]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, false, [toReplace, replaceWith]));
	}
}


export function trim<A extends Appliable<any, any>>( appliable: A | string ): A {
	if (typeof appliable === "string") {
		return <any>new FunctionAppliable().applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM, true, [appliable]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
	}
}

export class FunctionAppliable implements Appliable<JSONClauseFunction, any> {

	fieldName: string;
	q: any;
	appliedFunctions: JSONSqlFunctionCall[] = [];

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): Appliable<JSONClauseFunction, any> {
		let functionApplicable = new FunctionAppliable();
		functionApplicable.appliedFunctions = functionApplicable.appliedFunctions.concat(this.appliedFunctions);
		functionApplicable.appliedFunctions.push(sqlFunctionCall);

		return functionApplicable;
	}

	toJSON(): JSONClauseFunction {
		return {
			appliedFunctions: this.appliedFunctions,
			type: JSONClauseObjectType.FUNCTION
		};
	}
}