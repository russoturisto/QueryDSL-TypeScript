import {JSONSqlFunctionCall} from "./Functions";
import {IQEntity} from "../entity/Entity";
import {EntityMetadata} from "../entity/EntityMetadata";
import {MetadataUtils} from "../entity/metadata/MetadataUtils";
import {JSONFunctionOperation} from "../operation/Operation";
import {PHJsonFieldQSLQuery} from "../../query/sql/query/ph/PHFieldSQLQuery";
import {IQOperableField} from "./OperableField";
import {IQField} from "./Field";
import {ISQLFunctionAdaptor, SqlValueProvider} from "../../query/sql/adaptor/SQLAdaptor";
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

export abstract class AbstractFunctionAdaptor implements ISQLFunctionAdaptor {

	constructor(
		protected sqlValueProvider: SqlValueProvider
	) {
	}

	getFunctionCalls(
		clause:JSONClauseObject,
		innerValue: string,
		qEntityMapByAlias: {[alias: string]: IQEntity},
	  forField:boolean
	): string {
		clause.__appliedFunctions__.forEach(( appliedFunction ) => {
			innerValue = this.getFunctionCall(appliedFunction, innerValue, qEntityMapByAlias, forField);
		});

		return innerValue;
	}

	abstract getFunctionCall(
		jsonFunctionCall: JSONSqlFunctionCall,
		value: string,
		qEntityMapByAlias: {[entityName: string]: IQEntity},
		forField: boolean
	): string;

}