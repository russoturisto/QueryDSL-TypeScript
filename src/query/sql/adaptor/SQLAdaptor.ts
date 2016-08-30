import {SQLDialect, SQLDataType} from "../SQLStringQuery";
import {OracleAdaptor} from "./OracleAdaptor";
import {SqLiteAdaptor} from "./SqLiteAdaptor";
/**
 * Created by Papa on 8/27/2016.
 */

export interface ISQLAdaptor {

	dateToDbQuery( date: Date ): string;

	getResultArray(rawResponse:any):any[];

	/**
	 * Options in returned result:
	 *
	 * Object mapped by ?column? name
	 * Array of values
	 *
	 * This is a common API on top of both
	 */
	getResultCellValue(
		resultRow:any,
		columnName:string,
		index:number,
		dataType:SQLDataType,
	  defaultValue:any
	):any;
}

export function getSQLAdaptor(
	sqlDialect: SQLDialect
): ISQLAdaptor {

	switch (sqlDialect) {
		case SQLDialect.ORACLE:
			return new OracleAdaptor();
		case SQLDialect.SQLITE:
			return new SqLiteAdaptor();
		default:
			throw `Unknown SQL Dialect ${sqlDialect}`;
	}

}
