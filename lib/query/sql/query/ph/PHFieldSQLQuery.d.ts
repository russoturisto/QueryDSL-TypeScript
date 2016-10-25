import { IQField } from "../../../../core/field/Field";
import { PHRawNonEntitySQLQuery } from "./PHNonEntitySQLQuery";
import { PHJsonCommonSQLQuery } from "../../PHSQLQuery";
import { JSONClauseField, JSONClauseObjectType } from "../../../../core/field/Appliable";
import { PHJsonMappedQSLQuery } from "./PHMappedSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonFieldQSLQuery extends PHJsonCommonSQLQuery {
    select: JSONClauseField;
    type: JSONClauseObjectType;
}
export interface PHRawFieldSQLQuery<IQF extends IQField<any, any, any, any, IQF>> extends PHRawNonEntitySQLQuery {
    select: IQF;
}
export declare class PHFieldSQLQuery<IQF extends IQField<any, any, any, any, IQF>> {
    private phRawFieldSqlQuery;
    constructor(phRawFieldSqlQuery: PHRawFieldSQLQuery<IQF>);
    toJSON(): PHJsonFieldQSLQuery;
}
export declare function getSubSelectInFromClause(subSelectEntity: any): PHJsonMappedQSLQuery;
