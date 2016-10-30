import { PHSQLQuery } from "../../PHSQLQuery";
import { JSONClauseField } from "../../../../core/field/Appliable";
import { PHRawNonEntitySQLQuery, PHDistinguishableSQLQuery, PHJsonNonEntitySqlQuery } from "./PHNonEntitySQLQuery";
import { IQField } from "../../../../core/field/Field";
import { IQDistinctFunction } from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/23/2016.
 */
export interface PHJsonFlatQSLQuery extends PHJsonNonEntitySqlQuery {
    select: JSONClauseField[];
}
export interface PHRawFlatSQLQuery<IQF extends IQField<IQF>> extends PHRawNonEntitySQLQuery {
    select: IQF[] | IQDistinctFunction<IQF[]>;
}
export declare class PHFlatSQLQuery extends PHDistinguishableSQLQuery implements PHSQLQuery {
    phRawQuery: PHRawFlatSQLQuery<any>;
    constructor(phRawQuery: PHRawFlatSQLQuery<any>);
    nonDistinctSelectClauseToJSON(rawSelect: any[]): any;
    toJSON(): PHJsonFlatQSLQuery;
}
