import {SQLDialect, SQLDataType} from "../SQLStringQuery";
import {OracleAdaptor} from "./OracleAdaptor";
import {SqLiteAdaptor} from "./SqLiteAdaptor";
import {JSONSqlFunctionCall} from "../../../core/field/Functions";
import {JSONClauseObject} from "../../../core/field/Appliable";
import {IQEntity} from "../../../core/entity/Entity";
/**
 * Created by Papa on 8/27/2016.
 */

export interface ISQLAdaptor {

	getParameterSymbol():string;

	dateToDbQuery(
		date: Date
	): string;

	getResultArray( rawResponse: any ): any[];

	/**
	 * Options in returned result:
	 *
	 * Object mapped by ?column? name
	 * Array of values
	 *
	 * This is a common API on top of both
	 */
	getResultCellValue(
		resultRow: any,
		columnName: string,
		index: number,
		dataType: SQLDataType,
		defaultValue: any
	): any;

	getFunctionAdaptor(): ISQLFunctionAdaptor;
}

export interface SqlValueProvider {
	getFunctionCallValue(
		rawValue: any
	): string;
}

export interface ISQLFunctionAdaptor {

	getFunctionCalls(
		clause: JSONClauseObject,
		innerValue: string,
		qEntityMapByAlias: {[alias: string]: IQEntity},
		embedParameters: boolean,
		parameters: any[]
	): string ;

	getFunctionCall(
		jsonFunctionCall: JSONSqlFunctionCall,
		value: string,
		qEntityMapByAlias: {[entityName: string]: IQEntity},
		embedParameters: boolean,
		parameters: any[]
	): string;

}

export function getSQLAdaptor(
	sqlValueProvider: SqlValueProvider,
	sqlDialect: SQLDialect
): ISQLAdaptor {

	switch (sqlDialect) {
		case SQLDialect.ORACLE:
			return new OracleAdaptor(sqlValueProvider);
		case SQLDialect.SQLITE:
			return new SqLiteAdaptor(sqlValueProvider);
		default:
			throw `Unknown SQL Dialect ${sqlDialect}`;
	}

}

export abstract class AbstractFunctionAdaptor implements ISQLFunctionAdaptor {

	constructor(
		protected sqlValueProvider: SqlValueProvider
	) {
	}

	getFunctionCalls(
		clause: JSONClauseObject,
		innerValue: string,
		qEntityMapByAlias: {[alias: string]: IQEntity},
		embedParameters: boolean = true,
		parameters: any[] = null
	): string {
		clause.__appliedFunctions__.forEach(( appliedFunction ) => {
			innerValue = this.getFunctionCall(appliedFunction, innerValue, qEntityMapByAlias, embedParameters, parameters);
		});

		return innerValue;
	}

	abstract getFunctionCall(
		jsonFunctionCall: JSONSqlFunctionCall,
		value: string,
		qEntityMapByAlias: {[entityName: string]: IQEntity},
		embedParameters: boolean,
		parameters: any[]
	): string;

}
