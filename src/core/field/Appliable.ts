import {JSONSqlFunctionCall} from "./Functions";
import {IQEntity} from "../entity/Entity";
import {JSONFunctionOperation} from "../operation/Operation";
import {PHJsonFieldQSLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQField} from "./Field";
/**
 * Created by Papa on 10/19/2016.
 */

export enum JSONClauseObjectType {
	BOOLEAN_FIELD_FUNCTION,
	DATE_FIELD_FUNCTION,
	DISTINCT_FUNCTION,
	EXISTS_FUNCTION,
	FIELD,
	FIELD_QUERY,
	NUMBER_FIELD_FUNCTION,
	MANY_TO_ONE_RELATION,
	STRING_FIELD_FUNCTION
}

export interface JSONClauseObject {
	__appliedFunctions__: JSONSqlFunctionCall[];
	type: JSONClauseObjectType;
}

export interface JSONClauseField extends JSONClauseObject {
	propertyName?: string,
	subQuery?: PHJsonFieldQSLQuery;
	tableAlias?: string,
	value?: boolean | Date | number | string;
}

export interface Appliable<JCO extends JSONClauseObject, IQ extends IQEntity, IQF extends IQField<IQ, any>> {
	// fieldName: string;
	__appliedFunctions__: JSONSqlFunctionCall[];
	// q: IQ;

	applySqlFunction<A extends Appliable<JCO, IQ, IQF>>( sqlFunctionCall: JSONSqlFunctionCall ): A;
	toJSON(): JCO | JSONFunctionOperation;
}