import { PHRawNonEntitySQLQuery, PHDistinguishableSQLQuery, PHJsonNonEntitySqlQuery } from "./PHNonEntitySQLQuery";
import { PHSQLQuery } from "../../PHSQLQuery";
import { IQDistinctFunction } from "../../../../core/field/Functions";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonMappedQSLQuery extends PHJsonNonEntitySqlQuery {
}
/**
 * Marker interface for entities in the select clause of a PHRawMappedSQLQuery,
 * as returned by a view or join functions.
 */
export interface IMappedEntity {
}
export interface PHRawMappedSQLQuery<IME extends IMappedEntity> extends PHRawNonEntitySQLQuery {
    select: IME | IQDistinctFunction<IME>;
}
export declare const FIELD_IN_SELECT_CLAUSE_ERROR_MESSAGE: string;
/**
 * A query whose select object is a collection of properties.
 */
export declare abstract class PHMappableSQLQuery extends PHDistinguishableSQLQuery {
    protected nonDistinctSelectClauseToJSON(rawSelect: any): any;
}
export declare class PHMappedSQLQuery<IME extends IMappedEntity> extends PHMappableSQLQuery implements PHSQLQuery {
    phRawQuery: PHRawMappedSQLQuery<IME>;
    constructor(phRawQuery: PHRawMappedSQLQuery<IME>);
    toJSON(): PHJsonMappedQSLQuery;
}
