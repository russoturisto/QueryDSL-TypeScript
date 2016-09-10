import {ISQLAdaptor} from "./SQLAdaptor";
import {SQLDataType} from "../SQLStringQuery";
/**
 * Created by Papa on 8/27/2016.
 */

export class SqLiteAdaptor implements ISQLAdaptor {

	dateToDbQuery(
		date: Date,
		embedParameters: boolean
	): string | number {
		let milliseconds = date.getTime();
		if (embedParameters) {
			return `FROM_UNIXTIME(${milliseconds})`;
		} else {
			return milliseconds;
		}
	}

	getResultArray( rawResponse: any ): any[] {
		return rawResponse.res.rows;
	}

	getResultCellValue(
		resultRow: any,
		columnName: string,
		index: number,
		dataType: SQLDataType,
		defaultValue: any
	): any {
		return resultRow[columnName];
	}

}