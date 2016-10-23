import {IQStringField, QStringFunction} from "./StringField";
import {Appliable, JSONClauseObjectType, JSONClauseObject, JSONClauseField} from "./Appliable";
import {IQEntity} from "../entity/Entity";
import {PHRawNonEntitySQLQuery} from "../../query/sql/PHSQLQuery";
import {QNumberFunction, IQNumberField} from "./NumberField";
import {QDateFunction, IQDateField} from "./DateField";
import {IQField} from "./Field";
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

export function abs<A extends Appliable<any, any, any>>( appliable: A | number ): A {
	if (typeof appliable === "number") {
		return <any>new QNumberFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.ABS, true, [appliable]));
	} else {
		return <any>appliable.applySqlFunction(getSqlFunctionCall(SqlFunction.AVG));
	}
}

export function avg<A extends Appliable<any, any, any>>( appliable: A ): A {
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

export function count<IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, IQF>>( field: IQF ): IQF {
	(<Appliable<any, any, any>><any>field).applySqlFunction(getSqlFunctionCall(SqlFunction.COUNT));
	return field;
}

export function max<IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, IQF>>( field: IQF ): IQF {
	(<Appliable<any, any, any>><any>field).applySqlFunction(getSqlFunctionCall(SqlFunction.MAX));
	return field;
}

export function min<IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, IQF>>( field: IQF ): IQF {
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
	format: string,
	...formatParameters: any[]
): IQStringField<any> {
	return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.FORMAT, true, formatParameters));
}

export function replace<IQ extends IQEntity>(
	stringField: IQStringField<IQ> | string,
	toReplace: string,
	replaceWith: string
): IQStringField<IQ> {
	if (typeof stringField === "string") {
		return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, true, [stringField, toReplace, replaceWith]));
	} else {
		(<Appliable<any, any, any>><any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.REPLACE, false, [toReplace, replaceWith]));
		return stringField;
	}
}


export function trim<IQ extends IQEntity>( stringField: IQStringField<IQ> | string ): IQStringField<IQ> {
	if (typeof stringField === "string") {
		return <any>new QStringFunction().applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM, true, [stringField]));
	} else {
		(<Appliable<any, any, any>><any>stringField).applySqlFunction(getSqlFunctionCall(SqlFunction.TRIM));
		return stringField;
	}
}

export function distinct(
	selectClause: any
): IQDistinctFunction {
	let distinctFunction = new QDistinctFunction();
	distinctFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.DISTINCT, false, [selectClause]));
	return distinctFunction;
}

export interface IQDistinctFunction {

}

export class QDistinctFunction implements IQDistinctFunction, Appliable<JSONClauseObject, any, any> {

	__appliedFunctions__: JSONSqlFunctionCall[] = [];

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): any {
		this.__appliedFunctions__.push(sqlFunctionCall);
		return this;
	}

	toJSON(): JSONClauseField {
		return {
			__appliedFunctions__: this.__appliedFunctions__,
			type: JSONClauseObjectType.DISTINCT_FUNCTION
		};
	}
}

export function exists( phRawQuery: PHRawNonEntitySQLQuery ): IQExistsFunction {
	let selectClause = phRawQuery.select;
	if (!selectClause) {
		throw `Sub-Query must have SELECT clause defined to be used in EXITS function`;
	}
	let existsFunction = new QDistinctFunction();
	existsFunction.applySqlFunction(getSqlFunctionCall(SqlFunction.EXISTS, false, [phRawQuery]));
	return existsFunction;
}

export interface IQExistsFunction {

}

export class QExistsFunction implements IQDistinctFunction, Appliable<JSONClauseObject, any, any> {

	__appliedFunctions__: JSONSqlFunctionCall[] = [];

	applySqlFunction( sqlFunctionCall: JSONSqlFunctionCall ): any {
		this.__appliedFunctions__.push(sqlFunctionCall);
		return this;
	}

	toJSON(): JSONClauseField {
		return {
			__appliedFunctions__: this.__appliedFunctions__,
			type: JSONClauseObjectType.EXISTS_FUNCTION
		};
	}
}
