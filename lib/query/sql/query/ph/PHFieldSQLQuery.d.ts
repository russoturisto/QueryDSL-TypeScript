import { PHRawNonEntitySQLQuery, PHNonEntitySQLQuery } from "./PHNonEntitySQLQuery";
import { PHJsonCommonNonEntitySQLQuery, PHSQLQuery, PHJsonGroupedSQLQuery } from "../../PHSQLQuery";
import { JSONClauseField, JSONClauseObjectType } from "../../../../core/field/Appliable";
import { IQField } from "../../../../core/field/Field";
import { IQDistinctFunction } from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonFieldQSLQuery extends PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery {
    select: JSONClauseField;
    type: JSONClauseObjectType;
}
export interface PHRawFieldSQLQuery<IQF extends IQField<any, IQF>> extends PHRawNonEntitySQLQuery {
    select: IQF | IQDistinctFunction;
}
export declare class PHFieldSQLQuery<IQF extends IQField<any, IQF>> extends PHNonEntitySQLQuery implements PHSQLQuery {
    private phRawQuery;
    constructor(phRawQuery: PHRawFieldSQLQuery<IQF>);
    nonDistinctSelectClauseToJSON(rawSelect: any): any;
    toJSON(): PHJsonFieldQSLQuery;
}
