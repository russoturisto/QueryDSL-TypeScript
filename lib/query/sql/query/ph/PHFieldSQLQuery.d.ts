import { PHRawNonEntitySQLQuery, PHDistinguishableSQLQuery, PHJsonNonEntitySqlQuery } from "./PHNonEntitySQLQuery";
import { PHSQLQuery } from "../../PHSQLQuery";
import { JSONClauseField, JSONClauseObjectType, SQLDataType } from "../../../../core/field/Appliable";
import { IQField } from "../../../../core/field/Field";
import { IQDistinctFunction } from "../../../../core/field/Functions";
import { EntityAliases } from "../../../../core/entity/Aliases";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonFieldQSLQuery extends PHJsonNonEntitySqlQuery {
    select: JSONClauseField;
    objectType: JSONClauseObjectType;
    dataType: SQLDataType;
}
export interface PHRawFieldSQLQuery<IQF extends IQField<IQF>> extends PHRawNonEntitySQLQuery {
    select: IQF | IQDistinctFunction<IQF>;
}
export declare class PHFieldSQLQuery<IQF extends IQField<IQF>> extends PHDistinguishableSQLQuery implements PHSQLQuery {
    private phRawQuery;
    constructor(phRawQuery: PHRawFieldSQLQuery<IQF>, entityAliases: EntityAliases);
    nonDistinctSelectClauseToJSON(rawSelect: any): any;
    toJSON(): PHJsonFieldQSLQuery;
    getClauseDataType(): SQLDataType;
}
