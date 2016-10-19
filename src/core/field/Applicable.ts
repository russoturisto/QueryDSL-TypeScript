import {JSONSqlFunctionCall, SqlFunction} from "./Functions";
import {IQEntity} from "../entity/Entity";
/**
 * Created by Papa on 10/19/2016.
 */

export enum JSONClauseObjectType {
	FIELD,
	FUNCTION,
	MANY_TO_ONE_RELATION
}

export interface JSONClauseObject {
	appliedFunctions: JSONSqlFunctionCall[];
	type: JSONClauseObjectType;
}

export interface JSONClauseField extends JSONClauseObject {
	propertyName: string,
	tableAlias: string
}

export interface Appliable<JCO extends JSONClauseObject, IQ extends IQEntity> {
	fieldName: string;
	appliedFunctions: JSONSqlFunctionCall[];
	q: IQ;

	applySqlFunction<A extends Appliable<JCO, IQ>>( sqlFunctionCall: JSONSqlFunctionCall ): A;
	toJSON(): JCO;
}

export function applyFunctionsReturnString(
	jsonClauseObject:JSONClauseObject
):string {

		let columnName;
		switch(jsonClauseObject.type) {
			case JSONClauseObjectType.FIELD:
			case JSONClauseObjectType.FUNCTION:
			case JSONClauseObjectType.MANY_TO_ONE_RELATION:
		}
}

function getFunctionName(sqlFunction:SqlFunction) {
	switch (sqlFunction) {
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
		case SqlFunction.AVG:
	}
}