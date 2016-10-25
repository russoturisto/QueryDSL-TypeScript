import { PHRawSQLQuery } from "../../PHSQLQuery";
import { PHRawMappedSQLQuery } from "./PHMappedSQLQuery";
import { IQField } from "../../../../core/field/Field";
import { JSONRawValueOperation } from "../../../../core/operation/Operation";
import { IFrom } from "../../../../core/entity/Entity";
/**
 * Created by Papa on 10/24/2016.
 */
export interface PHRawNonEntitySQLQuery extends PHRawSQLQuery {
    from: (IFrom | PHRawMappedSQLQuery<any>)[];
    groupBy?: IQField<any, any, any, any, any>[];
    having?: JSONRawValueOperation<any>[];
    limit?: number;
    offset?: number;
}
