import { ISQLAdaptor, ISQLFunctionAdaptor, SqlValueProvider } from "./SQLAdaptor";
import { SQLDataType } from "../../../core/field/Appliable";
/**
 * Created by Papa on 8/27/2016.
 */
export declare class OracleAdaptor implements ISQLAdaptor {
    protected sqlValueProvider: SqlValueProvider;
    constructor(sqlValueProvider: SqlValueProvider);
    getParameterReference(parameterReferences: string[], newReference: string): string;
    dateToDbQuery(date: Date): string;
    getResultArray(rawResponse: any): any[];
    getResultCellValue(resultRow: any, columnName: string, index: number, dataType: SQLDataType, defaultValue: any): any;
    getFunctionAdaptor(): ISQLFunctionAdaptor;
    getOffsetFragment(offset: number): string;
    getLimitFragment(limit: number): string;
}
