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
export declare function applyFunctionsReturnString(jsonClauseObject: JSONClauseObject): string;
