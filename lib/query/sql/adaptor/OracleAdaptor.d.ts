import { SQLDataType } from "../SQLStringQuery";
import { ISQLAdaptor, ISQLFunctionAdaptor, SqlValueProvider } from "./SQLAdaptor";
/**
 * Created by Papa on 8/27/2016.
 */
export declare class OracleAdaptor implements ISQLAdaptor {
    protected sqlValueProvider: SqlValueProvider;
    constructor(sqlValueProvider: SqlValueProvider);
    dateToDbQuery(date: Date, embedParameters: boolean): string | number;
    getResultArray(rawResponse: any): any[];
    getResultCellValue(resultRow: any, columnName: string, index: number, dataType: SQLDataType, defaultValue: any): any;
    getFunctionAdaptor(): ISQLFunctionAdaptor;
}
