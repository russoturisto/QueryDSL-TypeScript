import {SQLDialect, SQLDataType} from "../SQLStringQuery";
import {ISQLAdaptor} from "./SQLAdaptor";
/**
 * Created by Papa on 8/27/2016.
 */

export class OracleAdaptor implements ISQLAdaptor {

	dateToDbQuery( date: Date ): string {
		let dateString = date.toJSON();
		dateString = dateString.replace('Z', '');
		return `trunc(to_timestamp_tz('${dateString}.GMT','YYYY-MM-DD"T"HH24:MI:SS.FF3.TZR'))`;
	}

	getResultArray(rawResponse:any):any[] {
		throw `Not implemented - getResultArray`;
	}

	getResultCellValue(
		resultRow:any,
		columnName:string,
		index:number,
		dataType:SQLDataType,
		defaultValue:any
	):any {
		throw `Not implemented - getResultCellValue`;
	}
}