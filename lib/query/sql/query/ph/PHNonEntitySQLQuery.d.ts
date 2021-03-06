import { PHRawSQLQuery, PHJsonCommonSQLQuery, PHJsonLimitedSQLQuery } from "../../PHSQLQuery";
import { JSONBaseOperation } from "../../../../core/operation/Operation";
import { IFrom } from "../../../../core/entity/Entity";
import { IQOperableField } from "../../../../core/field/OperableField";
import { PHAbstractSQLQuery } from "./PHAbstractSQLQuery";
import { JSONFieldInGroupBy } from "../../../../core/field/FieldInOrderBy";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHJsonGroupedSQLQuery {
    groupBy?: JSONFieldInGroupBy[];
    having?: JSONBaseOperation;
}
export interface PHJsonNonEntitySqlQuery extends PHJsonCommonSQLQuery, PHJsonGroupedSQLQuery, PHJsonLimitedSQLQuery {
}
export interface PHRawNonEntitySQLQuery extends PHRawSQLQuery {
    from: IFrom[];
    groupBy?: IQOperableField<any, any, any, any>[];
    having?: JSONBaseOperation;
    limit?: number;
    offset?: number;
}
export declare const NON_ENTITY_SELECT_ERROR_MESSAGE: string;
export declare abstract class PHDistinguishableSQLQuery extends PHAbstractSQLQuery {
    protected isHierarchicalEntityQuery: boolean;
    selectClauseToJSON(rawSelect: any): any;
    protected abstract nonDistinctSelectClauseToJSON(rawSelect: any): any;
}
