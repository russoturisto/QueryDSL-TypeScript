import {IQNumberField} from "./NumberField";
import {JSONSelectField, JSONSelectObject} from "./Field";
import {QRelation, IQManyToOneRelation} from "../entity/Relation";
/**
 * Created by Papa on 10/18/2016.
 */

export interface JSONSqlFunctionCall extends JSONSelectObject {
	functionType: SqlFunction,
	field: JSONSelectField
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
}

export function avg( numberObject: IQNumberField<any> | IQManyToOneRelation<any, any, any> ):JSONSqlFunctionCall {

	return {
		functionType: SqlFunction.AVG,
		field: {
			propertyName: numberObject.fieldName,
			tableAlias: QRelation.getPositionAlias(numberObject.q.fromClausePosition)
		}
	};
}

TODO: work here next - add the rest of the functions