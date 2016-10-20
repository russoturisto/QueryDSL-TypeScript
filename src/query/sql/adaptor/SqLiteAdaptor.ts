import {ISQLAdaptor} from "./SQLAdaptor";
import {SQLDataType} from "../SQLStringQuery";
import {JSONSqlFunctionCall, SqlFunction, FunctionAppliable} from "../../../core/field/Functions";
import {
	Appliable, ISQLFunctionAdaptor, AbstractFunctionAdaptor, JSONClauseObject,
	JSONClauseObjectType
} from "../../../core/field/Appliable";
import {QField} from "../../../core/field/Field";
import {IQEntity} from "../../../core/entity/Entity";
import {QRelation, QManyToOneRelation} from "../../../core/entity/Relation";
import {MetadataUtils} from "../../../core/entity/metadata/MetadataUtils";
import {EntityMetadata} from "../../../core/entity/EntityMetadata";
/**
 * Created by Papa on 8/27/2016.
 */

export class SqLiteAdaptor implements ISQLAdaptor {

	private functionAdaptor: ISQLFunctionAdaptor = new SqlLiteFunctionAdaptor();

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

}

export class SqlLiteFunctionAdaptor extends AbstractFunctionAdaptor {

	getFunctionCall(
		jsonFunctionCall: JSONSqlFunctionCall,
		value: string,
		qEntityMapByAlias: {[entityName: string]: IQEntity}
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
					return `ROUND(${value}, ${jsonFunctionCall[0]})`;
				}
			case SqlFunction.NOW:
				return `DATE('now')`;
			case SqlFunction.FORMAT:
				let formatString = jsonFunctionCall.parameters[0];
				let formatCall = `FORMAT('${formatString}', `;
				for (let i = 1; i < jsonFunctionCall.parameters.length; i++) {
					let formatParam = jsonFunctionCall.parameters[i];
					switch ((<JSONClauseObject>formatParam).type) {
						case JSONClauseObjectType.FIELD:
						case JSONClauseObjectType.FUNCTION:
						case JSONClauseObjectType.MANY_TO_ONE_RELATION:
							formatParam = this.getFunctionCalls(formatParam, qEntityMapByAlias);
							break;
						default:
							switch (typeof formatParam) {
								case "boolean":
									formatParam = (formatParam) ? 'true' : 'false';
									break;
								case "number":
									break;
								case "string":
									formatParam = `'${formatParam}'`;
									break;
								default:
									`Unsupported parameter for Format function, can either be a boolean, number, string, property name, or a function call`;
							}
					}
					formatCall = `${formatCall}, ${formatParam}`;
				}
				formatCall += ')';
				return formatCall;
			case SqlFunction.REPLACE:
				if (jsonFunctionCall.valueIsPrimitive) {
					return `REPLACE('${jsonFunctionCall.parameters[0]}', ${jsonFunctionCall.parameters[1]}, ${jsonFunctionCall.parameters[2]})`;
				} else {
					return `REPLACE('${value}', ${jsonFunctionCall[0]}, ${jsonFunctionCall[1]})`;
				}
			case SqlFunction.TRIM:
				if (jsonFunctionCall.valueIsPrimitive) {
					return `TRIM('${jsonFunctionCall.parameters[0]}')`;
				} else {
					return `TRIM(${value})`;
				}
		}
	}
}