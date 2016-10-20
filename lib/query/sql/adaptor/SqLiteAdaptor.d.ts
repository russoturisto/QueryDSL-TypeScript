import { ISQLAdaptor } from "./SQLAdaptor";
import { SQLDataType } from "../SQLStringQuery";
import { JSONSqlFunctionCall } from "../../../core/field/Functions";
import { ISQLFunctionAdaptor, AbstractFunctionAdaptor } from "../../../core/field/Appliable";
import { IQEntity } from "../../../core/entity/Entity";
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
export declare class SqlLiteFunctionAdaptor extends AbstractFunctionAdaptor {
    getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
}
