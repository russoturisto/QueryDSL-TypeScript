import { PHRawNonEntitySQLQuery, PHDistinguishableSQLQuery, PHJsonNonEntitySqlQuery } from "./PHNonEntitySQLQuery";
import { PHSQLQuery } from "../../PHSQLQuery";
import { JSONClauseField, JSONClauseObjectType } from "../../../../core/field/Appliable";
import { IQField } from "../../../../core/field/Field";
import { IQDistinctFunction } from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonFieldQSLQuery extends PHJsonNonEntitySqlQuery {
    select: JSONClauseField;
    alias: string;
    type: JSONClauseObjectType;
}
export interface PHRawFieldSQLQuery<IQF extends IQField<IQF>> extends PHRawNonEntitySQLQuery {
    select: IQF | IQDistinctFunction<IQF>;
    alias: string;
}
export declare class PHFieldSQLQuery<IQF extends IQField<IQF>> extends PHDistinguishableSQLQuery implements PHSQLQuery {
    private phRawQuery;
    constructor(phRawQuery: PHRawFieldSQLQuery<IQF>);
    nonDistinctSelectClauseToJSON(rawSelect: any): any;
    toJSON(): PHJsonFieldQSLQuery;
}
