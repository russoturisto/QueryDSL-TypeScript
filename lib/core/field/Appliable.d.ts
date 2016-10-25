import { JSONSqlFunctionCall } from "./Functions";
import { IQEntity } from "../entity/Entity";
import { IQField } from "./Field";
import { JSONFunctionOperation } from "../operation/Operation";
/**
 * Created by Papa on 10/19/2016.
 */
export declare enum JSONClauseObjectType {
    DISTINCT_FUNCTION = 0,
    EXISTS_FUNCTION = 1,
    FIELD = 2,
    FIELD_FUNCTION = 3,
    FIELD_QUERY = 4,
    MANY_TO_ONE_RELATION = 5,
}
export interface JSONClauseObject {
    __appliedFunctions__: JSONSqlFunctionCall[];
    type: JSONClauseObjectType;
}
export interface JSONClauseField extends JSONClauseObject {
    propertyName?: string;
    tableAlias?: string;
}
export interface Appliable<JCO extends JSONClauseObject, IQ extends IQEntity, IQF extends IQField<IQ, any, any, any, any>> {
    __appliedFunctions__: JSONSqlFunctionCall[];
    applySqlFunction<A extends Appliable<JCO, IQ, IQF>>(sqlFunctionCall: JSONSqlFunctionCall): A;
    toJSON(): JCO | JSONFunctionOperation;
}
export interface ISQLFunctionAdaptor {
    getFunctionCalls<A extends Appliable<any, any, any>>(appliable: A, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
    getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
}
export declare abstract class AbstractFunctionAdaptor implements ISQLFunctionAdaptor {
    getFunctionCalls<A extends Appliable<any, any, any>>(clause: JSONClauseObject, qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }): string;
    abstract getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
}
