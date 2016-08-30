import {ISQLAdaptor} from "./SQLAdaptor";
import {SQLDataType} from "../SQLStringQuery";
/**
 * Created by Papa on 8/27/2016.
 */

export class SqLiteAdaptor implements ISQLAdaptor {

	dateToDbQuery( date: Date ): string {
		let milliseconds = date.getTime();
		return `FROM_UNIXTIME(${milliseconds})`;
	}

	getResultArray(rawResponse:any):any[] {
		return rawResponse.res.rows;
	}

	getResultCellValue(
		resultRow:any,
		columnName:string,
	  index:number,
	  dataType:SQLDataType,
	  defaultValue:any
	):any {
		return resultRow[columnName];
	}

}