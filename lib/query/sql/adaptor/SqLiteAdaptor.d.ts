import { ISQLAdaptor, ISQLFunctionAdaptor, SqlValueProvider } from "./SQLAdaptor";
import { SQLDataType } from "../SQLStringQuery";
import { JSONSqlFunctionCall } from "../../../core/field/Functions";
import { AbstractFunctionAdaptor } from "../../../core/field/Appliable";
import { IQEntity } from "../../../core/entity/Entity";
/**
 * Created by Papa on 8/27/2016.
 */
export declare class SqLiteAdaptor implements ISQLAdaptor {
    protected sqlValueProvider: SqlValueProvider;
    private functionAdaptor;
    constructor(sqlValueProvider: SqlValueProvider);
    dateToDbQuery(date: Date, embedParameters: boolean): string | number;
    getResultArray(rawResponse: any): any[];
    getResultCellValue(resultRow: any, columnName: string, index: number, dataType: SQLDataType, defaultValue: any): any;
    getFunctionAdaptor(): ISQLFunctionAdaptor;
    applyFunction(value: string, functionCall: JSONSqlFunctionCall, isField: boolean): string;
}
export declare class SqlLiteFunctionAdaptor extends AbstractFunctionAdaptor {
    protected sqlValueProvider: SqlValueProvider;
    constructor(sqlValueProvider: SqlValueProvider);
    getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }, forField: boolean): string;
}
