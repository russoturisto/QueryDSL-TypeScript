import { ISQLAdaptor, ISQLFunctionAdaptor, SqlValueProvider, AbstractFunctionAdaptor } from "./SQLAdaptor";
import { JSONSqlFunctionCall } from "../../../core/field/Functions";
import { IQEntity } from "../../../core/entity/Entity";
import { SQLDataType } from "../../../core/field/Appliable";
/**
 * Created by Papa on 8/27/2016.
 */
export declare class SqLiteAdaptor implements ISQLAdaptor {
    protected sqlValueProvider: SqlValueProvider;
    private functionAdaptor;
    constructor(sqlValueProvider: SqlValueProvider);
    getParameterReference(parameterReferences: string[], newReference: string): string;
    dateToDbQuery(date: Date): string;
    getResultArray(rawResponse: any): any[];
    getResultCellValue(resultRow: any, columnName: string, index: number, dataType: SQLDataType, defaultValue: any): any;
    getFunctionAdaptor(): ISQLFunctionAdaptor;
    getOffsetFragment(offset: number): string;
    getLimitFragment(limit: number): string;
}
export declare class SqlLiteFunctionAdaptor extends AbstractFunctionAdaptor {
    protected sqlValueProvider: SqlValueProvider;
    constructor(sqlValueProvider: SqlValueProvider);
    getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
}
