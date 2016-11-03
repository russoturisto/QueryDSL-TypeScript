import { JSONSqlFunctionCall } from "./Functions";
import { JSONFunctionOperation } from "../operation/Operation";
import { PHJsonFieldQSLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQField } from "./Field";
/**
 * Created by Papa on 10/19/2016.
 */
export declare enum JSONClauseObjectType {
    BOOLEAN_FIELD_FUNCTION = 0,
    DATE_FIELD_FUNCTION = 1,
    DISTINCT_FUNCTION = 2,
    EXISTS_FUNCTION = 3,
    FIELD = 4,
    FIELD_QUERY = 5,
    NUMBER_FIELD_FUNCTION = 6,
    MANY_TO_ONE_RELATION = 7,
    STRING_FIELD_FUNCTION = 8,
}
export interface JSONClauseObject {
    __appliedFunctions__: JSONSqlFunctionCall[];
    type: JSONClauseObjectType;
}
export interface JSONClauseField extends JSONClauseObject {
    fieldAlias: string;
    propertyName?: string;
    fieldSubQuery?: PHJsonFieldQSLQuery;
    tableAlias?: string;
    value?: boolean | Date | number | string | JSONClauseField | PHJsonFieldQSLQuery;
}
export interface Appliable<JCO extends JSONClauseObject, IQF extends IQField<IQF>> {
    __appliedFunctions__: JSONSqlFunctionCall[];
    applySqlFunction<A extends Appliable<JCO, IQF>>(sqlFunctionCall: JSONSqlFunctionCall): A;
    toJSON(): JCO | JSONFunctionOperation;
}
