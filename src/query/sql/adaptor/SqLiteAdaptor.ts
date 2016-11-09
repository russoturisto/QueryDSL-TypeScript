import {ISQLAdaptor, ISQLFunctionAdaptor, SqlValueProvider, AbstractFunctionAdaptor} from "./SQLAdaptor";
import {JSONSqlFunctionCall, SqlFunction} from "../../../core/field/Functions";
import {IQEntity} from "../../../core/entity/Entity";
import {SQLDataType} from "../../../core/field/Appliable";

/**
 * Created by Papa on 8/27/2016.
 */
export class SqLiteAdaptor implements ISQLAdaptor {

	private functionAdaptor: ISQLFunctionAdaptor;

	constructor(
		protected sqlValueProvider: SqlValueProvider
	) {
		this.functionAdaptor = new SqlLiteFunctionAdaptor(sqlValueProvider);
	}

	getParameterReference(
		parameterReferences: string[],
		newReference: string
	): string {
		return '?';
	}

	dateToDbQuery(
		date: Date
	): string {
		let milliseconds = date.getTime();

		return '' + milliseconds;
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

	getFunctionAdaptor(): ISQLFunctionAdaptor {
		return this.functionAdaptor;
	}

	getOffsetFragment( offset: number ): string {
		return `
OFFSET
	${offset}`;
	}

	getLimitFragment( limit: number ): string {
		return `
LIMIT
	${limit}`;
	}

}

export class SqlLiteFunctionAdaptor extends AbstractFunctionAdaptor {

	constructor(
		protected sqlValueProvider: SqlValueProvider
	) {
		super(sqlValueProvider);
	}

	getFunctionCall(
		jsonFunctionCall: JSONSqlFunctionCall,
		value: string,
		qEntityMapByAlias: {[entityName: string]: IQEntity}
	): string {
		switch (jsonFunctionCall.functionType) {
			case SqlFunction.ABS:
				return `ABS(${value})`;
			case SqlFunction.AVG:
				return `AVG(${value})`;
			case SqlFunction.COUNT:
				return `COUNT(${value})`;
			case SqlFunction.MAX:
				return `MAX(${value})`;
			case SqlFunction.MIN:
				return `MIN(${value})`;
			case SqlFunction.SUM:
				return `SUM(${value})`;
			case SqlFunction.UCASE:
				return `UPPER(${value})`;
			case SqlFunction.LCASE:
				return `LOWER(${value})`;
			case SqlFunction.MID:
				let start = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[0]);
				let length = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[1]);
				return `SUBSTR(${value}, ${start}, ${length})`;
			case SqlFunction.LEN:
				return `LENGTH(${value})`;
			case SqlFunction.ROUND:
				let digits = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[0]);
				return `ROUND(${value}, ${digits})`;
			case SqlFunction.NOW:
				return `DATE('now')`;
			case SqlFunction.FORMAT:
				let formatCall = `FORMAT('${value}', `;
				for (let i = 0; i < jsonFunctionCall.parameters.length; i++) {
					let formatParam = jsonFunctionCall.parameters[i];
					formatParam = this.sqlValueProvider.getFunctionCallValue(formatParam);
					formatCall = `${formatCall}, ${formatParam}`;
				}
				formatCall += ')';
				return formatCall;
			case SqlFunction.REPLACE:
				let param1 = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[0]);
				let param2 = this.sqlValueProvider.getFunctionCallValue(jsonFunctionCall.parameters[1]);
				return `REPLACE('${value}', ${param1}, ${param2})`;
			case SqlFunction.TRIM:
				return `TRIM(${value})`;
			case SqlFunction.DISTINCT:
				throw `Invalid placement of a distinct function`;
			case SqlFunction.EXISTS:
				throw `Invalid placement of an exists function`;
			default:
				throw `Unknown function type: ${jsonFunctionCall.functionType}`;
		}
	}
}