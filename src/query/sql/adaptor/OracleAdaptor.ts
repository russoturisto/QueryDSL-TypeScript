import {ISQLAdaptor, ISQLFunctionAdaptor, SqlValueProvider} from "./SQLAdaptor";
import {SQLDataType} from "../../../core/field/Appliable";
/**
 * Created by Papa on 8/27/2016.
 */

export class OracleAdaptor implements ISQLAdaptor {

	constructor(
		protected sqlValueProvider: SqlValueProvider
	) {
	}

	getParameterReference(
		parameterReferences: string[],
		newReference: string
	): string {
		throw `Not implemented`;
	}

	dateToDbQuery(
		date: Date
	): string {
		let dateString = date.toJSON();
		dateString = dateString.replace('Z', '');
		return `trunc(to_timestamp_tz('${dateString}.GMT','YYYY-MM-DD"T"HH24:MI:SS.FF3.TZR'))`;
	}

	getResultArray( rawResponse: any ): any[] {
		throw `Not implemented - getResultArray`;
	}

	getResultCellValue(
		resultRow: any,
		columnName: string,
		index: number,
		dataType: SQLDataType,
		defaultValue: any
	): any {
		throw `Not implemented - getResultCellValue`;
	}

	getFunctionAdaptor(): ISQLFunctionAdaptor {
		throw `Not implemented getFunctionAdaptor`;
	}

	getOffsetFragment( offset: number ): string {
		throw `Not implemented`;
	}

	getLimitFragment( limit: number ): string {
		throw `Not implemented`;
	}

}