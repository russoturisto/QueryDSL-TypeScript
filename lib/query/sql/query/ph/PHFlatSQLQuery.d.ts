import { PHSQLQuery, PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery } from "../../PHSQLQuery";
import { JSONClauseField } from "../../../../core/field/Appliable";
import { PHRawNonEntitySQLQuery, PHNonEntitySQLQuery } from "./PHNonEntitySQLQuery";
import { IQField } from "../../../../core/field/Field";
/**
 * Created by Papa on 10/23/2016.
 */
export interface PHJsonFlatQSLQuery extends PHJsonCommonNonEntitySQLQuery, PHJsonGroupedSQLQuery {
    select: JSONClauseField[];
}
export interface PHRawFlatSQLQuery<IQF extends IQField<any, IQF>> extends PHRawNonEntitySQLQuery {
    select: IQF[];
}
export declare class PHFlatSQLQuery extends PHNonEntitySQLQuery implements PHSQLQuery {
    phRawQuery: PHRawFlatSQLQuery<any>;
    constructor(phRawQuery: PHRawFlatSQLQuery<any>);
    nonDistinctSelectClauseToJSON(rawSelect: any[]): any;
    toJSON(): PHJsonFlatQSLQuery;
}
