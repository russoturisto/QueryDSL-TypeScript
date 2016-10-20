import { JSONSqlFunctionCall } from "./Functions";
import { IQEntity } from "../entity/Entity";
/**
 * Created by Papa on 10/19/2016.
 */
export declare enum JSONClauseObjectType {
    FIELD = 0,
    FUNCTION = 1,
    MANY_TO_ONE_RELATION = 2,
}
export interface JSONClauseObject {
    appliedFunctions: JSONSqlFunctionCall[];
    type: JSONClauseObjectType;
}
export interface JSONClauseField extends JSONClauseObject {
    propertyName: string;
    tableAlias: string;
}
export interface Appliable<JCO extends JSONClauseObject, IQ extends IQEntity> {
    fieldName: string;
    appliedFunctions: JSONSqlFunctionCall[];
    q: IQ;
    applySqlFunction<A extends Appliable<JCO, IQ>>(sqlFunctionCall: JSONSqlFunctionCall): A;
    toJSON(): JCO;
}
export interface ISQLFunctionAdaptor {
    getFunctionCalls<A extends Appliable<any, any>>(appliable: A, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
    getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
}
export declare abstract class AbstractFunctionAdaptor implements ISQLFunctionAdaptor {
    getFunctionCalls<A extends Appliable<any, any>>(clause: JSONClauseObject, qEntityMapByAlias: {
        [alias: string]: IQEntity;
    }): string;
    abstract getFunctionCall(jsonFunctionCall: JSONSqlFunctionCall, value: string, qEntityMapByAlias: {
        [entityName: string]: IQEntity;
    }): string;
}
