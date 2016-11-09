import { JSONSqlFunctionCall } from "./Functions";
import { JSONFunctionOperation } from "../operation/Operation";
import { PHJsonFieldQSLQuery } from "../../query/sql/query/ph/PHFieldSQLQuery";
import { IQField } from "./Field";
/**
 * Created by Papa on 10/19/2016.
 */
export declare enum JSONClauseObjectType {
    FIELD = 0,
    FIELD_FUNCTION = 1,
    FIELD_QUERY = 2,
    DISTINCT_FUNCTION = 3,
    EXISTS_FUNCTION = 4,
    MANY_TO_ONE_RELATION = 5,
}
export declare enum SQLDataType {
    BOOLEAN = 0,
    DATE = 1,
    NUMBER = 2,
    STRING = 3,
}
export interface JSONClauseObject {
    __appliedFunctions__: JSONSqlFunctionCall[];
    objectType: JSONClauseObjectType;
    dataType: SQLDataType;
}
export interface JSONClauseField extends JSONClauseObject {
    entityName?: string;
    fieldAlias: string;
    propertyName?: string;
    fieldSubQuery?: PHJsonFieldQSLQuery;
    tableAlias?: string;
    value?: string | JSONClauseField | PHJsonFieldQSLQuery;
}
export interface Appliable<JCO extends JSONClauseObject, IQF extends IQField<IQF>> {
    __appliedFunctions__: JSONSqlFunctionCall[];
    applySqlFunction<A extends Appliable<JCO, IQF>>(sqlFunctionCall: JSONSqlFunctionCall): A;
    toJSON(...args: any[]): JCO | JSONFunctionOperation;
}
