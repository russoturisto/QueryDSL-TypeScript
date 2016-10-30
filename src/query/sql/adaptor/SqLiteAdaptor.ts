import {ISQLAdaptor, ISQLFunctionAdaptor, SqlValueProvider, AbstractFunctionAdaptor} from "./SQLAdaptor";
import {SQLDataType} from "../SQLStringQuery";
import {JSONSqlFunctionCall, SqlFunction} from "../../../core/field/Functions";
import {IQEntity} from "../../../core/entity/Entity";
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

	getFunctionAdaptor(): ISQLFunctionAdaptor {
		return this.functionAdaptor;
	}

	applyFunction(
		value: string,
		functionCall: JSONSqlFunctionCall,
		isField: boolean
	): string {
		throw `Not implemented applyFunction`;
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
		qEntityMapByAlias: {[entityName: string]: IQEntity},
		forField: boolean
	): string {
		switch (jsonFunctionCall.functionType) {
			case SqlFunction.ABS:
				if (jsonFunctionCall.valueIsPrimitive) {
					return `ABS(${jsonFunctionCall.parameters[0]})`;
				} else {
					return `ABS(${value})`;
				}
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
				if (jsonFunctionCall.valueIsPrimitive) {
					return `UPPER('${jsonFunctionCall.parameters[0]}')`;
				} else {
					return `UPPER(${value})`;
				}
			case SqlFunction.LCASE:
				if (jsonFunctionCall.valueIsPrimitive) {
					return `LOWER('${jsonFunctionCall.parameters[0]}')`;
				} else {
					return `LOWER(${value})`;
				}
			case SqlFunction.MID:
				if (jsonFunctionCall.valueIsPrimitive) {
					return `SUBSTR(${jsonFunctionCall.parameters[0]}, ${jsonFunctionCall.parameters[1]}, ${jsonFunctionCall.parameters[2]})`;
				} else {
					return `SUBSTR('${value}', ${jsonFunctionCall[0]}, ${jsonFunctionCall[1]})`;
				}
			case SqlFunction.LEN:
				if (jsonFunctionCall.valueIsPrimitive) {
					return `LENGTH('${jsonFunctionCall.parameters[0]}')`;
				} else {
					return `LENGTH(${value})`;
				}
			case SqlFunction.ROUND:
				if (jsonFunctionCall.valueIsPrimitive) {
					return `ROUND(${jsonFunctionCall.parameters[0]}, ${jsonFunctionCall.parameters[1]})`;
				} else {

					let param1 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[0], true, false);
					return `ROUND(${value}, ${jsonFunctionCall[0]})`;
				}
			case SqlFunction.NOW:
				return `DATE('now')`;
			case SqlFunction.FORMAT:
				let formatString = jsonFunctionCall.parameters[0];
				formatString = this.sqlValueProvider.getValue(formatString, true, false);
				let formatCall = `FORMAT('${formatString}', `;
				for (let i = 1; i < jsonFunctionCall.parameters.length; i++) {
					let formatParam = jsonFunctionCall.parameters[i];
					formatParam = this.sqlValueProvider.getValue(formatParam, true, true);
					formatCall = `${formatCall}, ${formatParam}`;
				}
				formatCall += ')';
				return formatCall;
			case SqlFunction.REPLACE:
				if (jsonFunctionCall.valueIsPrimitive) {
					let param1 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[0], true, false);
					let param2 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[1], true, false);
					let param3 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[2], true, false);
					return `REPLACE('${param1}', ${param2}, ${param3})`;
				} else {
					let param1 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[0], true, false);
					let param2 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[1], true, false);
					return `REPLACE('${value}', ${param1}, ${param2})`;
				}
			case SqlFunction.TRIM:
				if (jsonFunctionCall.valueIsPrimitive) {
					let param1 = this.sqlValueProvider.getValue(jsonFunctionCall.parameters[0], true, false);
					return `TRIM('${param1}')`;
				} else {
					return `TRIM(${value})`;
				}
		}
	}
}