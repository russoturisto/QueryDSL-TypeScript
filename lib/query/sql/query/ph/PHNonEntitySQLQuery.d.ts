import { PHRawSQLQuery } from "../../PHSQLQuery";
import { PHRawMappedSQLQuery } from "./PHMappedSQLQuery";
import { JSONBaseOperation } from "../../../../core/operation/Operation";
import { IFrom } from "../../../../core/entity/Entity";
import { IQOperableField } from "../../../../core/field/OperableField";
import { PHAbstractSQLQuery } from "./PHAbstractSQLQuery";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHRawNonEntitySQLQuery extends PHRawSQLQuery {
    from: (IFrom | PHRawMappedSQLQuery<any>)[];
    groupBy?: IQOperableField<any, any, any, any, any>[];
    having?: JSONBaseOperation;
    limit?: number;
    offset?: number;
}
export declare const SELECT_ERROR_MESSAGE: string;
export declare abstract class PHNonEntitySQLQuery extends PHAbstractSQLQuery {
    selectClauseToJSON(rawSelect: any): any;
    protected abstract nonDistinctSelectClauseToJSON(rawSelect: any): any;
}
