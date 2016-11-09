import {JSONSqlFunctionCall} from "./Functions";
import {IQEntity} from "../entity/Entity";
import {JSONFunctionOperation} from "../operation/Operation";
import {PHJsonFieldQSLQuery, PHRawFieldSQLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQField} from "./Field";
import {FieldColumnAliases} from "../entity/Aliases";
/**
 * Created by Papa on 10/19/2016.
 */

export enum JSONClauseObjectType {
	FIELD,
	FIELD_FUNCTION,
	FIELD_QUERY,
	DISTINCT_FUNCTION,
	EXISTS_FUNCTION,
	MANY_TO_ONE_RELATION
}

export enum SQLDataType {
	BOOLEAN,
	DATE,
	NUMBER,
	STRING
}

export interface JSONClauseObject {
	__appliedFunctions__: JSONSqlFunctionCall[];
	objectType: JSONClauseObjectType;
	dataType: SQLDataType;
}

export interface JSONClauseField extends JSONClauseObject {
	entityName?: string;
	fieldAlias: string;
	propertyName?: string,
	// A reference pointer from a field to a query, as defined in SELECT clause via the field function
	fieldSubQuery?: PHJsonFieldQSLQuery;
	tableAlias?: string,
	value?: string | JSONClauseField | PHJsonFieldQSLQuery;
}

export interface Appliable<JCO extends JSONClauseObject, IQF extends IQField<IQF>> {
	// fieldName: string;
	__appliedFunctions__: JSONSqlFunctionCall[];
	// q: IQ;

	applySqlFunction<A extends Appliable<JCO, IQF>>( sqlFunctionCall: JSONSqlFunctionCall ): A;
	toJSON( ...args: any[] ): JCO | JSONFunctionOperation;
}