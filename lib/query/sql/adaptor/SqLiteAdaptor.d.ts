import { ISQLAdaptor, ISQLFunctionAdaptor } from "./SQLAdaptor";
import { SQLDataType } from "../SQLStringQuery";
import { JSONSqlFunctionCall } from "../../../core/field/Functions";
/**
 * Created by Papa on 8/27/2016.
 */
export declare class SqLiteAdaptor implements ISQLAdaptor {
    private functionAdaptor;
    dateToDbQuery(date: Date, embedParameters: boolean): string | number;
    getResultArray(rawResponse: any): any[];
    getResultCellValue(resultRow: any, columnName: string, index: number, dataType: SQLDataType, defaultValue: any): any;
    getFunctionAdaptor(): ISQLFunctionAdaptor;
}
export declare class SqlLiteFunctionAdaptor implements ISQLFunctionAdaptor {
    getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string): string;
}
