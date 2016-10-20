import { SQLDialect, SQLDataType } from "../SQLStringQuery";
import { ISQLFunctionAdaptor } from "../../../core/field/Appliable";
/**
 * Created by Papa on 8/27/2016.
 */
export interface ISQLAdaptor {
    dateToDbQuery(date: Date, embedParameters: any): string | number;
    getResultArray(rawResponse: any): any[];
    /**
     * Options in returned result:
     *
     * Object mapped by ?column? name
     * Array of values
     *
     * This is a common API on top of both
     */
    getResultCellValue(resultRow: any, columnName: string, index: number, dataType: SQLDataType, defaultValue: any): any;
    getFunctionAdaptor(): ISQLFunctionAdaptor;
}
export declare function getSQLAdaptor(sqlDialect: SQLDialect): ISQLAdaptor;
