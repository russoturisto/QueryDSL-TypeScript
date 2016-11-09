import { SQLDialect } from "../SQLStringQuery";
import { JSONSqlFunctionCall } from "../../../core/field/Functions";
import { JSONClauseObject, SQLDataType } from "../../../core/field/Appliable";
import { IQEntity } from "../../../core/entity/Entity";
/**
 * Created by Papa on 8/27/2016.
 */
export interface ISQLAdaptor {
    getParameterReference(parameterReferences: string[], newReference: string): string;
    dateToDbQuery(date: Date): string;
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
    getOffsetFragment(offset: number): string;
    getLimitFragment(limit: number): string;
}
export interface SqlValueProvider {
    getFunctionCallValue(rawValue: any): string;
}
export interface ISQLFunctionAdaptor {
    getFunctionCalls(clause: JSONClauseObject, innerValue: string, qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }): string;
    getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
}
export declare function getSQLAdaptor(sqlValueProvider: SqlValueProvider, sqlDialect: SQLDialect): ISQLAdaptor;
export declare abstract class AbstractFunctionAdaptor implements ISQLFunctionAdaptor {
    protected sqlValueProvider: SqlValueProvider;
    constructor(sqlValueProvider: SqlValueProvider);
    getFunctionCalls(clause: JSONClauseObject, innerValue: string, qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }): string;
    abstract getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
}
