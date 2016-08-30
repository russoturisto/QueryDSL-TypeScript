import { SQLDataType } from "../SQLStringQuery";
import { ISQLAdaptor } from "./SQLAdaptor";
/**
 * Created by Papa on 8/27/2016.
 */
export declare class OracleAdaptor implements ISQLAdaptor {
    dateToDbQuery(date: Date): string;
    getResultArray(rawResponse: any): any[];
    getResultCellValue(resultRow: any, columnName: string, index: number, dataType: SQLDataType, defaultValue: any): any;
}
